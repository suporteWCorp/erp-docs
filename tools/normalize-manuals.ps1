param(
    [switch]$Apply,
    [string]$PreviewFile = ""
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$moduleFolders = @(
    "administracao", "colaboradores", "comercial", "compras", "contratos", "faturamento",
    "financeiro", "fornecedores", "materiais", "producao", "relatorios", "servicos", "transportes"
)

function Get-SectionKind([string]$title) {
    $normalized = $title.Trim().ToLowerInvariant()
    if ($normalized -match '^(objetivo|finalidade da tela)$') { return "objective" }
    if ($normalized -match '^(caminho|caminho no wcorp|print da tela com caminho)$') { return "path" }
    if ($normalized -match '^quando (usar|utilizar)$') { return "when" }
    if ($normalized -eq 'passo a passo') { return "steps" }
    if ($normalized -match '^(avisos?|observa[cç][aã]o|orienta[cç][aã]o para suporte)$') { return "warnings" }
    if ($normalized -match '^d[uú]vidas (frequentes|comuns do usu[aá]rio)$') { return "faq" }
    if ($normalized -match '^veja tamb[eé]m$') { return "related" }
    return "other"
}

function Join-Parts([System.Collections.Generic.List[string]]$parts) {
    return (($parts | Where-Object { $_ -and $_.Trim() }) -join "`n`n").Trim()
}

function Convert-ManualPage([string]$content) {
    $content = $content -replace "`r`n", "`n"
    $titleMatch = [regex]::Match($content, '(?m)^# .+$')
    if (-not $titleMatch.Success) { return $content }

    $h2Matches = [regex]::Matches($content, '(?m)^## (.+)$')
    if ($h2Matches.Count -eq 0) { return $content }

    $titleLine = $titleMatch.Value.Trim()
    $preambleStart = $titleMatch.Index + $titleMatch.Length
    $preambleEnd = $h2Matches[0].Index
    $preamble = $content.Substring($preambleStart, $preambleEnd - $preambleStart).Trim()

    $groups = @{
        objective = [System.Collections.Generic.List[string]]::new()
        path = [System.Collections.Generic.List[string]]::new()
        when = [System.Collections.Generic.List[string]]::new()
        steps = [System.Collections.Generic.List[string]]::new()
        warnings = [System.Collections.Generic.List[string]]::new()
        faq = [System.Collections.Generic.List[string]]::new()
        related = [System.Collections.Generic.List[string]]::new()
        other = [System.Collections.Generic.List[string]]::new()
    }

    for ($index = 0; $index -lt $h2Matches.Count; $index++) {
        $match = $h2Matches[$index]
        $bodyStart = $match.Index + $match.Length
        $bodyEnd = if ($index + 1 -lt $h2Matches.Count) { $h2Matches[$index + 1].Index } else { $content.Length }
        $body = $content.Substring($bodyStart, $bodyEnd - $bodyStart).Trim()
        $heading = $match.Groups[1].Value.Trim()
        $kind = Get-SectionKind $heading

        if ($kind -eq "other") {
            $groups.other.Add("### $heading`n`n$body".Trim())
        } elseif ($body) {
            $groups[$kind].Add($body)
        }
    }

    if ($preamble) { $groups.objective.Insert(0, $preamble) }

    $objective = Join-Parts $groups.objective
    $imageLines = [System.Collections.Generic.List[string]]::new()
    if ($objective) {
        $objectiveLines = [System.Collections.Generic.List[string]]::new()
        foreach ($line in ($objective -split "`n")) {
            if ($line -match '^!\[[^\]]*\]\([^\)]+\)\s*$') {
                $imageLines.Add($line.Trim())
            } else {
                $objectiveLines.Add($line)
            }
        }
        $objective = (($objectiveLines -join "`n") -replace "`n{3,}", "`n`n").Trim()
    }

    $pathParts = [System.Collections.Generic.List[string]]::new()
    $pathText = Join-Parts $groups.path
    if ($pathText) { $pathParts.Add($pathText) }
    if ($imageLines.Count) { $pathParts.Add(($imageLines -join "`n`n")) }

    $stepParts = [System.Collections.Generic.List[string]]::new()
    $stepsText = Join-Parts $groups.steps
    if ($stepsText) { $stepParts.Add($stepsText) }
    foreach ($part in $groups.other) { $stepParts.Add($part) }

    $output = [System.Collections.Generic.List[string]]::new()
    $output.Add($titleLine)
    if ($objective) { $output.Add("## Objetivo`n`n$objective") }
    $path = Join-Parts $pathParts
    if ($path) { $output.Add("## Print da tela com caminho`n`n$path") }
    $when = Join-Parts $groups.when
    if ($when) { $output.Add("## Quando usar`n`n$when") }
    $steps = Join-Parts $stepParts
    if ($steps) { $output.Add("## Passo a passo`n`n$steps") }
    $warnings = Join-Parts $groups.warnings
    if ($warnings) { $output.Add("## Avisos`n`n$warnings") }
    $faq = Join-Parts $groups.faq
    if ($faq) { $output.Add("## Dúvidas frequentes`n`n$faq") }
    $related = Join-Parts $groups.related
    if ($related) { $output.Add("## Veja também`n`n$related") }

    return (($output -join "`n`n") + "`n")
}

$changed = [System.Collections.Generic.List[string]]::new()
foreach ($folder in $moduleFolders) {
    $folderPath = Join-Path (Join-Path $repoRoot "docs") $folder
    foreach ($file in Get-ChildItem -LiteralPath $folderPath -File -Filter "*.md") {
        if ($file.BaseName.EndsWith("-geral")) { continue }
        $original = Get-Content -Raw -LiteralPath $file.FullName
        $updated = Convert-ManualPage $original
        $relative = $file.FullName.Substring($repoRoot.Length + 1)

        if ($PreviewFile -and $relative -eq $PreviewFile) {
            Write-Output $updated
            exit 0
        }

        if ($updated -ne ($original -replace "`r`n", "`n")) {
            $changed.Add($relative)
            if ($Apply) {
                Set-Content -LiteralPath $file.FullName -Value $updated -Encoding utf8NoBOM -NoNewline
            }
        }
    }
}

$action = if ($Apply) { "Atualizados" } else { "Seriam atualizados" }
Write-Output "${action}: $($changed.Count) Manuais."
$changed | ForEach-Object { Write-Output $_ }

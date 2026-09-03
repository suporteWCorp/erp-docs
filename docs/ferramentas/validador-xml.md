<div class="wcorp-inner-page wcorp-tool-page wcorp-xml-page" markdown>

# Validador de XML

Carregue ou cole um XML para uma verificação inicial da estrutura do arquivo.

<div class="wc-inner-callout" markdown>
**Validação inicial**

Esta ferramenta verifica inicialmente a estrutura do arquivo. A validação completa das regras fiscais será implementada posteriormente.
</div>

<div class="wc-tool-panel wc-xml-validator" markdown>

<label class="wc-xml-dropzone">
  <span>Arraste um XML ou selecione o arquivo</span>
  <input type="file" accept=".xml,text/xml,application/xml" data-wc-xml-file>
</label>

<div class="wc-tool-separator">OU</div>

<div class="wc-tool-field wc-xml-editor wc-xml-editor--editing" data-wc-xml-editor>
  <div class="wc-xml-editor__header">
    <span data-wc-xml-editor-title>Conteúdo do XML</span>
    <div class="wc-xml-editor__actions" data-wc-xml-actions hidden>
      <button type="button" data-wc-xml-expand>Expandir tudo</button>
      <button type="button" data-wc-xml-collapse>Recolher tudo</button>
      <button type="button" data-wc-xml-edit>Editar XML</button>
      <button type="button" data-wc-xml-fullscreen>Ampliar</button>
    </div>
  </div>
  <textarea class="wc-tool-textarea" data-wc-xml-content rows="12" placeholder="Cole aqui o conteúdo do XML"></textarea>
  <div class="wc-xml-loading" data-wc-xml-loading hidden>
    <span class="wc-xml-loading__spinner" aria-hidden="true"></span>
    <strong>Analisando XML...</strong>
    <span>Verificando estrutura e conteúdo</span>
  </div>
  <div class="wc-xml-tree" data-wc-xml-tree hidden tabindex="0" aria-label="XML analisado"></div>
</div>

<button class="md-button md-button--primary wc-tool-action" type="button" data-wc-xml-validate>Validar XML</button>

<div class="wc-tool-result" data-wc-xml-result aria-live="polite"></div>

</div>

</div>

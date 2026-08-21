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

<label class="wc-tool-field">
  <span>Conteúdo do XML</span>
  <textarea class="wc-tool-textarea" data-wc-xml-content rows="12" placeholder="Cole aqui o conteúdo do XML"></textarea>
</label>

<button class="md-button md-button--primary wc-tool-action" type="button" data-wc-xml-validate>Validar XML</button>

<div class="wc-tool-result" data-wc-xml-result aria-live="polite"></div>

</div>

</div>

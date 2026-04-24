# QAutofill

Este workspace agora esta organizado em dois projetos de extensao:

- `chrome/`: pacote para Chrome Web Store e navegadores Chromium.
- `firefox/`: pacote para AMO (addons.mozilla.org) e Firefox.

## Diferencas principais

### Chrome

- Usa `manifest_version: 3`.
- Usa `background.service_worker`.
- Mantem o fluxo atual baseado na API `chrome.*`.

### Firefox

- Usa `manifest_version: 3`.
- Usa `background.scripts` no lugar de `background.service_worker`.
- Define `browser_specific_settings.gecko.id` para assinatura e publicacao.
- Declara `browser_specific_settings.gecko.data_collection_permissions.required = ["none"]`.

## Como empacotar

### Chrome

1. Compacte o conteudo da pasta `chrome/` em um `.zip`.
2. Envie o `.zip` para a Chrome Web Store.

### Firefox

1. Compacte o conteudo da pasta `firefox/` em um `.zip` ou `.xpi`.
2. Envie o pacote para a AMO para assinatura e revisao.

## Recomendacao de manutencao

- Evolua novas features primeiro em `chrome/`.
- Sempre que a feature estiver estavel, replique em `firefox/` validando compatibilidade do `manifest` e das APIs.
- Se o projeto crescer, o proximo passo natural e extrair uma pasta `shared/` com a logica comum e manter apenas os manifests separados.

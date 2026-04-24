function gerarTelefone() {
  const ddd = Math.floor(Math.random() * 90 + 10);
  const numero = Math.floor(Math.random() * 90000000 + 10000000);
  return `${ddd} ${numero}`;
}

function gerarCPF() {
  const n = Array(9)
    .fill(0)
    .map(() => Math.floor(Math.random() * 9));

  let d1 = n.reduce((acc, val, idx) => acc + val * (10 - idx), 0);
  d1 = 11 - (d1 % 11);
  if (d1 > 9) {
    d1 = 0;
  }

  let d2 = n.reduce((acc, val, idx) => acc + val * (11 - idx), 0) + d1 * 2;
  d2 = 11 - (d2 % 11);
  if (d2 > 9) {
    d2 = 0;
  }

  return `${n.slice(0, 3).join("")}.${n.slice(3, 6).join("")}.${n.slice(6, 9).join("")}-${d1}${d2}`;
}

function gerarCNPJ() {
  const n = Array(12)
    .fill(0)
    .map(() => Math.floor(Math.random() * 9));
  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  let d1 = n.reduce((acc, val, idx) => acc + val * pesos1[idx], 0);
  d1 = 11 - (d1 % 11);
  if (d1 > 9) {
    d1 = 0;
  }

  let d2 = n.reduce((acc, val, idx) => acc + val * pesos2[idx], 0) + d1 * 2;
  d2 = 11 - (d2 % 11);
  if (d2 > 9) {
    d2 = 0;
  }

  return `${n.slice(0, 2).join("")}.${n.slice(2, 5).join("")}.${n.slice(5, 8).join("")}/${n.slice(8, 12).join("")}-${d1}${d2}`;
}

async function buscarCepReal() {
  const cepsExemplo = ["01001000", "20010000", "70040000", "60010000", "80010000"];
  const sorteado = cepsExemplo[Math.floor(Math.random() * cepsExemplo.length)];

  try {
    const response = await fetch(`https://viacep.com.br/ws/${sorteado}/json/`);
    const data = await response.json();
    return data.cep;
  } catch (_error) {
    return "01001-000";
  }
}

function criarMenus() {
  browser.contextMenus.create({ id: "main", title: "QAutofill", contexts: ["editable"] });

  browser.contextMenus.create({ id: "positive", title: "Partições Positivas", parentId: "main", contexts: ["editable"] });
  browser.contextMenus.create({ id: "positive-text", title: "teste", parentId: "positive", contexts: ["editable"] });
  browser.contextMenus.create({ id: "positive-zero", title: "0", parentId: "positive", contexts: ["editable"] });
  browser.contextMenus.create({ id: "positive-hundred", title: "100", parentId: "positive", contexts: ["editable"] });
  browser.contextMenus.create({ id: "positive-decimal", title: "0,1", parentId: "positive", contexts: ["editable"] });
  browser.contextMenus.create({ id: "positive-money", title: "9.999.999.999,99", parentId: "positive", contexts: ["editable"] });
  browser.contextMenus.create({ id: "positive-email", title: "teste@dasilva.com", parentId: "positive", contexts: ["editable"] });

  browser.contextMenus.create({ id: "negative", title: "Partições Negativas", parentId: "main", contexts: ["editable"] });
  browser.contextMenus.create({ id: "negative-uppercase", title: "TESTE", parentId: "negative", contexts: ["editable"] });
  browser.contextMenus.create({ id: "negative-empty", title: "' ' - Vazio", parentId: "negative", contexts: ["editable"] });
  browser.contextMenus.create({ id: "negative-255", title: "255 Caracteres", parentId: "negative", contexts: ["editable"] });
  browser.contextMenus.create({ id: "negative-101", title: "101", parentId: "negative", contexts: ["editable"] });
  browser.contextMenus.create({ id: "negative-101001", title: "101,001", parentId: "negative", contexts: ["editable"] });
  browser.contextMenus.create({ id: "negative-minus-50", title: "-50", parentId: "negative", contexts: ["editable"] });
  browser.contextMenus.create({ id: "negative-minus-01", title: "-0,1", parentId: "negative", contexts: ["editable"] });
  browser.contextMenus.create({ id: "negative-site", title: "teste.com", parentId: "negative", contexts: ["editable"] });
  browser.contextMenus.create({ id: "negative-email-missing-domain", title: "teste@", parentId: "negative", contexts: ["editable"] });
  browser.contextMenus.create({ id: "negative-email-missing-user", title: "@email.com", parentId: "negative", contexts: ["editable"] });
  browser.contextMenus.create({ id: "negative-accent", title: "áéíóúàâêôãõç", parentId: "negative", contexts: ["editable"] });
  browser.contextMenus.create({ id: "negative-script", title: "<script>alert('QA')</script>", parentId: "negative", contexts: ["editable"] });

  browser.contextMenus.create({ id: "tel", title: "Telefone (Gerar)", parentId: "main", contexts: ["editable"] });
  browser.contextMenus.create({ id: "cpf", title: "CPF Válido (Gerar)", parentId: "main", contexts: ["editable"] });
  browser.contextMenus.create({ id: "cnpj", title: "CNPJ Válido (Gerar)", parentId: "main", contexts: ["editable"] });
  browser.contextMenus.create({ id: "cep-api", title: "CEP Válido (API)", parentId: "main", contexts: ["editable"] });
  browser.contextMenus.create({ id: "lorem", title: "Lorem Ipsum", parentId: "main", contexts: ["editable"] });
}

function resolverTexto(menuItemId) {
  switch (menuItemId) {
    case "positive-text":
      return "teste";
    case "positive-zero":
      return "0";
    case "positive-hundred":
      return "100";
    case "positive-decimal":
      return "0,1";
    case "positive-money":
      return "9.999.999.999,99";
    case "positive-email":
      return "teste@dasilva.com";
    case "negative-uppercase":
      return "TESTE";
    case "negative-empty":
      return " ";
    case "negative-255":
      return "BUG".repeat(85);
    case "negative-101":
      return "101";
    case "negative-101001":
      return "101,001";
    case "negative-minus-50":
      return "-50";
    case "negative-minus-01":
      return "-0,1";
    case "negative-site":
      return "teste.com";
    case "negative-email-missing-domain":
      return "teste@";
    case "negative-email-missing-user":
      return "@email.com";
    case "negative-accent":
      return "\u00e1\u00e9\u00ed\u00f3\u00fa\u00e0\u00e2\u00ea\u00f4\u00e3\u00f5\u00e7";
    case "negative-script":
      return "<script>alert('QA')</script>";
    case "tel":
      return gerarTelefone();
    case "cpf":
      return gerarCPF();
    case "cnpj":
      return gerarCNPJ();
    case "lorem":
      return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
    default:
      return null;
  }
}

browser.runtime.onInstalled.addListener(async () => {
  await browser.contextMenus.removeAll();
  criarMenus();
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab || typeof tab.id !== "number") {
    return;
  }

  const text = info.menuItemId === "cep-api"
    ? await buscarCepReal()
    : resolverTexto(info.menuItemId);

  if (!text) {
    return;
  }

  try {
    await browser.tabs.sendMessage(tab.id, { action: "fill_text", text });
  } catch (error) {
    console.warn("Aba nao esta pronta:", error);
  }
});

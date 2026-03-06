// =================================================================
// 1. FUNÇÕES AUXILIARES E GERADORES
// =================================================================

function gerarTelefone() {
  const ddd = Math.floor(Math.random() * 90 + 10);
  const numero = Math.floor(Math.random() * 90000000 + 10000000);
  return `${ddd} ${numero}`;
}

function gerarCPF() {
  let n = Array(9).fill(0).map(() => Math.floor(Math.random() * 9));
  let d1 = n.reduce((acc, val, idx) => acc + val * (10 - idx), 0);
  d1 = 11 - (d1 % 11); if (d1 > 9) d1 = 0;
  let d2 = n.reduce((acc, val, idx) => acc + val * (11 - idx), 0) + d1 * 2;
  d2 = 11 - (d2 % 11); if (d2 > 9) d2 = 0;
  return `${n.slice(0,3).join('')}.${n.slice(3,6).join('')}.${n.slice(6,9).join('')}-${d1}${d2}`;
}

function gerarCNPJ() {
  let n = Array(12).fill(0).map(() => Math.floor(Math.random() * 9));
  let pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let d1 = n.reduce((acc, val, idx) => acc + val * pesos1[idx], 0);
  d1 = 11 - (d1 % 11); if (d1 > 9) d1 = 0;
  let pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let d2 = n.reduce((acc, val, idx) => acc + val * pesos2[idx], 0) + d1 * 2;
  d2 = 11 - (d2 % 11); if (d2 > 9) d2 = 0;
  return `${n.slice(0,2).join('')}.${n.slice(2,5).join('')}.${n.slice(5,8).join('')}/${n.slice(8,12).join('')}-${d1}${d2}`;
}

// Busca CEP real via API (Assíncrono)
async function buscarCepReal() {
  const cepsExemplo = ["01001000", "20010000", "70040000", "60010000", "80010000"];
  const sorteado = cepsExemplo[Math.floor(Math.random() * cepsExemplo.length)];
  try {
    const response = await fetch(`https://viacep.com.br/ws/${sorteado}/json/`);
    const data = await response.json();
    return data.cep; // Retorna ex: "01001-000"
  } catch (e) {
    return "01001-000"; // Fallback se a API falhar
  }
}

// =================================================================
// 2. CRIAÇÃO DOS MENUS (Limpa antes de criar para não duplicar)
// =================================================================
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    // Menu Principal
    chrome.contextMenus.create({ id: "main", title: "QAutofill", contexts: ["editable"] });

    // Submenus Técnicos (CTFL)
    chrome.contextMenus.create({ id: "bva", title: "Valores Limites", parentId: "main", contexts: ["editable"] });
    chrome.contextMenus.create({ id: "insert-vazio", title: "Vazio", parentId: "bva", contexts: ["editable"] });
    chrome.contextMenus.create({ id: "insert-255", title: "255 Caracteres", parentId: "bva", contexts: ["editable"] });

    chrome.contextMenus.create({ id: "ep-text", title: "Partições de Texto", parentId: "main", contexts: ["editable"] });
    chrome.contextMenus.create({ id: "alfa-acento", title: "Com Acentuação", parentId: "ep-text", contexts: ["editable"] });

    chrome.contextMenus.create({ id: "sujeiras", title: "Sujeiras (XSS/Emoji)", parentId: "main", contexts: ["editable"] });
    chrome.contextMenus.create({ id: "script", title: "Script (XSS)", parentId: "sujeiras", contexts: ["editable"] });

    // Itens de Clique Direto (Sem submenus)
    chrome.contextMenus.create({ id: "tel", title: "Telefone (Gerar)", parentId: "main", contexts: ["editable"] });
    chrome.contextMenus.create({ id: "cpf", title: "CPF Válido (Gerar)", parentId: "main", contexts: ["editable"] });
    chrome.contextMenus.create({ id: "cnpj", title: "CNPJ Válido (Gerar)", parentId: "main", contexts: ["editable"] });
    chrome.contextMenus.create({ id: "cep-api", title: "CEP Válido (API)", parentId: "main", contexts: ["editable"] });
    
    // Lorem Ipsum agora é um clique direto, sem filhos
    chrome.contextMenus.create({ id: "lorem", title: "Lorem Ipsum", parentId: "main", contexts: ["editable"] });
  });
});

// =================================================================
// 3. OUVINTE DE CLIQUES (Async para suportar a API)
// =================================================================
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  let text = null;

  // Lógica específica para o CEP (API)
  if (info.menuItemId === "cep-api") {
    text = await buscarCepReal();
  } else {
    // Switch para os demais geradores síncronos
    switch (info.menuItemId) {
      case "insert-vazio": text = " "; break;
      case "insert-255": text = "a".repeat(255); break;
      case "alfa-acento": text = "áéíóúàâêôãõç"; break;
      case "script": text = "<script>alert('QA')</script>"; break;
      case "tel": text = gerarTelefone(); break;
      case "cpf": text = gerarCPF(); break;
      case "cnpj": text = gerarCNPJ(); break;
      case "lorem": 
        text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."; 
        break;
    }
  }

  if (text) {
    chrome.tabs.sendMessage(tab.id, { action: "fill_text", text: text })
      .catch(err => console.warn("Aba não está pronta:", err));
  }
});
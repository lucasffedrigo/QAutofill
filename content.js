let lastRightClickedElement = null;

document.addEventListener("contextmenu", (event) => {
  lastRightClickedElement = event.target;
}, true);

// 2. "Ouve" as mensagens vindas do background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  if (request.action === "fill_text" && lastRightClickedElement) {
    
    // Verifica se o elemento é um campo editável e preenche o valor
    if (lastRightClickedElement.tagName === 'INPUT' || lastRightClickedElement.tagName === 'TEXTAREA') {
      
      lastRightClickedElement.value = request.text;
      lastRightClickedElement.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
});
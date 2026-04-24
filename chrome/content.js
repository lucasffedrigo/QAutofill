const runtimeApi = typeof browser !== "undefined" ? browser.runtime : chrome.runtime;
let lastRightClickedElement = null;

document.addEventListener(
  "contextmenu",
  (event) => {
    lastRightClickedElement = event.target;
  },
  true
);

runtimeApi.onMessage.addListener((request) => {
  if (request.action !== "fill_text" || !lastRightClickedElement) {
    return;
  }

  const tagName = lastRightClickedElement.tagName;
  if (tagName !== "INPUT" && tagName !== "TEXTAREA") {
    return;
  }

  lastRightClickedElement.value = request.text;
  lastRightClickedElement.dispatchEvent(new Event("input", { bubbles: true }));
});

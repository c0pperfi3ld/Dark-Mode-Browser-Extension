// background.js

chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-dark-mode') {
    chrome.storage.local.get(['global'], (result) => {
      const isGlobalEnabled = result.global !== undefined ? result.global : true;
      const newState = !isGlobalEnabled;
      
      chrome.storage.local.set({ global: newState }, () => {
        // Send message to all tabs to update
        chrome.tabs.query({}, (tabs) => {
          for (const tab of tabs) {
            chrome.tabs.sendMessage(tab.id, {
              action: 'toggleGlobal',
              enabled: newState
            }).catch(err => {
              // Ignore errors for tabs where content script isn't injected
            });
          }
        });
      });
    });
  }
});

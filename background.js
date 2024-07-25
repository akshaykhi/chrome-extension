chrome.omnibox.onInputEntered.addListener(async (text, disposition) => {
      const shortlink = text;
      try {
        const redirect = await getRedirectUrl(shortlink);
        if (redirect.redirectUrl) {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
              const currentTab = tabs[0];
              chrome.tabs.update(currentTab.id, { url: redirect.redirectUrl });
            }
          });
        }
      } catch (error) {
        console.error('Failed to get redirect URL:', error);
      }
  });
  
  async function getRedirectUrl(text) {
    try {
      const response = await fetch(`http://localhost:8081/go/${text}`, {
        method: 'GET',
        mode: 'cors'
      });
  
      const url = await response.text();
      return { redirectUrl: url };
    } catch (error) {
      console.error('Error:', error);
      return { redirectUrl: null };
    }
  }
  
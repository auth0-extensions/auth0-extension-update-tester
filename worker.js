var rewriteExtensions = function(details) {
  if (details.url === 'https://cdn.auth0.com/extensions/extensions.json') {
    console.log('Redirecting extensions.json', {
      originalUrl: details.url,
      destination: 'https://cdn.auth0.com/extensions/develop/extensions.json'
    });

    return { redirectUrl: 'https://cdn.auth0.com/extensions/develop/extensions.json' };
  }
};

chrome.webRequest.onBeforeRequest.addListener(rewriteExtensions, { urls: [ 'https://cdn.auth0.com/*' ] }, [ 'blocking' ]);

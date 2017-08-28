var cloudPath = '/extensions/extensions.json';
var appliancePath = '/configuration/static/extensions.json'
var devUrl = 'https://cdn.auth0.com/extensions/develop/extensions.json';
var urlFilter = [
  'https://cdn.auth0.com/extensions/extensions.json',
  'https://*'+appliancePath
];

var rewriteExtensions = function(details) {
  console.log('Headers Received Details: ', details);
  if (details.url.endsWith(cloudPath) || details.url.endsWith(appliancePath)) {
    console.log('Redirecting extension.json', {
      originalUrl: details.url,
      destination: devUrl,
      applianceDetected: details.url !== devUrl
    });

    return { redirectUrl: devUrl };
  }
};

var rewriteRequestHeaders = function (details) {
  console.log('Details: ', details);
  
   var headers = details.requestHeaders.filter(function(header) {
      var name = header.name.toLowerCase();
      return false;
      return name !== 'origin' &&
             name !== 'referer' &&
             name !== 'access-control-request-method' &&
             name !== 'access-control-request-headers'
             name !== 'dnt';
    });
  
    headers.push({ name: 'Origin', value: 'https://cdn.auth0.com' });
    headers.push({ name: 'Access-Control-Request-Method', value: 'GET' });
    headers.push({ name: 'Access-Control-Request-Headers', value: '' });
    headers.push( {name: 'X-Requested-With', value: 'XMLHttpRequest' });
    return { requestHeaders: headers };
};

var rewriteResponseHeaders = function (details) {
  var headers = details.responseHeaders.filter(function (header) {
    var name = header.name.toLowerCase();

    return name !== 'access-controll-allow-methods' &&
           name !== 'access-control-allow-origin' &&
           name !== 'access-control-max-age' &&
           name !== 'Access-Control-Allow-Headers';

  });

  console.log('Headers: ', headers);

  headers.push({ name: 'access-control-allow-methods', value: 'GET' });
  headers.push({ name: 'access-control-allow-origin', value: '*' });
  headers.push({ name: 'access-control-max-age', value: '5' });
  headers.push({ name: 'access-control-allow-headers', value: 'Origin, Access-Control-Request-Headers, Access-Control-Request-Method, X-Requested-With' });
  headers.push({ name: 'vary', value:'Origin, Access-Control-Request-Headers, Access-Control-Request-Method, X-Requested-With' });

  return {
    responseHeaders: headers
  };
};

chrome.webRequest.onBeforeRequest.addListener(rewriteExtensions, { urls: urlFilter }, [ 'blocking' ]);
chrome.webRequest.onBeforeSendHeaders.addListener(rewriteRequestHeaders, { urls: [devUrl] }, ['blocking', 'requestHeaders']);
chrome.webRequest.onHeadersReceived.addListener(rewriteResponseHeaders, { urls: [devUrl] }, ['blocking', 'responseHeaders']);

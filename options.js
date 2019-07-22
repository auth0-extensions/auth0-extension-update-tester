function save() {
  var extensions = document.getElementById('extensions').value;
  chrome.storage.sync.set({
    extensions: extensions
  }, function() {});
}

function load() {
  chrome.storage.sync.get({
    extensions: 'https://cdn.auth0.com/extensions/develop/extensions.json'
  }, function(items) {
    document.getElementById('extensions').value = items.extensions;
  });
}

document.addEventListener('DOMContentLoaded', load);
document.getElementById('save').addEventListener('click', save);

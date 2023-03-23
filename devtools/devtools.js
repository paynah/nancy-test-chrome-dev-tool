console.log('Hey I am from devtools');

chrome.devtools.panels.create('Test Panel', '', 'index.html', () => {});
const sendMessageToBackground = (msg) => {
  // The message should be a JSON-ifiable object.
  console.log('content.js sending message to background script:', msg);
  chrome.runtime.sendMessage({ message: msg} );
}

const onMessageFromBackground = msg => {
  console.log('content.js received message from background:', msg);
  return false;
}

sendMessageToBackground('HELLO FROM CONTENT.JS');

chrome.runtime.onMessage.addListener(onMessageFromBackground);

// window.addEventListener('message', msg => {
//   console.log('content.js - something happened!', msg);
// });
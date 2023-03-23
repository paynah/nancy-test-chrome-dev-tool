let port = null;

document.addEventListener('DOMContentLoaded', () => {
  console.log('index.js: DOM content has been loaded');
  connectToBackgroundScript();

  const testBtn = document.querySelector('#test-btn');
  testBtn.addEventListener('click', testBtnClick);
});

const testBtnClick = (event) => {
  console.log('index.js: Test Me button has been clicked');
  
  sendMessageToBackground('the Test Me button got clicked');
}

const connectToBackgroundScript = () => {
  if (port) return;

  port = chrome.runtime.connect();

  port.onMessage.addListener(onMessageFromBackground);
};

/****************************************
 * BACKGROUND SCRIPT COMMUNICATIONS
 ***************************************/
const sendMessageToBackground = (msg) => {
  console.log('index.js sending test message:', msg);
  if (port === null) {
    console.log('No port, exiting...');
    return;
  }

  port.postMessage({message: msg});
}

// Parameters must be in the format: 
// (message: any, sender: MessageSender, sendResponse: function) => boolean | undefined
const onMessageFromBackground = (msg, sender, sendResponse) => {
  console.log('index.js received message from background:', msg.message);
};
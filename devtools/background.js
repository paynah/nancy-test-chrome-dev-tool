// chrome.runtime.onInstalled.addListener(() => {
//   console.log('Installed!');
// });

let tab;
const portsArr = [];

class Tab {
  constructor(tabTitle, tabId) {
    this.tabTitle = tabTitle;
    this.tabId = tabId;
  }
}

/****************************************
 * DEV TOOL COMMUNICATIONS
 ***************************************/
const onMessageFromDevTool = msg => {
  console.log('background.js received a message from the dev tool:', msg.message);
  sendMessageToContentScript(msg.message);
}

const sendMessageToDevTool = msg => {
  if (portsArr.length === 0) {
    console.log('background.js: no ports to send message to!');
    return;
  }
  console.log('background.js sending message to dev tool:', msg);
  portsArr[0].postMessage({message: msg});
}

/****************************************
 * CONTENT SCRIPT COMMUNICATIONS
 ***************************************/
const onMessageFromContentScript = (request, sender, sendResponse) => {
  console.log('background.js received message:', request.message);

  const tabTitle = sender.tab.title;
  const tabId = sender.tab.id;
  setTab(tabTitle, tabId);
}

const sendMessageToContentScript = msg => {
  if (tab === undefined) {
    console.log('background.js: no tab to send message to');
    return;
  }
  console.log('background.js sending message to content.js:', msg);
  chrome.tabs.sendMessage(tab.tabId, msg);
}

/****************************************
 * 
 ***************************************/
const setTab = (tabTitle, tabId) => {
  if (tab !== undefined) {
    console.log('background.js: Existing tab data being overwritten: tabTitle=', tab.tabTitle, 'tabId=', tab.tabId);
  }
  console.log('background.js: new tab data, tabTitle=', tabTitle, 'tabId=', tabId);
  tab = new Tab(tabTitle, tabId);
}

// Establish connection with dev tool
chrome.runtime.onConnect.addListener(port => {
  // Add the port to our ports array
  // Not sure if we even need a ports array???
  portsArr.push(port);

  // Attach an event listener to each port for messages from the dev tool
  port.onMessage.addListener(onMessageFromDevTool);

  // Send a test message!
  sendMessageToDevTool('hello from background.js!');
});

// Attach event listener for messages from content script
chrome.runtime.onMessage.addListener(onMessageFromContentScript);
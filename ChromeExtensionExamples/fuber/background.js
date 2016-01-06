var fuber;
var gmail_id, uber_id;

chrome.runtime.onMessage.addListener(function(msg, sender) {
    if (msg.subject === 'init_gmail') {      
      chrome.tabs.create( { url: 'https://accounts.google.com/SignUp?service=mail', active:true }, function(tab) {
        gmail_id = tab.id;
        chrome.tabs.executeScript(gmail_id, {file: 'jquery.js'});
        chrome.tabs.executeScript(gmail_id, {file: 'gmail_content.js'});
      });
    } 
    else if (msg.subject === 'init_uber') {   

      chrome.tabs.create( { url: 'https://get.uber.com/sign-up/', active:false }, function(tab) {
        uber_id = tab.id;
        chrome.tabs.executeScript(uber_id, {file: 'jquery.js'});
        chrome.tabs.executeScript(uber_id, {file: 'uber_content.js'});
      });
    }
    else if (msg.subject === 'send_fuber_data') {
      chrome.tabs.sendMessage(
        sender.tab.id,
        {from: 'background', subject: 'fuber_data', fuber:fuber});
    } 
    else if (msg.from === 'popup' && msg.subject === 'fuber_data') {
      fuber = msg.fuber;
    }
});



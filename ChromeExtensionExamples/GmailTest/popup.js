//------------------DOC READY-------------------//
// When the popup HTML has loaded
$( document ).ready(function() {
  console.log('load')

  // inject jquery
  chrome.tabs.executeScript(null, {file:"jquery.js"});

  // inject custom js
  chrome.tabs.executeScript(null, {file:"inject.js"});

});

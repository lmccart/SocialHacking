//------------------DOC READY-------------------//
// When the popup HTML has loaded
window.addEventListener('load', function(evt) {
    console.log('load')
    
    chrome.runtime.getBackgroundPage(function(eventPage) {
        console.log(eventPage)
        // Call the getPageInfo function in the event page, passing in 
        // our onPageDetailsReceived function as the callback. This injects 
        // content.js into the current tab's HTML
        eventPage.getPageDetails(onPageDetailsReceived);
    });
});

// This callback function is called when the content script has been 
// injected and returned its results
function onPageDetailsReceived(pageDetails)  { 
    console.log('hi')
}

function changeText() {
    console.log("changeText");
    $('.editable').each(function(){
        //$(this).html(getRandom(new_lines))
        
        var text = $(this).html();
        text = text.replace(/\./g, "!!!");
        //console.log(text.innerHTML);
        $(this).html(text);
    });
}

//------------------DOC READY-------------------//

var new_lines = [];

$("document").ready(function(){

    setTimeout( function() {
    //change cursor
    $("body").css("cursor", "url('"+chrome.extension.getURL('glitter_cursor.gif')+"'), default");
   
    // load new sentences from text file
    new_lines = loadStrings("data/new_lines.txt");

    changeText();}, 5000);
});


function changeText() {
    console.log('changing')
    $(".editable").each(function() {
        var text = $(this).html();
        text = text.replace("Hi Joanne", "Dear Joanne");
        //console.log(text.innerHTML);
        $(this).html(text);
    });
}


//seperates .txt into arrays based on line returns
function loadStrings(file) {
    var result;
    $.ajax({
        type: "GET",
        url: chrome.extension.getURL(file),
        async: false,
        success: function(data){
            result = data;
        }
    });
    return result.split("\n");
}


//returns random value in array
function getRandom(array){
    var index = Math.floor(Math.random()*array.length);
    var value = array[index];
    return value;
}


//returns true if string contains searched character
function contains(string, searchChar){
    if(string.indexOf(searchChar) != -1) return true;
    else return false;
}
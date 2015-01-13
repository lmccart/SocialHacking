console.log("changeText");

// load the file into an array
var new_lines = loadStrings("data/new_lines.txt");

$('.editable').each(function(){
    
    // grab the text from the element on the page to manipulate
    var text = $(this).html();

    // replace periods with exclamation points
    text = text.replace(/\./g, "!!!");

    // replace word "hi" with a random string from text file
    var random_string = getRandom(new_lines);
    text = text.replace("hi", random_string);
    
    // put the modified text back into the element on the page
    $(this).html(text);
});



//seperates .txt into an array of strings based on line breaks
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


//returns random element from array
function getRandom(array){
  var index = Math.floor(Math.random()*array.length);
  var value = array[index];
  return value;
}
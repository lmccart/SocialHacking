console.log("changeText");
$('.editable').each(function(){
    //$(this).html(getRandom(new_lines))
    
    var text = $(this).html();
    text = text.replace(/\./g, "!!!");
    //console.log(text.innerHTML);
    $(this).html(text);
});
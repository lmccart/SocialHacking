//------------------DOC READY-------------------//


$("document").ready(function(){

    console.log("document ready");

    //setTimeout(changeText, 3000);

    setTimeout( function(){ $("#\\:j5").click(changeText); }, 3000);
});



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

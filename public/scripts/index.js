$(function() {
	$(document).on("mousewheel", function() {
        if($(document).scrollTop() > 0){
            
        } else {
          
        }     
    });
});


window.onscroll = function() {myFunction()};

function myFunction() {
    if (document.body.scrollTop > 5 || document.documentElement.scrollTop > 5) {
        $('#test2').hide('overlay');
    } else {
         $('#test2').show('overlay');
    }
}
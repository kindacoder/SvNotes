$(document).ready(function() {
    $(".button-collapse").sideNav();
    $('select').material_select();
    $('input#input_text, textarea#textarea1').characterCounter();
    $("select[required]").css({
        display: "inline",
        height: 0,
        padding: 0,
        width: 0
    });
});
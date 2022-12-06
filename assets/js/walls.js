$(document).ready(function(){
    $("#main_poster form").submit(function(){
        let form = $(this);
        $.post(form.attr("action"), form.serialize(), (data) => {
            if(data.message_error !== undefined){
                form.siblings(".message_errors").html(data.message_error);
            }
            else{
                window.location.reload();
            }
        }, "json");
        return false;
    });
    $(".comment_poster form").submit(function(){
        let form = $(this);
        $.post(form.attr("action"), form.serialize(), (data) => {
            if(data.comment_error !== undefined){
                form.siblings(".comment_errors").html(data.comment_error);
            }
            else{
                window.location.reload();
            }
        }, "json")
        return false;
    });

});
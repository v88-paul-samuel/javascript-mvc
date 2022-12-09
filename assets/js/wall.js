$(document).ready(function(){
    $("#main_poster").submit(function(){
        $.post($(this).attr("action"), $(this).serialize(), (data) => {
            if(data.errors !==  undefined){
                $("#message_errors").html(data.errors);
            }
            else{
                location.reload();
            }
        }, "json");
        return false;
    });
    $(".inside_comment form").submit(function(){
        $.post($(this).attr("action"), $(this).serialize(), (data) =>{
            if(data.errors !== undefined){
                $(this).siblings(".comment_errors").html(data.errors);
            }
            else{
                location.reload();
            }
        }, "json");
        return false;
    });
});
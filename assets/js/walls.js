$(document).ready(function(){
    $("#post_message").submit(function(){
        let form = $(this);
        $.post(form.attr("action"), form.serialize(), (data) => {
            if(!data.status && data.error !== undefined){
                form.siblings(".message_errors").html(data.error);
            }
            else{
                window.location.reload();
            }
        }, "json");
        
        return false;
    });
    $(".post_comment").submit(function(){
        let form = $(this);
        $.post(form.attr("action"), form.serialize(), (data) => {
            if(!data.status && data.error !== undefined){
                form.siblings(".comment_errors").html(data.error);
            }
            else{
                window.location.reload();
            }
        }, "json")
        
        return false;
    });
    $(".delete_message").submit(function(){
        let form = $(this);
        $.post(form.attr("action"), form.serialize(), (data) => {
            if(!data.status && data.error !== undefined){
                form.siblings(".delete_errors").html(data.error);                
            }
            else{
                window.location.reload();
            }
        });
        
        return false;
    });
    $(".delete_comment").submit(function(){
        let form = $(this);
        $.post(form.attr("action"), form.serialize(), (data) => {
            if(!data.status && data.error !== undefined){
                form.siblings(".delete_errors").html(data.error);                
            }
            else{
                window.location.reload();
            }
        });

        return false;
    });
});
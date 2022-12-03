$(document).ready( () => {
    $("#login_form").on("submit", function(){
        let form = $(this);
        $.post(form.attr("action"), $(form).serialize(), (data) => {     
            if(data.errors !==  undefined){
                 $("#login_errors").html(data.errors);
            }
            else{
                window.location = "/wall";
            }
        }, "json");

        return false;
    });

    $("#registration_form").on("submit", function(){
        let form = $(this);
        $.post(form.attr("action"), $(form).serialize(), (data) => {            
            if(data.errors !== undefined){
                $("#register_errors").html(data.errors);
            }
            else{
                location.reload();
            }
        }, "json");

        return false;
    });
});
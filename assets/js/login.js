$(document).ready( () => {
    $("#login_form").on("submit", function(){
        let form = $(this);
        $.post(form.attr("action"), $(form).serialize(), (data) => {     
            if(data.error_list !==  undefined){
                 $("#login_errors").html(data.error_list);
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
            if(data.error_list !== undefined){
                $("#register_errors").html(data.error_list);
            }
            else{
                location.reload();
            }
        }, "json");

        return false;
    });
});
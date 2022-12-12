class ViewController {
    #req;
    #res;
    
    constructor(req, res){
        this.#req = req;
        this.#res = res;
    }

    homepage = async () => {    
        if(this.#req.session.user !== undefined){
            this.#res.redirect("/wall")
        }
        else{
            this.#res.render("login.ejs");
        }
    }
}

export default ViewController;
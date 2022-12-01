class ViewController {
    #req;
    #res;
    
    constructor(req, res){
        this.#req = req;
        this.#res = res;
    }

    homepage = async () => {
        this.#res.render("login.ejs");
    }
}

module.exports = ViewController;
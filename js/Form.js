class Form {
constructor(){
    this.input = createInput("").attribute("placeholder","digite seu nome");
    this.button = createButton("jogar");
    this.title = createImg("./assets/TITULO.png");
    this.msg = createElement("h2");
};

elementsPosition(){
    this.title.position(120,50);
    this.input.position(width/2-110,height/2-80);
    this.button.position(width/2-90,height/2-20);
    this.msg.position(width/2-300,height/2-100);
};

elementsStyle(){
    this.title.class("gameTitle");
    this.input.class("customInput");
    this.button.class("customButton");
    this.msg.class("greeting");
};

esconder(){
    this.msg.hide();
    this.button.hide();
    this.input.hide();
};

cliquenoMouse(){
    this.button.mousePressed(()=>{
        this.input.hide();
        this.button.hide();
        var mensagem = `
        Olá, ${this.input.value()}
        </br> espere o outro jogador entrar...`;
        this.msg.html(mensagem);

        jcount = jcount+1;
        jogador.name = this.input.value();
        jogador.index = jcount;
        jogador.addPlayer();
        jogador.playerAtt(jcount);
        jogador.readDistance();    })

};

display(){
    this.elementsPosition();
    this.elementsStyle();
    this.cliquenoMouse();
}

}

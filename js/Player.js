class Player {
    constructor(){
    this.nome= null;
    this.index = null;
    this.posx = 0
    this.posy = 0    
    };
    
    addPlayer(){
        var playerIndex = "jogadores/jogador"+ this.index;

        if(this.index === 1){
            this.posx = width /2 -150;

        }
        else{
            this.posx =width /2 +150;
        }
        
        database.ref(playerIndex).set({
            name:this.name,posx:this.posx,posy:this.posy
        })
        
    }

    lerJogadores(){
     var playercountref =   database.ref("playerCount");
     playercountref.on("value",function(data){
         jcount = data.val();
     })
    }

    playerAtt(count){
        database.ref("/").update({
            playerCount:count
        });
    }

    static infoPlayers(){
        var infoplayersref = database.ref("jogadores");
        infoplayersref.on("value",function(data){
            allplayers = data.val();
        })
    }

    update(){
        var playerIndex ="jogadores/jogador" + this.index;
        database.ref(playerIndex).update({
            posx:this.posx,posy:this.posy
        })
    }

    readDistance(){
        var distanceref = database.ref("jogadores/jogador"+this.index);
        distanceref.on("value",function(data){
            var dado = data.val();
            this.posx = dado.posx;
            this.posy =  dado.posy;
        })
    }

    
}

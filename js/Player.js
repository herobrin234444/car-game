class Player {
    constructor(){
    this.name= null;
    this.index = null;
    this.posx = 0;
    this.posy = 0;
    this.rank = 0;
    this.score = 0;
    this.fuel =185;
    this.life = 185;
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
            name:this.name,posx:this.posx,posy:this.posy,
            rank:this.rank,score:this.score
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
            posx:this.posx,
            posy:this.posy,
            rank:this.rank,
            score:this.score,
            life:this.life
        })
    }

    readDistance(){
        var distanceref = database.ref("jogadores/jogador"+this.index);
        distanceref.on("value",data=>{
            var dado = data.val();
            this.posx = dado.posx;
            this.posy =  dado.posy;
        })
    }

    lercarsAtEnd(){
    database.ref("carsAtEnd").on("value",data=>{
        this.rank = data.val();
    });
    }
    
    static updatecarsAtEnd(rank){
        database.ref("/").update({
            carsAtEnd:rank
        })
    }

}

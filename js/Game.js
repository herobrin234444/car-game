class Game {
  constructor(){};
  
  lerEstado(){
    var gamestateref = database.ref("gameState");
    gamestateref.on("value",function(data){
      estadodejogo = data.val();
    })
  }

  update(state){
    database.ref("/").update({
      gameState:state
    })
  }

  hideElements(){
    formulario.esconder();
    formulario.title.position(40,50);
    formulario.title.class("gameTitleafter");
  }

  start(){
    jogador = new Player();
    jcount = jogador.lerJogadores();
    formulario = new Form();
    formulario.display();

    car1 = createSprite(width/2-50,height- 100);
    car1.addImage("carro1",carimg1);
    car1.scale = 0.07;

    car2 = createSprite(width/2+100,height- 100);
    car2.addImage("carro2",carimg2);
    car2.scale = 0.07;

    cars = [car1,car2];


  }

  play(){
    this.hideElements();
    Player.infoPlayers();
    
    if(allplayers !== undefined){
      image(pistaimg,0,-height*5,width,height*6);
      
      var index = 0;
      for(var plr in allplayers){
        index = index +1;
        var x = allplayers[plr].posx;
        var y =  height - allplayers[plr].posy;

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if(index === jogador.index){
          stroke(10);
          fill("red");
          ellipse(x,y,60,60);

          camera.position.x = cars[index - 1].position.x;
          camera.position.y = cars[index - 1].position.y;
        }
      }
      this.playerControl();
      drawSprites();
    }
  }

  playerControl(){
    if(keyIsDown(UP_ARROW)){
      jogador.posy = jogador.posy + 10;
      jogador.update();
    }
  }
}

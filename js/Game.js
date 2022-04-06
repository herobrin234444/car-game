class Game {
  constructor(){
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");
    this.placartitle = createElement("h2");
    this.placar1 = createElement("h2");
    this.placar2 = createElement("h2");
    this.movendo = false;
    this.leftActive =false;
    this.blast = false;
  };
  
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
    formulario.title.class("gameTitleAfterEffect");

    this.resetTitle.html("reiniciar o jogo");
    this.resetTitle.position(width/2 + 200,40);
    this.resetTitle.class("resetText")

    this.resetButton.position(width/2+230,100);
    this.resetButton.class("resetButton");

    this.placartitle.html("placar");
    this.placartitle.position(width/3 - 60,40);
    this.placartitle.class("resetText");

    this.placar1.class("leadersText");
    this.placar1.position(width/3-50,80);

    this.placar2.class("leadersText");
    this.placar2.position(width/3-50,130);

  }

  start(){
    jogador = new Player();
    jcount = jogador.lerJogadores();
    formulario = new Form();
    formulario.display();

    car1 = createSprite(width/2-50,height- 100);
    car1.addImage("carro1",carimg1);
    car1.scale = 0.07;
    car1.addImage("blast",blastimg);

    car2 = createSprite(width/2+100,height- 100);
    car2.addImage("carro2",carimg2);
    car2.scale = 0.07;
    car2.addImage("blast",blastimg);

    cars = [car1,car2];

    fuels = new Group();
    powerCoins = new Group();
    obstacles = new Group();

    var obstaclesPositions = [
       { x: width / 2 + 250, y: height - 800, image: obstacleimg2 },
        { x: width / 2 - 150, y: height - 1300, image: obstacleimg1 },
         { x: width / 2 + 250, y: height - 1800, image: obstacleimg1 },
          { x: width / 2 - 180, y: height - 2300, image: obstacleimg2 },
           { x: width / 2, y: height - 2800, image: obstacleimg2 },
            { x: width / 2 - 180, y: height - 3300, image: obstacleimg1 },
             { x: width / 2 + 180, y: height - 3300, image: obstacleimg2 },
              { x: width / 2 + 250, y: height - 3800, image: obstacleimg2 },
               { x: width / 2 - 150, y: height - 4300, image: obstacleimg1 },
                { x: width / 2 + 250, y: height - 4800, image: obstacleimg2 },
                 { x: width / 2, y: height - 5300, image: obstacleimg1 },
                  { x: width / 2 - 180, y: height - 5500, image: obstacleimg2 } ]

    this.addSprites(fuels,4,fuelimg,0.02);
    this.addSprites(powerCoins,18,coinsimg,0.09);
    this.addSprites(obstacles,obstaclesPositions.length,obstacleimg1,0.04,obstaclesPositions);
    
  }

  addSprites(spriteGroup,numberSprites,spriteImage,scale,positions=[]){
    for(var i=0;i<numberSprites;i=i+1){
      var x,y;

      if(positions.length>0){
        x = positions[i].x;
        y = positions[i].y;
        spriteImage = positions[i].image;
        
      }
      else{
        x = random(width/2+150,width/2-150);
        y = random(-height*4.5,height-400);
      }
      var sprite = createSprite(x,y);
      sprite.addImage("sprite",spriteImage);
      sprite.scale  = scale;
      spriteGroup.add(sprite);
    }
  }

  pegarfuels(index){
    cars[index-1].overlap(fuels,function(collector,collected){
      jogador.fuel = 185;
      collected.remove();
    })

    if(jogador.fuel>0 && this.movendo){
      jogador.fuel = jogador.fuel -0.3;
    }

    if(jogador.fuel<=0){
      estadodejogo = 2;
      this.gameOver();
    }
  }
  pegarCoins(index){
    cars[index-1].overlap(powerCoins,function(collector,collected){
      jogador.score =jogador.score+ 21;
      jogador.update();
      collected.remove();
    })
  }

  play(){
    this.hideElements();
    this.Buttonreset();
    Player.infoPlayers();
    
    jogador.lercarsAtEnd();

    if(allplayers !== undefined){
      image(pistaimg,0,-height*5,width,height*6);

      this.showFuel();
      this.showLife();
      this.showLeaderboard();
      
      var index = 0;
      for(var plr in allplayers){
        index = index +1;
        var x = allplayers[plr].posx;
        var y =  height - allplayers[plr].posy;
      
        var vidaAtual = allplayers[plr].life;
        if(vidaAtual<=0){
          cars[index-1].changeImage("blast");
          cars[index-1].scale=0.3;
        }

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if(index === jogador.index){
          stroke(10);
          fill("red");
          ellipse(x,y,60,60);

          this.pegarfuels(index);
          this.pegarCoins(index);
          this.collisionObstacle(index);
          this.collisionWithCars(index);

          if(jogador.life<=0){
            this.blast = true;
            this.movendo = false;
          }

          camera.position.y = cars[index - 1].position.y;
        }

      }

      if(this.movendo){
        jogador.posy = jogador.posy+5;
        jogador.update();
      }


      this.playerControl();

      const finishLine = height*6-100;
      if(jogador.posy>finishLine){
        estadodejogo = 2;
        jogador.rank = jogador.rank +1;
        Player.updatecarsAtEnd(jogador.rank);
        jogador.update();
        this.showRank();
      }

      drawSprites();
    }
  }

  showLife(){
    push();
    image(lifeImage,width/2-130,height-jogador.posy-200,20,20);
    fill("white");
    rect(width/2-100,height-jogador.posy-200,185,20);
    fill("#f50057");
    rect(width/2-100,height-jogador.posy-200,jogador.life,20);
    noStroke();
    pop();
  }
  
  showFuel(){
    push();
    image(fuelimg,width/2-130,height-jogador.posy-100,20,20);
    fill("white");
    rect(width/2-100,height-jogador.posy-100,185,20);
    fill("#ffc407");
    rect(width/2-100,height-jogador.posy-100,jogador.fuel,20);
    noStroke();
    pop();
  }

  playerControl(){
    if(this.blast === false){

    if(keyIsDown(UP_ARROW)){
      this.movendo = true;
      jogador.posy = jogador.posy + 10;
      jogador.update();
    }
    
    if(keyIsDown(LEFT_ARROW)&&jogador.posx>width/3-50){
      this.leftActive = true;
      jogador.posx = jogador.posx - 5;
      jogador.update()
    }

    if(keyIsDown(RIGHT_ARROW)&&jogador.posx<width/2+300){
      this.leftActive = false;
      jogador.posx = jogador.posx + 5;
      jogador.update()
    }
  }
  }

  showLeaderboard(){
    var pl1,pl2;
    var players = Object.values(allplayers);
    if(
      (players[0].rank ===  0 && players[1].rank === 0 )||players[0].rank ===1
    ){
      pl1 = players[0].rank +"&emsp;"+players[0].name+ "&emsp;"+ players[0].score;
      pl2 = players[1].rank +"&emsp;"+players[1].name+ "&emsp;"+ players[1].score;
    }

    if(players[1].rank === 1){
      pl1 = players[1].rank +"&emsp;"+players[1].name+ "&emsp;"+ players[1].score;
      pl2 = players[0].rank +"&emsp;"+players[0].name+ "&emsp;"+ players[0].score;
    }

    this.placar1.html(pl1);
    this.placar2.html(pl2);

  }
  
  Buttonreset(){
    this.resetButton.mousePressed(()=>{
      database.ref("/").set({
        gameState:0,
        playerCount:0,
        jogadores:{},
        carsAtEnd:0

      });
      window.location.reload();
    })
  }

  showRank(){
    swal({
      title:`incrivel!${"\n"}${jogador.rank}° lugar`,
      text:"você alcançou a linha de chegada",
      imageUrl:"https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize:"100x100",
      confirmButtonText:"ok"
    })
  }


  gameOver(){
    swal({
      title:`fim de jogo`,
      text:"você perdeu a corrida",
      imageUrl:"https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize:"100x100",
      confirmButtonText:"obrigado por jogar"
    })
  }

  collisionObstacle(index){
    if(cars[index-1].collide(obstacles)){
      if(this.leftActive === true){
        jogador.posx = jogador.posx + 100;
      }
      else{
        jogador.posx = jogador.posx -100;
      }

      if(jogador.life>0){
        jogador.life = jogador.life - 185/4;
      }
      jogador.update();
    }
  }

  collisionWithCars(index){
    if(index===1){
      if(cars[index-1].collide(cars[1])){
        if(this.leftActive === true){
          jogador.posx = jogador.posx + 100;
        }
        else{
          jogador.posx = jogador.posx -100;
        }
  
        if(jogador.life>0){
          jogador.life = jogador.life - 185/4;
        }
        jogador.update();
        }
      }
      
      if(index===2){
        if(cars[index-1].collide(cars[0])){
          if(this.leftActive === true){
            jogador.posx = jogador.posx + 100;
          }
          else{
            jogador.posx = jogador.posx -100;
          }
    
          if(jogador.life>0){
            jogador.life = jogador.life - 185/4;
          }
          jogador.update();
          }
        }
    }
 
    end(){
      console.log("fim de jogo");
    }
}

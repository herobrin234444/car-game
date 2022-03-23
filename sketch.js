var bgimg,database;
var formulario,jogador;
var jcount;
var estadodejogo;
var carimg1,carimg2,pistaimg;
var car1,car2,allplayers,cars = [];

function preload() {
  bgimg = loadImage("assets/planodefundo.png");

  carimg1 = loadImage("assets/car1.png");
  carimg2 = loadImage("assets/car2.png");
  pistaimg = loadImage("assets/PISTA.png");


}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  //reset()

game = new Game()
game.lerEstado()
game.start();




}

function draw() {
  background(bgimg);
  if(jcount ===2){
    game.update(1);
  }
  if(estadodejogo ===1){
    game.play()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function reset(){
  database.ref("/").update({
    gameState:0,playerCount:0
  })
}
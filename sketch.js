const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;

var engine, world, ground;
var bgimg;
var ground, tower, towerImg;
var cannon;
var angle = 20;
var balls = [];
var boats = [];
var boatAnimation = [];
var boatDatas;
var imgBoat;
var brokenBoatAnimation = [];
var brokenBoatDatas;
var brokenBoatImg;
var waterSplashAnimation = [];
var waterSplashSpritedata, waterSplashSpritesheet;
var waterSound, pirateLaughSound, backgroundMusic, cannonExplosion;
var isGameOver = false;
var isLaughing= false;
var score = 0;


function preload() {
  bgimg = loadImage("./assets/background.gif");
  towerImg = loadImage("./assets/tower.png");
  imgBoat = loadImage("./assets/boat/boat.png");
  boatDatas = loadJSON("./assets/boat/boat.json");
  brokenBoatImg = loadImage("./assets/boat/broken_boat.png");
  brokenBoatDatas = loadJSON("./assets/boat/broken_boat.json");
  waterSplashSpritedata = loadJSON("assets/water_splash/water_splash.json");
  waterSplashSpritesheet = loadImage("assets/water_splash/water_splash.png");

  backgroundMusic = loadSound("./assets/sounds/background_music.mp3");
  waterSound = loadSound("./assets/sounds/cannon_water.mp3");
  pirateLaughSound = loadSound("./assets/sounds/pirate_laugh.mp3");
  cannonExplosion = loadSound("./assets/sounds/cannon_explosion.mp3");
}

function setup() {

  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  angleMode(DEGREES);
  angle = 15;

  var options = {
    isStatic: true
  }

  //criando o solo
  ground = Bodies.rectangle(0, height - 1, width * 2, 1, options);
  World.add(world, ground);

  //criando a torre
  tower = Bodies.rectangle(160, 350, 160, 310, options);
  World.add(world, tower);

  //criando o canhão
  cannon = new Cannon(180, 110, 130, 100, angle);

  var boatFrames = boatDatas.frames;
  for (let i = 0; i < boatFrames.length; i++) {
    var pos = boatFrames[i].position;
    var img = imgBoat.get(pos.x,pos.y,pos.w,pos.h);
    boatAnimation.push(img);
    
  }
  var brokenBoatFrames = brokenBoatDatas.frames;
  for (let i = 0; i < brokenBoatFrames.length; i++) {
    var pos = brokenBoatFrames[i].position;
    var img = brokenBoatImg.get(pos.x,pos.y,pos.w,pos.h);
    brokenBoatAnimation.push(img);
    
  }
  var waterSplashFrames = waterSplashSpritedata.frames;
  for (var i = 0; i < waterSplashFrames.length; i++) {
    var pos = waterSplashFrames[i].position;
    var img = waterSplashSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    waterSplashAnimation.push(img);
  }


}

function draw() {
  background(189);
  image(bgimg, 0, 0, 1200, 600);

  Engine.update(engine);

  if (!backgroundMusic.isPlaying()) {
    backgroundMusic.play();
    backgroundMusic.setVolume(0.2);
  }
  //exibindo o canhão na tela
  cannon.display();
  //chamando os barcos
  showBoats();

  //percorrendo um arrei das balls
  for (let i = 0; i < balls.length; i++) {
    showBalls(balls[i], i);
    colisionWithBoat(i);
  }
  //exbindo o solo na tela
  rect(ground.position.x, ground.position.y, width * 2, 1);

  push(); //inicia uma nova configuração
  //exibindo a torre na tela
  imageMode(CENTER);
  //rect(tower.position.x,tower.position.y,160,310);
  image(towerImg, tower.position.x, tower.position.y, 160, 310);
  pop(); //finaliza a nova configuração

  textSize(40);
  textAlign(CENTER,CENTER);
  text("pontuação: "+ score,1000,50);

}
function keyReleased() {
  if (keyCode == DOWN_ARROW) {
    cannonExplosion.play()
    balls[balls.length - 1].shoot();
  }
}
function keyPressed() {
  if (keyCode == DOWN_ARROW) {
    //criando a bala de canhão
    var ball = new Canonball(cannon.x, cannon.y);
    balls.push(ball);
  }
}
function showBalls(ball, i) {
  if (ball) {
    //exibindo as bolas do canhão
    ball.display();
    if (ball.body.position.x >= width ) {
        World.remove(world,balls[i].body);
        balls.splice(i,1);
    }
    if (ball.body.position.y >= height -50) {
      waterSound.play()
      balls[i].removeBalls(i);

    }
  }
}
function showBoats() {
  if (boats.length > 0) {
    if (boats[boats.length -1] == undefined || boats[boats.length - 1].body.position.x < width - 300) {
      //definindo posições aleatorias para o barco
      var positions = [-40,-60,-70,-20,-80];
      var position = random(positions);
      //criando barco
      var boat = new Boat(width - 79, height - 60, 170, 170, position,boatAnimation);
      boats.push(boat);
    }
    for (let i = 0; i < boats.length; i++) {
      if (boats[i]) {
        //movimento do barco
        Matter.Body.setVelocity(boats[i].body, {
          x: -0.9,
          y: 0
        });
        //exibindo barco na tela
        boats[i].display();
        boats[i].animate();
        var colision = Matter.SAT.collides(this.tower, boats[i].body);
        if (colision.collided && !boats[i].isBroken) {
          if (!isLaughing && !pirateLaughSound.isPlaying()) {
            pirateLaughSound.play()
            isLaughing = true;
          
          }
          isGameOver = true;
          gameOver()
        }
      }

    }
  } else {
    //criando barco
    var boat = new Boat(width - 79, height - 60, 170, 170, -80,boatAnimation);
    boats.push(boat);

  }
}
function colisionWithBoat(index){
  for (let i = 0; i < boats.length;i++) {
    if (balls[index] !== undefined && boats[i] !== undefined){
      var colision = Matter.SAT.collides(balls[index].body,boats[i].body)
      if (colision.collided) {
        boats[i].removeBoats(i);
        World.remove(world,balls[index].body);
        balls.splice(index,1);
        score += 5;
      }
    }
  
  }
}
function gameOver() {
  swal(
    {
      title: `Fim de Jogo!!!`,
      text: "Obrigada por jogar!!",
      imageUrl:
        "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
      imageSize: "150x150",
      confirmButtonText: "Jogar Novamente"
    },
    function(isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}



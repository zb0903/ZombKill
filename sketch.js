var PLAY = 1;
var END = 0;
var gameState = PLAY;

var zombie,zombieImage, man, manImage, path, pathImage;
var bones, bonesImage, rock, rockImage, fire, fireImage, loseImage, lose;
var invisibleGround;

var over

var rocksGroup, fireGroup, bonesGroup, obstaclesGroup;

var blood;
var score = 0;
var gameOver, restart, over;

var screamSound,creepySound;


function preload(){
  zombieImage = loadImage("zombie.gif")
  manImage = loadImage("man.gif");
  backgroundImage = loadImage("background.jpg");
  groundImage = loadImage("ground.png");
  bonesImage = loadImage("bones.png")
  rockImage = loadImage("rock.png")
  fireImage = loadImage("fire.gif")
  loseImage = loadImage("lose.png")
  screamSound = loadSound("AAAGH1.mp3");
  creepySound = loadSound("creepy.mp3");
 
  bloodImage = loadImage("blood.png")
  gameOverImg = loadImage("gameover.png");
  restartImg = loadImage("restart.png");
  overImage = loadImage("over.png")

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  creepySound.loop();
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.visible = false
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage(groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
  
  
  zombie = createSprite(55,height-105)
  zombie.addImage(zombieImage);
  zombie.setCollider("rectangle",0,0,750,900)
 // zombie.debug = true;
  zombie.scale = 0.13
  
  man = createSprite(width/2,height-100)
  man.addImage(manImage);
  man.setCollider("rectangle",0,0,220,300)
  //man.debug = true;
  man.scale = 0.35
 
  lose = createSprite(width/2,height/2 );
  lose.addImage(loseImage);
  lose.scale = 0.4
  
  over = createSprite(width/2,height/2);
  over.addImage(overImage);
  over.scale = 2

  blood = createSprite(width/2,height/2+60);
  blood.addImage(bloodImage);
  blood.scale = 2

 
  gameOver = createSprite(width/2,height/2 - 50);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.4
  
  restart = createSprite(width/2,height/2 + 80);
  restart.addImage(restartImg);
  restart.scale = 0.4
  
  gameOver.visible = false;
  restart.visible = false;
  blood.visible = false;
  over.visible = false;
  lose.visible = false;

  rocksGroup = new Group();
  fireGroup = new Group();
  bonesGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}


function draw() {
  
  
  background(backgroundImage);
  textSize(20);
  fill("red")
  text("Score: "+ score,30,50);

  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 )|| keyDown("SPACE")&& man.y  >= height-190) {
      man.velocityY = -12;
       touches = [];
    }
    
    man.velocityY = man.velocityY + 0.8
   
  if (ground.x < windowWidth-250){
      ground.x = ground.width/2;
    }
   man.collide(invisibleGround);
   zombie.collide(invisibleGround);
   spawnObstacles();
    
    
  if(obstaclesGroup.isTouching(man)){
     man.velocityY = 0
     lose.visible = true;
     zombie.velocityX = 3;
     ground.velocityX = 0;
     obstaclesGroup.setVelocityXEach(0)
     
    }
  
  if(zombie.isTouching(obstaclesGroup)){
     zombie.velocityY = -12;
    }
    zombie.velocityY = zombie.velocityY + 0.8
    
  if(zombie.isTouching(man)){
     gameState = END;
    screamSound.play();
    }
  }
  
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    blood.visible = true;
    over.visible = true;
    
    zombie.velocityX = 0;
    man.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    over.depth = man.depth+1
    blood.depth= over.depth+1
    gameOver.depth = blood.depth+1;
    restart.depth = gameOver.depth+1
    
    if(touches.length>0 ||mousePressedOver(restart)) {      
      reset();
      touches = []
    }

  }
  
    drawSprites();
 
}




function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-95,20,30);
    obstacle.setCollider('circle',0,0,45)
    // obstacle.debug = true
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(rockImage);
              break;
      case 2: obstacle.addImage(fireImage);
              break;
      
      case 3: obstacle.addImage(bonesImage);
              break;
      default: break;
    }
    
              
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    obstacle.depth = man.depth;
    man.depth +=1;
    
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  blood.visible = false;
  over.visible = false;
  lose.visible = false;
  
  zombie.x = 55

  
  obstaclesGroup.destroyEach();
  
  score = 0;
  
}


//Create variables here
var dog, database, foodstock, foods, fed, addfood, fedTime, foodobj, room = [], readstate, time, gameState = "Hungry", bg,Time1;

function preload()
{
	//load images here
  dog1 = loadImage("images/Dog.png");
  dog2 = loadImage("images/hap.png");
  bg1 = loadImage("images/0.png");
    for (let i = 1; i < 5; i++) {

    room[i] = loadImage("images/r"+i+".png")
  }
}

function setup() {
	createCanvas(800, 500);
  
  database = firebase.database();

   dog = createSprite(710,350,50,50);
   dog.addImage("dog",dog1);
   dog.scale = 0.2; 

  foodstock = database.ref('Food');
  foodstock.on("value",readStock);

  fed = createButton("Feed the Dog");
  fed.position(700,95);
  fed.mousePressed(writeStock);
  fed.mouseReleased(changedog);

  addfood = createButton("Add Food");
  addfood.position(800,95);
  addfood.mousePressed(addStock);

  foodobj = new Food();

  readstate = database.ref('gameState');
  readstate.on("value",(data)=>{

    gameState = data.val();
  })
  fedTime = hour();
  bg = bg1;
}

function draw() {  
  background(bg);

  drawSprites();

  fill(0);
  textSize(15);
  time = hour();

if(fedTime){

  if (fedTime>=12) {
    
    text("Last Feed : "+fedTime%12 + "PM",350,50);
  }else if(fedTime==0){

    text("Last Feed : 12 AM",350,50);
  }else{

    text("Last Feed : "+ fedTime + "AM",350,50);
  }
}
  foodobj.display();

  if (gameState!="Hungry"){

    fed.hide();
    addfood.hide();
    dog.remove();
  }else{

    fed.show();
    addfood.show();
  }
  if (time===fedTime+1) {

    update("Playing");
    foodobj.gar();
  }
  console.log(time);
  if (time===fedTime+2) {
    update("Sleeping");
    foodobj.bed();
  }
  if (time===fedTime+3) {
    update("Bathing");
    foodobj.wash();
  }else{
    update("Hungry");
    foodobj.display();
    bg = bg1;
  }
  console.log(bg)
}
function writeStock() {
  
  if (foods<=0) {
    
    foods=0;
  }else{

    foods=foods-1;
  }

   database.ref('/').update({

     Food: foods,
     FedTime: fedTime
   })
   if (foods>0) {
     
    dog.addImage("happy",dog2)
    dog.changeImage("happy");
   }
}
function changedog() {
  
  dog.changeImage("dog");
}

function readStock(data){

  foods = data.val();
}
function addStock() {

  if (foods<20) {

     foods=foods+1;
  }

   database.ref('/').update({
     Food: foods
   })
}
function update(state){

  database.ref('/').update({

     gameState: gameState
   })
}

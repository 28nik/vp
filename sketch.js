//Create variables here
var dog, happyDog, database,foodS;
var fedTime, lastFed, foodObj;
var changeState, readState;
var bedroom,garden,washroom;
var gameState
function preload()
{
	dogImage = loadImage("images/dogImg.png");
  dogHappy = loadImage("images/dogImg1.png");
  dogBanneri = loadImage("images/virtual pet.png");
  milkimg = loadImage("images/Milk.png")
  bedroom = loadImage("images/Bed Room.png");
  garden = loadImage("images/Garden.png");
  washroom = loadImage("images/Wash Room.png")
}


function setup() {
	cnv = createCanvas(550, 600);
  

  dog = createSprite(width-100,height/2, 30,30);
  dog.addImage(dogImage);
  dog.scale = 0.15;
  dog.visible = false;
  dogBanner = createSprite(width/2,height/2+50, 30,30);
  dogBanner.addImage(dogBanneri);
  dogBanner.scale=0.5
  database = firebase.database();
  foodStock = database.ref('Food');
  foodStock.on("value", readStock);
  // console.log(foodStock)
  feed=createButton("Feed the dog");
  feed.position(500,50);
  feed.mousePressed(feedDog)
  feed.style('background-color', "red");
  feed.style('outline', "none");
  feed.style('border-radius', "10px");
  feed.style('height', "50px");
  feed.style('font-family', "cursive");
  feed.style('font-size', "20px");
  feed.style('font-weight', "bold");
  feed.hide()

  add=createButton("add food");
  add.position(150,50);
  add.mousePressed(addFoods);
  add.style('background-color', "yellow");
  add.style('outline', "none");
  add.style('border-radius', "10px");
  add.style('height', "50px");
  add.style('font-family', "cursive");
  add.style('font-size', "20px");
  add.style('font-weight', "bold");
  add.hide()

  inp = createInput('');
  inp.position(150,height/2-200)
  inp.size(width/2,50);
  inp.attribute('placeholder',"Type your pet's name");
  inp.style('font-size', "25px");
  inp.style('font-family',"ubuntu");
  enter=createButton('Enter');
  enter.position(429,height/2-200.5);
  enter.size(200,55);
  enter.style('font-size', "25px");
  enter.style('font-family',"ubuntu");
  // cnv.mouseOver(show_text)

  enter.mousePressed(function(){
    inp.hide();
    enter.hide();
    feed.show();
    add.show();

    dog.visible=true;
    var name = inp.value();
    dogBanner.visible = false;
    
   // playerCount+=1;
    //player.update(name)
    //player.updateCount(playerCount);
    var greeting = createElement('h3');
    greeting.html("play your " + name )
    greeting.position(width-50, 350)
  });
  foodObj = new Food();
  milkbottle = createSprite(width-150,280)
  milkbottle.addImage(milkimg)
  milkbottle.visible = 0
  milkbottle.scale = 0.1

  readState=database.ref('gameState');
  readState.on("value",(data)=>{
    gameState = data.val();
  });
  
  
}


function draw() {  
background(46,139,87);
foodObj.display()
  drawSprites();
  //add styles here
// if (keyWentDown(UP_ARROW)){
//   writeStock(foodS);
foodObj.getFoodStock();
// }
// console.log(())
fill ("white");
textSize(20);
if (foodS!==undefined){text("Stock: " + foodS,width/2-10,50)}

// if (foodS>19){
// fill("yellow");
// noStroke()
// text("press up arrow to feed your pet", width/2-150,50)}

// if(foodObj.foodStock>0){
//   dog.addImage(dogHappy)
// }


fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  })
  fill("white");
  textSize(15);
  if(lastFed>=12){
    text("Last Fed : "+ lastFed%12 + " PM", 150, 60);
   }else if(lastFed==0){
     text("Last Fed : 12 AM",150, 60);
   }else{
     text("Last Fed : "+ lastFed + " AM", 150, 60);
   }
   if(gameState!="Hungry"){
    feed.hide();
    add.hide();
    dog.remove();
  }
  else{
    feed.show();
    feed.show()
  }

  currentTime = hour();

  if(currentTime==(lastFed+1)){
    update("Playing")
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeping")
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    
    foodObj.washroom();
  }else{
    update("Hungry");
    foodObj.display();
  }

}


function readStock(data) {
  foodS = data.val();

}

function writeStock(x) {
  if (x<=0){
    x=0;
  }
  else{
    x-=1;
  }
  database.ref('/').update({
      Food: x
    })
}

function feedDog(){
  
  if(foodObj.foodStock==0){
  
    
    milkbottle.visible=false;
    dog.addImage(dogImage);
  
    
    
        
        
}
    else{
      dog.addImage(dogHappy);
    milkbottle.visible = true
    foodObj.updateFoodStock(foodObj.foodStock-1);
    database.ref('/').update({
    Food:foodObj.foodStock,
    FeedTime:hour()
    });
  }
  
  

}
function addFoods() {
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
  dog.addImage(dogImage);

}
// function show_text(){
//   text("Click to feed",100,10)
// }

function update(state) {
  database.ref('/').update({
    gameState: state
  });
}

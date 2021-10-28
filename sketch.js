var dog, happyDog, foodS, foodStock,lastFed;
var dogImg, dogHappy;
var milk, milkImg,foodObj;
var database,feed,addFood;

function preload()
{
	//load images here
  dogImg = loadImage("images/dogImg.png");
  dogHappy = loadImage("images/dogImg1.png");
}

function setup() {
  database = firebase.database();
	createCanvas(850, 400);
 
  foodObj = new Food();

  dog = createSprite(650,200,10,10);
  dog.addImage(dogImg);
  dog.scale = 0.15;

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  feed = createButton('Feed The Dog');
  feed.position(740,90);
  feed.mousePressed(feedDog);

  addFood = createButton('Add Food');
  addFood.position(850, 90);
  addFood.mousePressed(addFoods);
  
  
}


function draw() {  
  background(50, 139, 83);
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed: "+lastFed%12 + "PM",240,35);
  }else if(lastFed==0){
    text("Last Feed: 12AM",240,35);
  }else{
    text("Last Feed: "+lastFed+ "AM",240,35)
  }

  
  drawSprites();
  //add styles here


}

function readStock(data)
{
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(dogHappy);
  
  var foodStockVal = foodObj.getFoodStock();
  if(foodStockVal<=0){
    foodObj.updateFoodStock(foodStockVal*0);
  }else{
    foodObj.deductFoodStock();
  }
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}



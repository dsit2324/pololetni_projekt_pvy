const end = 20; // Počet bodů k ukončení hry
let images = [];
let collectImage;
let backgroundImage;
let movingImage;
let collisionSound;
let pokusny;
let music; // Hudba na pozadí
let gameOver = false; // Stav hry

class Rectangle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 30;
    this.speed = 10;
    this.points = 0;
    this.color = color(random(255), random(255), random(255));
  }

  draw() {
    if (movingImage) {
      imageMode(CENTER);
      image(movingImage, this.x, this.y, movingImage.width / 3, movingImage.height / 3);
    } else {
      fill(this.color);
      stroke(0);
      strokeWeight(5);
      rect(this.x, this.y, this.width, this.height);
    }
  }

  move(dx, dy) {
    this.x = constrain(this.x + dx * this.speed, 0, width - this.width);
    this.y = constrain(this.y + dy * this.speed, 0, height - this.height);
  }

  detectCollision(image) {
    return collideRectCircle(this.x, this.y, this.width, this.height, image.x, image.y, image.size);
  }
}

class Obrazek {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.size = 20;
    this.speed = 2;
    this.color = color(random(255), random(255), random(255));
  }

  draw() {
    if (collectImage) {
      imageMode(CENTER);
      image(collectImage, this.x, this.y, this.size * 7.5, this.size * 7.5);
    } else {
      fill(this.color);
      circle(this.x, this.y, this.size);
    }
  }

  update() {
    this.y += this.speed;
  }
}

function preload() {
  movingImage = loadImage('../pictures/walter.png');
  collectImage = loadImage('../pictures/meth.webp');
  collisionSound = loadSound('../sounds/kolize.mp3');
  backgroundImage = loadImage('../pictures/van.webp');
  music = loadSound('../sounds/saul.mp3'); // Hudba na pozadí
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pokusny = new Rectangle(500, 300);
  images.push(new Obrazek());

  // Spuštění hudby na pozadí
  if (music && music.isLoaded()) {
    music.setVolume(0.05);
    music.loop(); // Přehrává hudbu opakovaně
  } else {
    console.error("Hudba se nenačetla správně.");
  }
}

function draw() {
  // Pokud hra skončila
  if (gameOver) {
    // Zastavení hudby, pokud stále hraje
    if (music && music.isPlaying()) {
      music.stop(); // Zastavení hudby
    }

    // Pozadí a zpráva o vítězství
    background(0);
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("You have won!", width / 2, height / 2);
    return; // Konec vykreslování
  }

  // Hlavní část hry
  if (backgroundImage) {
    imageMode(CORNER);
    image(backgroundImage, 0, 0, width, height);
  } else {
    background(20);
  }

  // Aktualizace a vykreslení obrazků
  for (let i = 0; i < images.length; i++) {
    images[i].update();
    images[i].draw();
    if (pokusny.detectCollision(images[i])) {
      pokusny.points++;
      console.log(pokusny.points);

      // Kontrola, zda hráč dosáhl cíle
      if (pokusny.points >= end) {
        gameOver = true; // Nastavení konce hry
      }

      if (collisionSound && collisionSound.isLoaded()) {
        collisionSound.setVolume(2.5);
        collisionSound.play();
      }

      images.splice(i, 1);
      images.push(new Obrazek());
    }
    if (images[i].y > height + 20) {
      images.splice(i, 1);
      images.push(new Obrazek());
    }
  }

  // Pohyb hráče
  if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
    pokusny.move(-1, 0);
  }
  if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
    pokusny.move(1, 0);
  }
  if (keyIsDown(87) || keyIsDown(UP_ARROW)) {
    pokusny.move(0, -1);
  }
  if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) {
    pokusny.move(0, 1);
  }

  // Zobrazení skóre
  fill(255);
  stroke(0);
  strokeWeight(4);
  textSize(32);
  textAlign(LEFT, TOP);
  text("Score: " + pokusny.points, 20, 20);

  // Zobrazení cíle hry
  textAlign(CENTER, TOP);
  text("The goal of the game is to collect " + end + " meths.", width / 2, 20);

  // Vykreslení hráče
  pokusny.draw();
}

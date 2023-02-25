const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const partsData = require('./parts/parts.json');

const backgrounds = partsData.backgrounds;
const feet = partsData.feet;
const bodies = partsData.bodies;
const bills = partsData.bills;
const flippers = partsData.flippers;
const eyes = partsData.eyes;
const accessories = partsData.accessories;

const canvasWidth = 1000;
const canvasHeight = 1000;

// Define the probabilities of each rarity level appearing
const rarityProbabilities = {
  'common': 0.6,
  'rare': 0.25,
  'super-rare': 0.15
};

// Define a function to choose a random part based on its rarity level
function chooseRandomPart(parts, rarity) {
  const filteredParts = parts.filter(part => part.rarity === rarity);
  const randomIndex = Math.floor(Math.random() * filteredParts.length);
  return filteredParts[randomIndex];
}

// Define a function to generate a random penguin
async function generateRandomPenguin() {
  const parts = {
    background: chooseRandomPart(backgrounds, 'common'),
    feet: chooseRandomPart(feet, 'common'),
    body: chooseRandomPart(bodies, 'common'),
    bill: chooseRandomPart(bills, 'common'),
    flipper: chooseRandomPart(flippers, 'common'),
    eyes: chooseRandomPart(eyes, 'common'),
    accessory: null
  };

  // Randomly choose a rarity level for the accessory part
  const rarityRoll = Math.random();
  if (rarityRoll < rarityProbabilities['rare']) {
    parts.accessory = chooseRandomPart(accessories, 'rare');
  } else if (rarityRoll < rarityProbabilities['rare'] + rarityProbabilities['super-rare']) {
    parts.accessory = chooseRandomPart(accessories, 'super-rare');
  } else {
    parts.accessory = chooseRandomPart(accessories, 'common');
  }

  // Load the images for each part and draw them on a canvas
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  const images = [
    loadImage(parts.background.image),
    loadImage(parts.feet.image),
    loadImage(parts.body.image),
    loadImage(parts.bill.image),
    loadImage(parts.flipper.image),
    loadImage(parts.eyes.image),
    loadImage(parts.accessory.image)
  ];

  const [backgroundImage, feetImage, bodyImage, billImage, flipperImage, eyesImage, accessoryImage] = await Promise.all(images);

  ctx.drawImage(backgroundImage, 0, 0);
  ctx.drawImage(feetImage, 0, 0);
  ctx.drawImage(bodyImage, 0, 0);
  ctx.drawImage(billImage, 0, 0);
  ctx.drawImage(flipperImage, 0, 0);
  ctx.drawImage(eyesImage, 0, 0);
  ctx.drawImage(accessoryImage, 0, 0);

  // Save the generated penguin image and metadata to a new directory
  const dirPath = './generated';
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  const penguinCount = fs.readdirSync(dirPath).length;
  const penguinDirPath = path.join(dirPath, `${penguinCount + 1}`);

  if (!fs.existsSync(penguinDirPath)) {
    fs.mkdirSync(penguinDirPath)
  }

  const buffer = canvas.toBuffer('image/png');
  const imagePath = path.join(penguinDirPath, 'penguin.png');
  fs.writeFileSync(imagePath, buffer);

  const metadata = {
    background: parts.background.name,
    feet: parts.feet.name,
    body: parts.body.name,
    bill: parts.bill.name,
    flipper: parts.flipper.name,
    eyes: parts.eyes.name,
    accessory: parts.accessory.name
  };

  const metadataPath = path.join(penguinDirPath, 'metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata));
}

// Define a function to generate a specified number of random penguins
async function generatePenguins(numPenguins) {
  for (let i = 0; i < numPenguins; i++) {
    await generateRandomPenguin();
  }
}

module.exports = generatePenguins;

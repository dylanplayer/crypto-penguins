const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const partsData = require('./parts/parts.json');

// Define a function to generate a random penguin
async function generateRandomPenguin() {
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
  
    if (filteredParts.length === 1) {
      return filteredParts[0];
    }
  
    const randomIndex = Math.floor(Math.random() * filteredParts.length);
    return filteredParts[randomIndex];
  }

  const parts = {
    background: null,
    feet: null,
    body: chooseRandomPart(bodies, 'common'),
    bill: null,
    flipper: null,
    eyes: null,
    accessory: null,
  };

  let rarityRoll = Math.random();
  if (rarityRoll < rarityProbabilities['rare']) {
    parts.accessory = chooseRandomPart(accessories, 'rare');
  } else if (rarityRoll < rarityProbabilities['rare'] + rarityProbabilities['super-rare']) {
    parts.accessory = chooseRandomPart(accessories, 'super-rare');
  } else {
    parts.accessory = chooseRandomPart(accessories, 'common');
  }

  rarityRoll = Math.random();
  if (rarityRoll < rarityProbabilities['rare']) {
    parts.eyes = chooseRandomPart(eyes, 'rare');
  } else if (rarityRoll < rarityProbabilities['rare'] + rarityProbabilities['super-rare']) {
    parts.eyes = chooseRandomPart(eyes, 'super-rare');
  } else {
    parts.eyes = chooseRandomPart(eyes, 'common');
  }

  rarityRoll = Math.random();
  if (rarityRoll < rarityProbabilities['rare']) {
    parts.flipper = chooseRandomPart(flippers, 'rare');
  } else if (rarityRoll < rarityProbabilities['rare'] + rarityProbabilities['super-rare']) {
    parts.flipper = chooseRandomPart(flippers, 'super-rare');
  } else {
    parts.flipper = chooseRandomPart(flippers, 'common');
  }

  rarityRoll = Math.random();
  if (rarityRoll < rarityProbabilities['rare']) {
    parts.bill = chooseRandomPart(bills, 'rare');
  } else if (rarityRoll < rarityProbabilities['rare'] + rarityProbabilities['super-rare']) {
    parts.bill = chooseRandomPart(bills, 'super-rare');
  } else {
    parts.bill = chooseRandomPart(bills, 'common');
  }

  // rarityRoll = Math.random();
  // if (rarityRoll < rarityProbabilities['rare']) {
  //   parts.body = chooseRandomPart(bodies, 'rare');
  // } else if (rarityRoll < rarityProbabilities['rare'] + rarityProbabilities['super-rare']) {
  //   parts.body = chooseRandomPart(bodies, 'super-rare');
  // } else {
  //   parts.body = chooseRandomPart(bodies, 'common');
  // }

  rarityRoll = Math.random();
  if (rarityRoll < rarityProbabilities['rare']) {
    parts.feet = chooseRandomPart(feet, 'rare');
  } else if (rarityRoll < rarityProbabilities['rare'] + rarityProbabilities['super-rare']) {
    parts.feet = chooseRandomPart(feet, 'super-rare');
  } else {
    parts.feet = chooseRandomPart(feet, 'common');
  }

  rarityRoll = Math.random();
  if (rarityRoll < rarityProbabilities['rare']) {
    parts.background = chooseRandomPart(backgrounds, 'rare');
  } else if (rarityRoll < rarityProbabilities['rare'] + rarityProbabilities['super-rare']) {
    parts.background = chooseRandomPart(backgrounds, 'super-rare');
  } else {
    parts.background = chooseRandomPart(backgrounds, 'common');
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
  const tokenId = penguinCount + 1;
  const penguinDirPath = path.join(dirPath, `${tokenId}`);

  if (!fs.existsSync(penguinDirPath)) {
    fs.mkdirSync(penguinDirPath)
  }

  const buffer = canvas.toBuffer('image/png');
  const imagePath = path.join(penguinDirPath, 'penguin.png');
  fs.writeFileSync(imagePath, buffer);

  const metadata = {
    id: tokenId,
    image: `https://crypto-penguins.dylanplayer.xyz/assets/penguins/${tokenId}/penguin.png`,
    image_url: `https://crypto-penguins.dylanplayer.xyz/assets/penguins/${tokenId}/penguin.png`,
    external_url: `https://crypto-penguins.dylanplayer.xyz/penguin/${tokenId}`,
    attributes: [
      {
        trait_type: 'Background',
        value: parts.background.name
      },
      {
        trait_type: 'Feet',
        value: parts.feet.name
      },
      {
        trait_type: 'Body',
        value: parts.body.name
      },
      {
        trait_type: 'Bill',
        value: parts.bill.name
      },
      {
        trait_type: 'Flipper',
        value: parts.flipper.name
      },
      {
        trait_type: 'Eyes',
        value: parts.eyes.name
      },
      {
        trait_type: 'Accessory',
        value: parts.accessory.name
      }
    ],
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

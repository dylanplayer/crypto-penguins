const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

// load parts data from JSON file
const partsData = require('./parts/parts.json');

// create an array for each penguin feature
const backgrounds = partsData.backgrounds;
const feet = partsData.feet;
const bodies = partsData.bodies;
const bellies = partsData.bellies;
const bills = partsData.bills;
const flippers = partsData.flippers;
const eyes = partsData.eyes;
const accessories = partsData.accessories;

// create a function to randomly select an image from an array
function getRandomImage(array) {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

// set canvas size
const canvasWidth = 1000;
const canvasHeight = 1000;

// create canvas
const canvas = createCanvas(canvasWidth, canvasHeight);
const ctx = canvas.getContext('2d');

// load images and draw the penguin onto the canvas
Promise.all([
  loadImage(getRandomImage(backgrounds).image),
  loadImage(getRandomImage(feet).image),
  loadImage(getRandomImage(bodies).image),
  loadImage(getRandomImage(bellies).image),
  loadImage(getRandomImage(bills).image),
  loadImage(getRandomImage(flippers).image),
  loadImage(getRandomImage(eyes).image),
  loadImage(getRandomImage(accessories).image)
]).then(([background, feetImg, bodyImg, bellyImg, billImg, flipperImg, eyesImg]) => {
  const bgPlacement = getRandomImage(backgrounds).placement;
  ctx.drawImage(background, bgPlacement.x, bgPlacement.y);

  const feetPlacement = getRandomImage(feet).placement;
  ctx.drawImage(feetImg, feetPlacement.x, feetPlacement.y);

  const bodyPlacement = getRandomImage(bodies).placement;
  ctx.drawImage(bodyImg, bodyPlacement.x, bodyPlacement.y);

  const bellyPlacement = getRandomImage(bellies).placement;
  ctx.drawImage(bellyImg, bellyPlacement.x, bellyPlacement.y);

  const billPlacement = getRandomImage(bills).placement;
  ctx.drawImage(billImg, billPlacement.x, billPlacement.y);

  const flipperPlacement = getRandomImage(flippers).placement;
  ctx.drawImage(flipperImg, flipperPlacement.x, flipperPlacement.y);

  const eyesPlacement = getRandomImage(eyes).placement;
  ctx.drawImage(eyesImg, eyesPlacement.x, eyesPlacement.y);

  const accessoryPlacement = getRandomImage(accessories).placement;
  ctx.drawImage(accessoryImg, accessoryPlacement.x, accessoryPlacement.y);

  // save canvas to a PNG file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('penguin.png', buffer);
}).catch((err) => {
  console.error(err);
});

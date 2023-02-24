const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const fs = require('fs');
const partsData = require('./parts/parts.json');

const backgrounds = partsData.backgrounds;
const feet = partsData.feet;
const bodies = partsData.bodies;
const bellies = partsData.bellies;
const bills = partsData.bills;
const flippers = partsData.flippers;
const eyes = partsData.eyes;
const accessories = partsData.accessories;

const canvasWidth = 1000;
const canvasHeight = 1000;

async function generatePenguins() {
  // create a folder to store the images and metadata
  const dirPath = './generated';
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  let penguinCount = 0;

  for (const bg of backgrounds) {
    for (const ft of feet) {
      for (const bd of bodies) {
        for (const bl of bellies) {
          for (const bi of bills) {
            for (const fl of flippers) {
              for (const ey of eyes) {
                for (const ac of accessories) {
                  const canvas = createCanvas(canvasWidth, canvasHeight);
                  const ctx = canvas.getContext('2d');

                  const bgPlacement = bg.placement;
                  const feetPlacement = ft.placement;
                  const bodyPlacement = bd.placement;
                  const bellyPlacement = bl.placement;
                  const billPlacement = bi.placement;
                  const flipperPlacement = fl.placement;
                  const eyesPlacement = ey.placement;
                  const accessoryPlacement = ac.placement;

                  const images = [
                    loadImage(bg.image),
                    loadImage(ft.image),
                    loadImage(bd.image),
                    loadImage(bl.image),
                    loadImage(bi.image),
                    loadImage(fl.image),
                    loadImage(ey.image),
                    loadImage(ac.image)
                  ];

                  const [backgroundImage, feetImage, bodyImage, bellyImage, billImage, flipperImage, eyesImage, accessoryImage] = await Promise.all(images);

                  ctx.drawImage(backgroundImage, bgPlacement.x, bgPlacement.y);
                  ctx.drawImage(feetImage, feetPlacement.x, feetPlacement.y);
                  ctx.drawImage(bodyImage, bodyPlacement.x, bodyPlacement.y);
                  ctx.drawImage(bellyImage, bellyPlacement.x, bellyPlacement.y);
                  ctx.drawImage(billImage, billPlacement.x, billPlacement.y);
                  ctx.drawImage(flipperImage, flipperPlacement.x, flipperPlacement.y);
                  ctx.drawImage(eyesImage, eyesPlacement.x, eyesPlacement.y);
                  ctx.drawImage(accessoryImage, accessoryPlacement.x, accessoryPlacement.y);

                  const buffer = canvas.toBuffer('image/png');
                  const penguinDirPath = path.join(dirPath, `${++penguinCount}`);

                  if (!fs.existsSync(penguinDirPath)) {
                    fs.mkdirSync(penguinDirPath);
                  }

                  const imagePath = path.join(penguinDirPath, 'penguin.png');
                  fs.writeFileSync(imagePath, buffer);

                  const metadata = {
                    background: bg.name,
                    feet: ft.name,
                    body: bd.name,
                    belly: bl.name,
                    bill: bi.name,
                    flipper: fl.name,
                    eyes: ey.name,
                    accessory: ac.name
                  };

                  const metadataPath = path.join(penguinDirPath, 'metadata.json');
                  fs.writeFileSync(metadataPath, JSON.stringify(metadata));
                }
              }
            }
          }
        }
      }
    }
  }
}

generatePenguins();

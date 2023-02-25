const generatePartMetadata = require('./generate-parts-metadata');
const generatePenguins = require('./generate-penguins');

generatePartMetadata();
generatePenguins(100).then(() => {
  console.log('Done!');
})

const generatePartMetadata = require('./generate-parts-metadata');
const generatePenguins = require('./generate-penguins');

generatePartMetadata();
generatePenguins(1000).then(() => {
  console.log('Done!');
});

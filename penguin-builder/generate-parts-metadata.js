const fs = require('fs');
const path = require('path');

// Define the base directory to search from
const baseDir = './parts';

const rarities = {
  'common': 'common',
  'rare': 'rare',
  'super-rare': 'super-rare'
}
// Define the types of parts and their corresponding rarity levels
const partTypes = {
  'accessories': rarities,
  'backgrounds': rarities,
  'bodies': rarities,
  'bills': rarities,
  'eyes': rarities,
  'flippers': rarities,
  'feet': rarities
};

function generatePartMetadata() {
  // Define an empty object to store the part data
  let parts = {};
  
  // Define a function to process each directory
  function processDir(dirPath, type) {
    // Get the list of files and subdirectories in the current directory
    const files = fs.readdirSync(dirPath);
    
    // Loop through each file/directory and process accordingly
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const fileStat = fs.statSync(filePath);
      
      if (fileStat.isDirectory()) {
        // If the current item is a directory, call this function recursively to process it
        processDir(filePath, type);
      } else {
        const rarity = path.basename(dirPath);

        const words = file.split("-");
        const capitalizedWords = words.map(word => {
          return word.charAt(0).toUpperCase() + word.slice(1);
        });

        const partName = capitalizedWords.join(" ").replace(".png", "");
        const partImage = filePath;
        const partRarity = partTypes[type][rarity];
        
        // Add the extracted information to the parts object
        if (!parts[type]) {
          parts[type] = [];
        }

        parts[type].push({
          name: partName,
          image: partImage,
          rarity: partRarity
        });
      }
    });
  }

  // Loop through each type of part and call the processDir function for each rarity level
  for (let type in partTypes) {
    for (let rarity in partTypes[type]) {
      const rarityDir = path.join(baseDir, type, rarity);
      if (fs.existsSync(rarityDir)) {
        processDir(rarityDir, type);
      }
    }
  }
  
  // Write the parts object to a JSON file
  fs.writeFileSync('./parts/parts.json', JSON.stringify(parts));
}

module.exports = generatePartMetadata;

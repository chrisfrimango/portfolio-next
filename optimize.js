const fs = require('fs').promises;
const path = require('path');

// Create a simple optimization script since we don't have image processing tools installed
// This will create a shell script that we can run to install Sharp and optimize the images

async function createOptimizationScript() {
  const scriptContent = `#!/bin/bash
  
  # Install Sharp if not already installed
  if ! npm list -g sharp > /dev/null 2>&1; then
    echo "Installing Sharp..."
    npm install -g sharp-cli
  fi
  
  # Directory containing images
  IMG_DIR="./public/images"
  
  # Optimize the tent image with 85% quality
  sharp --input="$IMG_DIR/camping_tent.jpeg" --output="$IMG_DIR/camping_tent_optimized.jpeg" --quality=85
  
  # Optimize the two tent image with 85% quality
  sharp --input="$IMG_DIR/camping_twotent.jpeg" --output="$IMG_DIR/camping_twotent_optimized.jpeg" --quality=85
  
  # Compare file sizes
  echo "Original camping_tent.jpeg size:"
  du -h "$IMG_DIR/camping_tent.jpeg"
  echo "Optimized camping_tent_optimized.jpeg size:"
  du -h "$IMG_DIR/camping_tent_optimized.jpeg"
  
  echo "Original camping_twotent.jpeg size:"
  du -h "$IMG_DIR/camping_twotent.jpeg"
  echo "Optimized camping_twotent_optimized.jpeg size:"
  du -h "$IMG_DIR/camping_twotent_optimized.jpeg"
  
  echo "Optimization complete!"
  `;
  
  // Write the script to a file
  await fs.writeFile(path.join(__dirname, 'optimize_images.sh'), scriptContent);
  await fs.chmod(path.join(__dirname, 'optimize_images.sh'), '755');
  
  console.log('Optimization script created! Run it with:');
  console.log('./optimize_images.sh');
}

createOptimizationScript()
  .catch(err => console.error('Error:', err));

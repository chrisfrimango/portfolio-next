#!/bin/bash
  
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
  
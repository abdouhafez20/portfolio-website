#!/usr/bin/env node

/**
 * Image optimization script
 * Generates WebP and JPEG variants at multiple resolutions for responsive delivery
 * Usage: node scripts/generate-images.js
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');
const imagesDir = path.join(publicDir, 'images');

// Responsive widths targeting: mobile (320, 640), tablet (1024), desktop (1600)
const WIDTHS = [320, 640, 1024, 1600];

// Image manifest for runtime use — maps original to variants
const manifest = {};

async function generateVariants(srcPath, filename) {
  const ext = path.extname(filename);
  const name = path.basename(filename, ext);

  // Skip if already a variant (ends with -320, -640, etc.)
  if (WIDTHS.some(w => name.endsWith(`-${w}`))) {
    return;
  }

  console.log(`Processing: ${filename}`);

  try {
    // Read original image
    const buffer = fs.readFileSync(srcPath);
    const image = sharp(buffer);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      console.warn(`Skipping ${filename}: Unable to determine dimensions`);
      return;
    }

    // Store original dimensions for aspect-ratio calculations
    const variants = [];

    // Generate variants for each width
    for (const width of WIDTHS) {
      if (width >= metadata.width) continue; // Skip upscaling

      const height = Math.round((width / metadata.width) * metadata.height);

      // WebP variant
      const webpName = `${name}-${width}.webp`;
      const webpPath = path.join(imagesDir, webpName);
      await sharp(buffer)
        .resize(width, height, { fit: 'cover', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(webpPath);
      console.log(`  ✓ ${webpName}`);

      // JPEG variant (fallback)
      const jpegName = `${name}-${width}.jpg`;
      const jpegPath = path.join(imagesDir, jpegName);
      await sharp(buffer)
        .resize(width, height, { fit: 'cover', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(jpegPath);
      console.log(`  ✓ ${jpegName}`);

      variants.push({
        width,
        height,
        webp: `/images/${webpName}`,
        jpeg: `/images/${jpegName}`,
      });
    }

    // Store mapping: original → variants
    const originalPath = `/images/${filename}`;
    manifest[originalPath] = {
      original: originalPath,
      width: metadata.width,
      height: metadata.height,
      aspectRatio: (metadata.width / metadata.height).toFixed(3),
      variants,
    };
  } catch (error) {
    console.error(`Error processing ${filename}:`, error.message);
  }
}

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const srcPath = path.join(dir, file);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      // Recursively process subdirectories
      await processDirectory(srcPath);
    } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
      await generateVariants(srcPath, path.relative(imagesDir, srcPath));
    }
  }
}

async function main() {
  try {
    // Check if sharp is installed
    try {
      sharp;
    } catch {
      console.error('Error: sharp is not installed.');
      console.error('Install it with: npm install --save-dev sharp');
      process.exit(1);
    }

    console.log('🖼️  Generating responsive image variants...\n');

    await processDirectory(imagesDir);

    // Write manifest to public/images-manifest.json
    const manifestPath = path.join(publicDir, 'images-manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`\n✅ Manifest written to ${manifestPath}`);

    // Also write to src for easy import
    const srcManifestPath = path.join(__dirname, '..', 'src', 'data', 'images-manifest.json');
    fs.writeFileSync(srcManifestPath, JSON.stringify(manifest, null, 2));
    console.log(`✅ Manifest written to ${srcManifestPath}`);

    console.log(`\n✨ Generated variants for ${Object.keys(manifest).length} images`);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();

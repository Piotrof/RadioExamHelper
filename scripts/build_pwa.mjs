#!/usr/bin/env node

/**
 * Generate service worker using Workbox
 * This creates a PWA-ready service worker for offline support
 */

import { generateSW } from 'workbox-build';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '../dist');

async function buildPWA() {
  console.log('🔧 Generating service worker for PWA...\n');

  try {
    const { count, size, warnings } = await generateSW({
      globDirectory: distDir,
      globPatterns: [
        '**/*.{html,js,css,png,jpg,jpeg,gif,svg,webp,woff,woff2,ttf,eot,ico,json}',
      ],
      swDest: join(distDir, 'sw.js'),
      
      // Ignore patterns
      globIgnores: [
        '**/node_modules/**/*',
        'sw.js',
        'workbox-*.js',
      ],
      
      // Runtime caching strategies
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'google-fonts-stylesheets',
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-webfonts',
            expiration: {
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              maxEntries: 30,
            },
          },
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              maxEntries: 60,
            },
          },
        },
      ],
      
      // Service worker options
      skipWaiting: true,
      clientsClaim: true,
      
      // Source map
      sourcemap: false,
    });

    console.log(`✅ Service worker generated successfully!`);
    console.log(`📦 Precached ${count} files, totaling ${(size / 1024 / 1024).toFixed(2)} MB\n`);

    if (warnings.length > 0) {
      console.warn('⚠️  Warnings:');
      warnings.forEach(warning => console.warn(`  - ${warning}`));
      console.log();
    }

    console.log('🎉 PWA build complete!\n');
  } catch (error) {
    console.error('❌ Error generating service worker:', error);
    process.exit(1);
  }
}

buildPWA();

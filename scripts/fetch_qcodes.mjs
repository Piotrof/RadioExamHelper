#!/usr/bin/env node

/**
 * Script to fetch Q-codes from the Polish amateur radio exam website
 * Run this manually once to populate public/qcodes.json
 * 
 * Usage: npm run fetch-qcodes
 */

import { writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { load } from 'cheerio';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE_URL = 'https://egzaminkf.pl/infusions/test_examination_a/examination.php';
const OUTPUT_PATH = join(__dirname, '../public/qcodes.json');

async function fetchQCodes() {
  console.log('Fetching Q-codes from:', SOURCE_URL);
  console.log('NOTE: This is a one-time manual fetch for educational purposes.');
  console.log('Data will be cached locally and not fetched during app runtime.\n');

  try {
    const response = await fetch(SOURCE_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = load(html);
    
    const qcodes = [];
    
    // This is a placeholder parser - you'll need to inspect the actual page
    // structure and adjust the selectors accordingly
    // The site structure may vary, so this is a best-effort implementation
    
    // Example: If Q-codes are in a table or list
    $('table tr, .qcode-item').each((i, element) => {
      const $el = $(element);
      const text = $el.text().trim();
      
      // Try to extract Q-code pattern (QRA, QRB, etc.)
      const match = text.match(/(Q[A-Z]{2})\s*[-–:]\s*(.+)/);
      
      if (match) {
        qcodes.push({
          code: match[1],
          meaning: match[2].trim()
        });
      }
    });

    // Fallback: Look for any Q-code patterns in the text
    if (qcodes.length === 0) {
      const allText = $('body').text();
      const qcodeMatches = allText.matchAll(/(Q[A-Z]{2})\s*[-–:]\s*([^\n]+)/g);
      
      for (const match of qcodeMatches) {
        qcodes.push({
          code: match[1],
          meaning: match[2].trim()
        });
      }
    }

    // Remove duplicates
    const unique = Array.from(
      new Map(qcodes.map(q => [q.code, q])).values()
    );

    if (unique.length === 0) {
      console.warn('⚠️  Could not parse any Q-codes from the website.');
      console.warn('The page structure may have changed, or parsing logic needs adjustment.');
      console.warn('Using seed data instead.\n');
      return;
    }

    // Sort by code
    unique.sort((a, b) => a.code.localeCompare(b.code));

    // Write to file
    await writeFile(
      OUTPUT_PATH,
      JSON.stringify(unique, null, 2),
      'utf-8'
    );

    console.log(`✅ Successfully fetched ${unique.length} Q-codes`);
    console.log(`📁 Saved to: ${OUTPUT_PATH}\n`);
    console.log('Sample codes:', unique.slice(0, 5).map(q => q.code).join(', '));
    console.log('\nRemember to commit this file to your repository!');
    console.log('Attribution: Data sourced from https://egzaminkf.pl/\n');

  } catch (error) {
    console.error('❌ Error fetching Q-codes:', error.message);
    console.error('\nThe app will fall back to seed data (qcodes.seed.json)');
    console.error('You can manually add Q-codes to public/qcodes.json if needed.\n');
    process.exit(1);
  }
}

fetchQCodes();

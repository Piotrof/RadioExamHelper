#!/usr/bin/env node

/**
 * Build-time data validation script
 * Validates Q-codes data with Zod schemas
 * 
 * This runs during build to ensure data integrity
 */

import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Zod schemas (mirrored from src/lib/data.ts)
const QCodeSchema = z.object({
  code: z.string().regex(/^Q[A-Z]{2,4}$/),
  meaning: z.string().min(1),
});

const QCodesArraySchema = z.array(QCodeSchema);

async function validateQCodes(filePath, name) {
  try {
    console.log(`Validating ${name}...`);
    const content = await readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    const validated = QCodesArraySchema.parse(data);
    
    console.log(`✅ ${name}: ${validated.length} Q-codes validated`);
    return validated;
  } catch (error) {
    console.error(`❌ ${name} validation failed:`, error.message);
    if (error.errors) {
      error.errors.forEach(err => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    }
    throw error;
  }
}

async function buildData() {
  console.log('🔨 Building and validating data...\n');
  
  const seedPath = join(__dirname, '../src/data/qcodes.seed.json');
  const publicPath = join(__dirname, '../public/qcodes.json');
  
  try {
    // Always validate seed data
    await validateQCodes(seedPath, 'Seed Q-codes');
    
    // Try to validate public qcodes if it exists
    try {
      await validateQCodes(publicPath, 'Public Q-codes');
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('ℹ️  No public/qcodes.json found, will use seed data');
        console.log('   Run `npm run fetch-qcodes` to fetch from source\n');
        
        // Copy seed data to public directory as fallback
        const seedContent = await readFile(seedPath, 'utf-8');
        await writeFile(publicPath, seedContent, 'utf-8');
        console.log('📋 Copied seed data to public/qcodes.json\n');
      } else {
        throw error;
      }
    }
    
    console.log('✨ Data validation complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n💥 Data validation failed. Build cannot continue.\n');
    process.exit(1);
  }
}

buildData();

#!/usr/bin/env node

/**
 * Extract Tavus Configuration from config.ts
 * 
 * This script parses src/lib/tavus/config.ts and extracts
 * the objectives and guardrails data as JSON.
 * 
 * Usage:
 *   node scripts/extract-tavus-config.mjs objectives
 *   node scripts/extract-tavus-config.mjs guardrails
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const configPath = join(__dirname, '../src/lib/tavus/config.ts');
const configType = process.argv[2]; // 'objectives' or 'guardrails'

if (!configType || !['objectives', 'guardrails'].includes(configType)) {
  console.error('Usage: node extract-tavus-config.mjs [objectives|guardrails]');
  process.exit(1);
}

try {
  const configContent = readFileSync(configPath, 'utf-8');
  
  if (configType === 'objectives') {
    extractObjectives(configContent);
  } else {
    extractGuardrails(configContent);
  }
} catch (error) {
  console.error('Error reading config file:', error.message);
  process.exit(1);
}

function extractObjectives(content) {
  // Find the LEARNING_CHECK_OBJECTIVES export - match until closing brace and semicolon
  const regex = /export const LEARNING_CHECK_OBJECTIVES\s*=\s*({[\s\S]*?^};)/m;
  const objectivesMatch = content.match(regex);
  
  if (!objectivesMatch) {
    console.error('Could not find LEARNING_CHECK_OBJECTIVES in config.ts');
    process.exit(1);
  }
  
  // Extract the object content (without trailing semicolon)
  let objectivesStr = objectivesMatch[1].replace(/;$/, '');
  
  // Remove comments but preserve the structure
  objectivesStr = objectivesStr
    .replace(/\/\/.*$/gm, '') // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove multi-line comments
  
  // Parse and extract just the data array
  try {
    // Use Function constructor instead of eval for safer parsing
    const objectives = new Function(`return ${objectivesStr}`)();
    
    // Output the data array
    if (objectives.data && Array.isArray(objectives.data)) {
      console.log(JSON.stringify(objectives.data, null, 2));
    } else if (Array.isArray(objectives)) {
      console.log(JSON.stringify(objectives, null, 2));
    } else {
      console.error('Unexpected objectives structure:', objectives);
      process.exit(1);
    }
  } catch (error) {
    console.error('Error parsing objectives:', error.message);
    console.error('Content:', objectivesStr.substring(0, 200));
    process.exit(1);
  }
}

function extractGuardrails(content) {
  // Find the LEARNING_CHECK_GUARDRAILS export - match until closing brace and semicolon
  const regex = /export const LEARNING_CHECK_GUARDRAILS\s*=\s*({[\s\S]*?^};)/m;
  const guardrailsMatch = content.match(regex);
  
  if (!guardrailsMatch) {
    console.error('Could not find LEARNING_CHECK_GUARDRAILS in config.ts');
    process.exit(1);
  }
  
  // Extract the object content (without trailing semicolon)
  let guardrailsStr = guardrailsMatch[1].replace(/;$/, '');
  
  // Remove comments but preserve the structure
  guardrailsStr = guardrailsStr
    .replace(/\/\/.*$/gm, '') // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove multi-line comments
  
  // Parse and extract just the data array
  try {
    // Use Function constructor instead of eval for safer parsing
    const guardrails = new Function(`return ${guardrailsStr}`)();
    
    // Output the data array
    if (guardrails.data && Array.isArray(guardrails.data)) {
      console.log(JSON.stringify(guardrails.data, null, 2));
    } else if (Array.isArray(guardrails)) {
      console.log(JSON.stringify(guardrails, null, 2));
    } else {
      console.error('Unexpected guardrails structure:', guardrails);
      process.exit(1);
    }
  } catch (error) {
    console.error('Error parsing guardrails:', error.message);
    console.error('Content:', guardrailsStr.substring(0, 200));
    process.exit(1);
  }
}

/**
 * Next-Video Storage Hooks Configuration
 * 
 * Custom storage hooks to handle existing processed videos and prevent
 * reprocessing while maintaining next-video functionality for new videos.
 */

import { NextVideo } from 'next-video/process';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

export const { GET, POST, withNextVideo } = NextVideo({
  folder: 'videos',
  provider: 'mux',
  
  /**
   * Load existing asset metadata from JSON files
   * This prevents reprocessing of already-processed videos
   */
  loadAsset: async function (assetPath) {
    try {
      // Convert the asset path to the correct format
      // assetPath comes as "/videos/filename.mp4" but we need "./videos/filename.mp4.json"
      let resolvedPath = assetPath;
      
      // If it's a relative path starting with /videos, convert to local path
      if (assetPath.startsWith('/videos/')) {
        resolvedPath = assetPath.replace('/videos/', './videos/');
        if (!resolvedPath.endsWith('.json')) {
          resolvedPath += '.json';
        }
      } else if (!assetPath.endsWith('.json')) {
        resolvedPath = assetPath + '.json';
      }
      
      console.log(`Looking for asset at: ${resolvedPath}`);
      
      if (existsSync(resolvedPath)) {
        console.log(`Loading existing asset: ${resolvedPath}`);
        const file = await readFile(resolvedPath);
        const asset = JSON.parse(file.toString());
        return asset;
      }
      console.log(`Asset not found, will process: ${resolvedPath}`);
      return null; // Let next-video process new videos
    } catch (error) {
      console.error(`Error loading asset ${assetPath}:`, error);
      return null;
    }
  },
  
  /**
   * Save new asset metadata (only if it doesn't already exist)
   * This prevents overwriting existing processed videos
   */
  saveAsset: async function (assetPath, asset) {
    try {
      // Convert the asset path to the correct format
      let resolvedPath = assetPath;
      if (assetPath.startsWith('/videos/')) {
        resolvedPath = assetPath.replace('/videos/', './videos/');
        if (!resolvedPath.endsWith('.json')) {
          resolvedPath += '.json';
        }
      } else if (!assetPath.endsWith('.json')) {
        resolvedPath = assetPath + '.json';
      }
      
      if (!existsSync(resolvedPath)) {
        console.log(`Saving new asset: ${resolvedPath}`);
        await mkdir(path.dirname(resolvedPath), { recursive: true });
        await writeFile(resolvedPath, JSON.stringify(asset, null, 2), { flag: 'wx' });
      } else {
        console.log(`Asset already exists, skipping save: ${resolvedPath}`);
      }
    } catch (error) {
      if (error.code === 'EEXIST') {
        // File already exists, that's ok
        console.log(`Asset file already exists: ${assetPath}`);
        return;
      }
      console.error(`Error saving asset ${assetPath}:`, error);
      throw error;
    }
  },
  
  /**
   * Update existing asset metadata
   * This safely updates existing files when needed
   */
  updateAsset: async function (assetPath, asset) {
    try {
      // Convert the asset path to the correct format
      let resolvedPath = assetPath;
      if (assetPath.startsWith('/videos/')) {
        resolvedPath = assetPath.replace('/videos/', './videos/');
        if (!resolvedPath.endsWith('.json')) {
          resolvedPath += '.json';
        }
      } else if (!assetPath.endsWith('.json')) {
        resolvedPath = assetPath + '.json';
      }
      
      console.log(`Updating asset: ${resolvedPath}`);
      await writeFile(resolvedPath, JSON.stringify(asset, null, 2));
    } catch (error) {
      console.error(`Error updating asset ${assetPath}:`, error);
      throw error;
    }
  }
});

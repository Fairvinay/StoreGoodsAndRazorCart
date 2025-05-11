import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
const brands = ['vivo', 'oppo', 'motorola', 'samsung'];
const pages = [1]; //[1, 2, 3];

if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data');
}
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Step 3: Move 2 directories up
 const twoLevelsUp = path.resolve(__dirname, '..');  
 const dir = path.join(twoLevelsUp, 'client', 'public/data'); 
 if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}
function runWorker(brand, page) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, 'worker.js'), {
      workerData: { brand, page }
    });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', code => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

(async () => {
  const jobs = [];
  for (const brand of brands) {
    for (const page of pages) {
      jobs.push(runWorker(brand, page));
    }
  }

  const results = await Promise.allSettled(jobs);
  results.forEach(res => {
    if (res.status === 'fulfilled') {
      console.log('✔ Success:', res.value);
    } else {
      console.error('❌ Failed:', res.reason);
    }
  });

  console.log('✅ All fetching completed. Server can now start.');
})();

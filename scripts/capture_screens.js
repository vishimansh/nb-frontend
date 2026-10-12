const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function capture(url, outputFile, width = 430, height = 932) {
  console.log(`Capturing ${url} -> ${outputFile} (${width}x${height})...`);
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    `--window-size=${width},${height}`,
    `--screenshot=${outputFile}`,
    url,
  ];
  execFileSync(chromePath, args);
  console.log(`Saved ${outputFile}, size:`, fs.statSync(outputFile).size);
}

try {
  capture('http://localhost:5174/?flow=b', 'test_capture.png');
} catch (e) {
  console.error('Error:', e.message);
}

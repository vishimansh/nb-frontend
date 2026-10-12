const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artDir = 'C:\\Users\\vishw\\.gemini\\antigravity-ide\\brain\\26716361-bf3e-4f52-bc53-0658583325d6';

function captureScreen(url, filename) {
  const tmpOut = path.join(process.env.TEMP, filename);
  console.log(`Capturing: ${url} -> ${tmpOut}`);
  
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--window-size=430,932',
    '--virtual-time-budget=2000',
    `--screenshot=${tmpOut}`,
    url,
  ];

  execFileSync(chromePath, args);

  if (!fs.existsSync(tmpOut)) {
    throw new Error(`Screenshot failed to create ${tmpOut}`);
  }

  // Copy to public/prototypes
  const pubTarget = path.join('public', 'prototypes', filename);
  fs.copyFileSync(tmpOut, pubTarget);
  console.log(`Copied to ${pubTarget} (${fs.statSync(pubTarget).size} bytes)`);

  // Copy to src/flows/v2/assets/examples
  const exTarget = path.join('src', 'flows', 'v2', 'assets', 'examples', filename);
  fs.copyFileSync(tmpOut, exTarget);
  console.log(`Copied to ${exTarget}`);

  // Copy to Artifact directory
  const artTarget = path.join(artDir, filename);
  fs.copyFileSync(tmpOut, artTarget);
  console.log(`Copied to ${artTarget}`);
}

async function run() {
  try {
    captureScreen('http://localhost:5174/?flow=b&preview=feed_card_ad', 'preview-feed-card-screen.png');
    captureScreen('http://localhost:5174/?flow=b&preview=sponsored_ad', 'preview-sponsored-card-screen.png');
    console.log('Successfully captured both preview screens!');
  } catch (err) {
    console.error('Capture error:', err);
  }
}

run();

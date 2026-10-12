const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artDir = 'C:\\Users\\vishw\\.gemini\\antigravity-ide\\brain\\26716361-bf3e-4f52-bc53-0658583325d6';

// Read Bhopal Haat banner image as base64
const bhopalHaatBuf = fs.readFileSync('src/assets/ads/feed-ad-bhopal-haat.png');
const bhopalHaatBase64 = `data:image/png;base64,${bhopalHaatBuf.toString('base64')}`;

function generateMockupHtml(format) {
  const isFeedCard = format === 'feed_card_ad';

  return `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <title>${isFeedCard ? 'Feed Card Ad Phone Mockup' : 'Sponsored Card Ad Phone Mockup'}</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    body {
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }

    /* iPhone 16 Pro Device Chassis */
    .phone-chassis {
      width: 412px;
      height: 878px;
      background: #1C1C1E;
      border-radius: 56px;
      padding: 5px;
      box-shadow: 0 35px 80px -15px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.1);
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .phone-screen {
      width: 100%;
      height: 100%;
      background: #F7F7F4;
      border-radius: 51px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    /* Hardware Status Bar */
    .status-bar {
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 28px;
      position: relative;
      z-index: 30;
      background: #FFFFFF;
      border-bottom: 0.5px solid rgba(0,0,0,0.05);
    }
    .status-time {
      font-size: 14px;
      font-weight: 700;
      color: #111827;
      letter-spacing: -0.2px;
    }
    .dynamic-island {
      width: 110px;
      height: 28px;
      background: #000000;
      border-radius: 20px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 10px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 10px;
    }
    .camera-lens {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #1F2937;
      border: 1px solid rgba(255,255,255,0.15);
    }
    .status-icons {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .status-icons svg {
      fill: #111827;
    }

    /* Navbharat App Top Bar */
    .app-header {
      background: #2B2437;
      color: #FFFFFF;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 20;
    }
    .brand-logo-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .nb-logo {
      font-size: 19px;
      font-weight: 900;
      letter-spacing: 0.5px;
      color: #FFFFFF;
    }
    .live-badge {
      background: #E39026;
      color: #FFFFFF;
      font-size: 9.5px;
      font-weight: 800;
      padding: 1px 6px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 11px;
      color: rgba(255,255,255,0.85);
      font-weight: 600;
    }

    /* Category Nav Bar */
    .category-tabs {
      background: #FFFFFF;
      border-bottom: 1px solid #E5E7EB;
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 8px 16px;
      font-size: 12px;
      font-weight: 700;
      color: #6B7280;
      overflow: hidden;
      white-space: nowrap;
    }
    .category-tabs .active {
      color: #2B2437;
      border-bottom: 2.5px solid #2B2437;
      padding-bottom: 3px;
    }

    /* News Feed Stream */
    .feed-container {
      flex: 1;
      overflow-y: hidden;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: #F4F4F2;
    }

    /* Standard Editorial Feed Card */
    .editorial-card {
      background: #FFFFFF;
      border-radius: 12px;
      padding: 10px;
      border: 1px solid #E5E7EB;
      display: flex;
      flex-direction: column;
      gap: 6px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    .card-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }
    .card-text-col {
      flex: 1;
      min-width: 0;
    }
    .badge-row {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 4px;
    }
    .cat-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      font-size: 8px;
      font-weight: bold;
    }
    .cat-label {
      font-size: 11px;
      font-weight: 700;
    }
    .card-time {
      font-size: 10px;
      color: #6B7280;
    }
    .card-headline {
      font-size: 13px;
      font-weight: 600;
      line-height: 18px;
      color: #111827;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .card-thumb {
      width: 88px;
      height: 58px;
      border-radius: 8px;
      overflow: hidden;
      background: #E5E7EB;
      flex-shrink: 0;
    }
    .card-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .hairline {
      height: 0.64px;
      background: rgba(24, 37, 59, 0.08);
      width: 100%;
    }
    .card-meta-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 10px;
      color: #6B7280;
    }

    /* THE AD CARD: 1. Feed Banner Ad (3:1) */
    .feed-banner-wrapper {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .feed-banner-card {
      width: 100%;
      aspect-ratio: 3 / 1;
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid #E5E7EB;
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
      background: #FFFFFF;
      position: relative;
    }
    .feed-banner-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .banner-subbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 4px;
      font-size: 10.5px;
      color: #6B7280;
    }
    .banner-tag {
      color: #E39026;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .banner-cta-link {
      color: #2B2437;
      font-weight: 700;
    }

    /* THE AD CARD: 2. Sponsored Article Ad */
    .sponsored-feed-card {
      background: #FFFFFF;
      border-radius: 12px;
      padding: 10px;
      border: 1.5px solid #2B2437;
      display: flex;
      flex-direction: column;
      gap: 6px;
      box-shadow: 0 3px 10px rgba(43,36,55,0.08);
      position: relative;
    }
    .sponsored-badge-row {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 4px;
    }
    .sponsored-badge-circle {
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background: #2B2437;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      font-size: 9px;
    }
    .sponsored-text-badge {
      font-size: 11.5px;
      font-weight: 800;
      color: #2B2437;
    }
    .sponsor-name {
      font-size: 10.5px;
      color: #6B7280;
      font-weight: 600;
    }
    .sponsored-headline {
      font-size: 13.5px;
      font-weight: 700;
      line-height: 19px;
      color: #111827;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .sponsored-thumb {
      width: 90px;
      height: 60px;
      border-radius: 8px;
      overflow: hidden;
      background: #E5E7EB;
      flex-shrink: 0;
      border: 1px solid #E5E7EB;
    }
    .sponsored-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .sponsored-subbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 4px;
      font-size: 10.5px;
      color: #6B7280;
    }
    .sponsored-open-link {
      color: #E39026;
      font-weight: 800;
    }

    /* Bottom App Tab Bar */
    .tab-bar {
      height: 56px;
      background: #FFFFFF;
      border-top: 1px solid #E5E7EB;
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 4px 10px;
      z-index: 20;
    }
    .tab-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      font-size: 10px;
      font-weight: 700;
      color: #8C8C94;
    }
    .tab-item.active {
      color: #2B2437;
    }
    .tab-icon {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }

    /* iOS Home Indicator Bar */
    .home-indicator {
      width: 120px;
      height: 4px;
      background: rgba(0,0,0,0.3);
      border-radius: 2px;
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 40;
    }
  </style>
</head>
<body>

  <!-- The Phone Mockup Frame -->
  <div class="phone-chassis">
    <div class="phone-screen">
      
      <!-- 1. Hardware Status Bar & Dynamic Island -->
      <div class="status-bar">
        <span class="status-time">9:41</span>
        <div class="dynamic-island">
          <div class="camera-lens"></div>
        </div>
        <div class="status-icons">
          <!-- Signal -->
          <svg width="15" height="11" viewBox="0 0 17 12">
            <rect x="0" y="9" width="2.8" height="3" rx="0.5" />
            <rect x="4.5" y="6" width="2.8" height="6" rx="0.5" />
            <rect x="9" y="3" width="2.8" height="9" rx="0.5" />
            <rect x="13.5" y="0" width="2.8" height="12" rx="0.5" />
          </svg>
          <!-- Wifi -->
          <svg width="15" height="11" viewBox="0 0 16 12">
            <path d="M8 3.5C5.2 3.5 2.7 4.7 1 6.6L0 5.4C2 3.2 4.9 1.8 8 1.8C11.1 1.8 14 3.2 16 5.4L15 6.6C13.3 4.7 10.8 3.5 8 3.5ZM8 7C6.4 7 5 7.7 4 8.8L3 7.7C4.3 6.3 6.1 5.4 8 5.4C9.9 5.4 11.7 6.3 13 7.7L12 8.8C11 7.7 9.6 7 8 7ZM8 10.5C7.2 10.5 6.5 11.2 6.5 12H9.5C9.5 11.2 8.8 10.5 8 10.5Z"/>
          </svg>
          <!-- Battery -->
          <div style="width:20px;height:10px;border:1px solid #111827;border-radius:3px;padding:1px;display:flex;align-items:center;">
            <div style="width:100%;height:100%;background:#111827;border-radius:1px;"></div>
          </div>
        </div>
      </div>

      <!-- 2. Navbharat App Header -->
      <div class="app-header">
        <div class="brand-logo-row">
          <span class="nb-logo">नवभारत</span>
          <span class="live-badge">लाइव</span>
        </div>
        <div class="header-actions">
          <span>भोपाल संस्करण</span>
          <span>🔔</span>
        </div>
      </div>

      <!-- 3. Category Tabs -->
      <div class="category-tabs">
        <span class="active">प्रमुख</span>
        <span>राजनीति</span>
        <span>खेल</span>
        <span>शहर</span>
        <span>व्यापार</span>
        <span>मनोरंजन</span>
      </div>

      <!-- 4. Newsfeed Stream with the Previewed AD -->
      <div class="feed-container">
        
        <!-- Story 1: Editorial Politics -->
        <div class="editorial-card">
          <div class="card-top">
            <div class="card-text-col">
              <div class="badge-row">
                <div class="cat-dot" style="background:#B6783A;">🏛</div>
                <span class="cat-label" style="color:#B6783A;">राजनीति</span>
                <span class="card-time">• 15 मिनट पहले</span>
              </div>
              <p class="card-headline">विधानसभा के विशेष सत्र में जनहित के कई महत्वपूर्ण प्रस्ताव सर्वसम्मति से पारित</p>
            </div>
            <div class="card-thumb">
              <img src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=160&q=80" alt="News">
            </div>
          </div>
          <div class="hairline"></div>
          <div class="card-meta-row">
            <span>15 मिनट पहले • 3 मिनट पढ़ें</span>
            <span>🟢 शेयर &nbsp; •••</span>
          </div>
        </div>

        <!-- THE AD ITSELF: Based on format -->
        ${
          isFeedCard
            ? `<!-- 1. Feed Banner Card Ad (3:1) -->
        <div class="feed-banner-wrapper">
          <div class="feed-banner-card">
            <img src="${bhopalHaatBase64}" alt="भोपाल हाट - आर्ट • क्राफ्ट • कल्चर">
          </div>
          <div class="banner-subbar">
            <span class="banner-tag">● पूरा 3:1 कार्ड सीधा लिंक है</span>
            <span class="banner-cta-link">और जानें ↗</span>
          </div>
        </div>`
            : `<!-- 2. Sponsored Article Ad (With HINDI प्रायोजित Tag) -->
        <div class="feed-banner-wrapper">
          <div class="sponsored-feed-card">
            <div class="card-top">
              <div class="card-text-col">
                <div class="sponsored-badge-row">
                  <div class="sponsored-badge-circle">📢</div>
                  <span class="sponsored-text-badge">प्रायोजित</span>
                  <span class="sponsor-name">• फैमिली डाइनिंग</span>
                </div>
                <h3 class="sponsored-headline">भोपाल में खुला नया फैमिली रेस्टोरेंट, स्वाद, माहौल और खास ऑफ़र्स के साथ ज़रूर करें विज़िट</h3>
              </div>
              <div class="sponsored-thumb">
                <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80" alt="Family Restaurant">
              </div>
            </div>
            <div class="hairline"></div>
            <div class="card-meta-row">
              <span>20 मिनट पहले • 3 मिनट पढ़ें</span>
              <span>🟢 शेयर &nbsp; •••</span>
            </div>
          </div>
          <div class="sponsored-subbar">
            <span class="sponsored-open-link">आर्टिकल खोलें ↗</span>
            <span>टैप करने पर पूरी स्टोरी खुलेगी</span>
          </div>
        </div>`
        }

        <!-- Story 2: Editorial Sports -->
        <div class="editorial-card">
          <div class="card-top">
            <div class="card-text-col">
              <div class="badge-row">
                <div class="cat-dot" style="background:#557E63;">🏏</div>
                <span class="cat-label" style="color:#557E63;">खेल</span>
                <span class="card-time">• 25 मिनट पहले</span>
              </div>
              <p class="card-headline">राष्ट्रीय खेलों में प्रदेश के युवा खिलाड़ियों ने जीते कई स्वर्ण और रजत पदक</p>
            </div>
            <div class="card-thumb">
              <img src="https://images.unsplash.com/photo-1621981386829-9b458a2cddde?auto=format&fit=crop&w=160&q=80" alt="Sports">
            </div>
          </div>
          <div class="hairline"></div>
          <div class="card-meta-row">
            <span>25 मिनट पहले • 2 मिनट पढ़ें</span>
            <span>🟢 शेयर &nbsp; •••</span>
          </div>
        </div>

      </div>

      <!-- 5. App Bottom Tab Bar -->
      <div class="tab-bar">
        <div class="tab-item active">
          <div class="tab-icon">🏠</div>
          <span>होम</span>
        </div>
        <div class="tab-item">
          <div class="tab-icon">📰</div>
          <span>ई-पेपर</span>
        </div>
        <div class="tab-item">
          <div class="tab-icon">▶️</div>
          <span>वीडियो</span>
        </div>
        <div class="tab-item">
          <div class="tab-icon">📍</div>
          <span>शहर</span>
        </div>
        <div class="tab-item">
          <div class="tab-icon">👤</div>
          <span>प्रोफ़ाइल</span>
        </div>
      </div>

      <!-- 6. iOS Home Indicator -->
      <div class="home-indicator"></div>

    </div>
  </div>

</body>
</html>`;
}

async function renderMockupTab(chromeWsUrl, htmlContent, outputFilename) {
  const tmpHtml = path.join(process.env.TEMP, `temp_${outputFilename}.html`);
  fs.writeFileSync(tmpHtml, htmlContent, 'utf8');

  const fileUrl = 'file:///' + tmpHtml.replace(/\\/g, '/');
  console.log(`Creating tab for ${outputFilename}...`);

  const newTabRes = await fetch('http://127.0.0.1:9222/json/new?' + encodeURIComponent(fileUrl), { method: 'PUT' });
  const tab = await newTabRes.json();

  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let msgId = 0;
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const id = ++msgId;
      const handler = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });

  await send('Page.enable');
  await send('DOM.enable');

  await send('Emulation.setDeviceMetricsOverride', {
    width: 470,
    height: 930,
    deviceScaleFactor: 2,
    mobile: false,
  });

  // Wait 2.5 seconds for complete render
  await new Promise((r) => setTimeout(r, 2500));

  const res = await send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
  });

  const buffer = Buffer.from(res.data, 'base64');
  console.log(`Captured ${outputFilename}: ${buffer.length} bytes`);

  // Write to public/prototypes
  const pubPath = path.join('public', 'prototypes', outputFilename);
  fs.writeFileSync(pubPath, buffer);
  console.log(`Saved: ${pubPath}`);

  // Write to src/flows/v2/assets/examples
  const exPath = path.join('src', 'flows', 'v2', 'assets', 'examples', outputFilename);
  fs.writeFileSync(exPath, buffer);
  console.log(`Saved: ${exPath}`);

  // Write to artifact directory
  const artPath = path.join(artDir, outputFilename);
  fs.writeFileSync(artPath, buffer);
  console.log(`Saved: ${artPath}`);

  ws.close();
  await fetch(`http://127.0.0.1:9222/json/close/${tab.id}`);
  try { fs.unlinkSync(tmpHtml); } catch (_) {}
}

async function run() {
  console.log('Launching single headless Chrome instance...');
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--hide-scrollbars',
    'about:blank',
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const vRes = await fetch('http://127.0.0.1:9222/json/version');
    const vData = await vRes.json();
    console.log('Chrome ready, version:', vData.Browser);

    // 1. Capture Feed Card Mockup
    const feedHtml = generateMockupHtml('feed_card_ad');
    await renderMockupTab(vData.webSocketDebuggerUrl, feedHtml, 'mockup-feed-card-screen.png');

    // Also save as prototype-feed-banner-mockup.png
    fs.copyFileSync(
      path.join('public', 'prototypes', 'mockup-feed-card-screen.png'),
      path.join('public', 'prototypes', 'prototype-feed-banner-mockup.png')
    );

    // 2. Capture Sponsored Card Mockup
    const sponsoredHtml = generateMockupHtml('sponsored_ad');
    await renderMockupTab(vData.webSocketDebuggerUrl, sponsoredHtml, 'mockup-sponsored-card-screen.png');

    // Also save as prototype-sponsored-article-mockup.png
    fs.copyFileSync(
      path.join('public', 'prototypes', 'mockup-sponsored-card-screen.png'),
      path.join('public', 'prototypes', 'prototype-sponsored-article-mockup.png')
    );

    console.log('\nBoth Phone Screen Mockups generated successfully!');
  } catch (err) {
    console.error('Mockup generation error:', err);
  } finally {
    chrome.kill();
  }
}

run();

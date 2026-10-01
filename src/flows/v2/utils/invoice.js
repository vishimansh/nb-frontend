import { formatIN } from './formatIN';

/**
 * Generates an HTML invoice blob and triggers browser download.
 */
export function downloadInvoice(campaign) {
  if (!campaign) return;

  const { orderId, createdAt, money, snapshot } = campaign;
  const dateStr = new Date(createdAt).toLocaleDateString('hi-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const shopName = snapshot?.shop?.name || 'दुकानदार';
  const shopCity = snapshot?.shop?.city || '';
  const daily = money?.daily || 0;
  const days = money?.days || 0;
  const subtotal = money?.subtotal || 0;
  const gst = money?.gst || 0;
  const total = money?.total || 0;

  const htmlContent = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <title>GST इनवॉइस - ${orderId}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #2B2437; background: #fff; line-height: 1.6; }
    .header { border-bottom: 2px solid #E5E7EB; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-start; }
    .logo { font-size: 26px; font-weight: 800; color: #2B2437; }
    .logo span { color: #E39026; }
    .invoice-title { font-size: 20px; font-weight: 700; color: #4A4358; }
    .meta { font-size: 14px; color: #6B7280; margin-top: 6px; }
    .bill-to { margin-bottom: 30px; }
    .bill-to h3 { font-size: 16px; margin: 0 0 6px 0; color: #4A4358; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { text-align: left; padding: 12px; background: #F8F8F4; border-bottom: 1px solid #E5E7EB; font-size: 14px; }
    td { padding: 12px; border-bottom: 1px solid #E5E7EB; font-size: 15px; }
    .text-right { text-align: right; }
    .total-card { margin-left: auto; width: 320px; background: #FFF9EE; border: 1px solid #FDE68A; border-radius: 12px; padding: 16px; }
    .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 15px; }
    .total-grand { font-size: 18px; font-weight: 800; border-top: 1px solid #FDE68A; padding-top: 8px; margin-top: 6px; color: #2B2437; }
    .footer { margin-top: 50px; font-size: 12px; color: #6B7280; text-align: center; border-top: 1px solid #E5E7EB; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">नवभारत <span>ऐड्स</span></div>
      <div class="meta">हाइपरलोकल विज्ञापन सेवा</div>
    </div>
    <div style="text-align: right;">
      <div class="invoice-title">टैक्स इनवॉइस / रसीद</div>
      <div class="meta">ऑर्डर ID: ${orderId}</div>
      <div class="meta">दिनांक: ${dateStr}</div>
    </div>
  </div>

  <div class="bill-to">
    <h3>बिल प्राप्तकर्ता:</h3>
    <div><strong>${shopName}</strong></div>
    <div>${shopCity ? `शहर: ${shopCity}` : ''}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th>विवरण</th>
        <th class="text-right">दर (प्रति दिन)</th>
        <th class="text-right">अवधि</th>
        <th class="text-right">राशि</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>नवभारत हाइपरलोकल डिजिटल विज्ञापन (प्रारूप: ${snapshot?.draft?.format || 'फ़ीड कार्ड'})</td>
        <td class="text-right">₹${formatIN(daily)}</td>
        <td class="text-right">${days} दिन</td>
        <td class="text-right">₹${formatIN(subtotal)}</td>
      </tr>
    </tbody>
  </table>

  <div class="total-card">
    <div class="total-row">
      <span>विज्ञापन बजट (Subtotal):</span>
      <span>₹${formatIN(subtotal)}</span>
    </div>
    <div class="total-row">
      <span>GST (18%):</span>
      <span>₹${formatIN(gst)}</span>
    </div>
    <div class="total-row total-grand">
      <span>कुल भुगतान (Total):</span>
      <span>₹${formatIN(total)}</span>
    </div>
  </div>

  <div class="footer">
    यह एक कम्प्यूटर जनित डिजिटल इनवॉइस है. किसी हस्ताक्षर की आवश्यकता नहीं है.<br>
    नवभारत मीडिया डिजिटल सॉल्यूशंस · भारत सरकार GST नियमों के अंतर्गत जारी
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Invoice-${orderId}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

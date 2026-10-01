# Navbharat Frontend Prototype: Advertiser Flows (Flow A & Flow B)

This project contains two completely isolated advertiser flows for Navbharat:
1. **Flow A (Default / Existing MVP):** The original advertiser flow and consumer newsfeed app. Accessible by default at `/` or any standard route.
2. **Flow B (Refined Advertiser Flow):** A self-serve, Hindi-first ad builder designed for tier-2/3 Indian shopkeepers. Self-contained under `src/flows/v2/`. Accessible via URL parameter `?flow=b`.

---

## 1. How to Run

### Development Server
```bash
npm install
npm run dev
```

- **Open Flow A (Current MVP):** [http://localhost:5173/](http://localhost:5173/) or [http://localhost:5173/advertise/intro](http://localhost:5173/advertise/intro)
- **Open Flow B (Refined Flow):** [http://localhost:5173/?flow=b](http://localhost:5173/?flow=b)

### Automated Test Suite
Vitest runs the unit tests for reach calculations, Indian currency/number formatting, validators, identity masking, and scans all Flow B Hindi strings for banned ad-tech jargon.
```bash
npm test
```

### Production Build
```bash
npm run build
```

---

## 2. What is Intentionally Different from Flow A

| Area | Flow A | Flow B |
|---|---|---|
| **Screens to payment** | 13 (including Intro and the separate Payment screen) | 9 (Intro, Login, 7 steps) with Payment as an integrated bottom sheet |
| **Progress** | Only on 7 of 13 screens | Unified Progress Pill across all 7 counted steps (`स्टेप 1/7` to `स्टेप 7/7`) |
| **Identity verification** | Typed Aadhaar before seeing any value | GST or PAN verified at payment (first ad only); **zero** Aadhaar collection |
| **Shop profile** | Phone row, dropdown category, manual address | 3-column icon-grid category, pincode auto-resolves city, optional fields skippable |
| **Ad type** | Text list, hard default (grid ad) | Interactive preview cards, easiest default (`feed_card_ad`), effort & placement tags |
| **Ad preview** | First shown at Review, without headline | Pinned live preview collapsible from Step 4 (Your ad) onwards |
| **Headline & description** | Pre-filled unverified offer claim | Starts empty with clear Hindi placeholder examples and quick tap suggestions |
| **Area** | Radius tab or city tab, hardcoded map | Single screen: procedural SVG map seeded by shop pin, removable city chips, all 9 launch regions |
| **Audience** | Separate screen, 5 kinds of complex filters | Collapsed age & gender chips; filters can only reduce or maintain reach |
| **Budget** | Slider, typed date, stepper | Pre-configured packages (Trial, Standard, Boost), native date picker, day chips, sticky total |
| **Reach figures** | Multiple conflicting numbers across screens | Single mathematical engine; reached readers can never exceed total area readers |
| **Payment** | Separate screen, pre-filled fake UPI ID | 1-tap UPI app sheet, empty custom UPI field, 4 real simulation outcome states |
| **After payment** | Fake auto-live in 5 seconds | Honest review timeline (in review → approved / needs changes → live / scheduled) |
| **Dashboard on day zero** | "Live" with entire budget marked spent | Starts at 0 / "डेटा आ रहा है"; spend measured against subtotal (GST excluded) |
| **Help & Support** | None | WhatsApp help chip on every screen header and login |

---

## 3. Configuration Knobs & `PLACEHOLDER_*` Values

All configurable values, operational constants, and prototype placeholders are consolidated in [`src/flows/v2/config.js`](file:///c:/Users/vishw/Downloads/NB%20frontend/src/flows/v2/config.js). 

> **Important Note:** All reach, reader counts, pricing, and view rates in this prototype are **operational placeholders** for testing user flows and mental models, not final market facts.

| Constant / Setting | Current Value | Responsible Owner | What Needs to be Supplied |
|---|---|---|---|
| `PLACEHOLDER_SUPPORT_WHATSAPP` | `'919999999999'` | **Operations / Customer Support** | Real dedicated WhatsApp business number for advertiser support. |
| `PLACEHOLDER_REVIEW_ETA_TEXT` | `null` | **Operations / Ad Review Team** | Turnaround commitment text (e.g. "2 से 4 घंटे में"). Set to `null` to avoid unverified promises. |
| `PLACEHOLDER_UNSPENT_POLICY_TEXT` | `null` | **Product / Finance** | Exact refund/credit policy wording if an advertiser pauses or reduces daily budget mid-campaign. |
| `VIEWS_PER_RUPEE` | `28.5` (~₹35 / 1k views) | **Operations / Ad Ops** | Actual delivery rate per rupee spent based on ad inventory and pricing model. |
| `FREQUENCY_CAP` | `3` | **Operations / Ad Ops** | Maximum frequency cap per unique reader during the campaign duration. |
| `GST_RATE` | `0.18` (18%) | **Finance / Legal** | Applicable GST tax rate. |
| `AD_LABEL_TEXT` | `'विज्ञापन'` | **Brand / Legal** | Mandated regulatory disclosure tag on sponsored creative cards. |
| `adRules.js` copy | Draft policy text | **Legal / Policy** | Approved Hindi ad policy, restricted categories, and prohibited content list. |
| Identity verification method | GSTIN / PAN | **Legal / Compliance** | Final API provider (e.g. Karza / Setu / Cashfree) for GST/PAN lookup. |
| City readers in `cities.js` | Placeholder reader counts | **Circulation / BI** | Verified daily active reader counts across all 9 regions. |
| Pincode lookups in `pincodes.js`| 38 exact + 3-digit prefixes | **Operations** | Complete master pin-code database mapping to delivery hubs. |

---

## 4. Facilitator Panel (Simulation & Researcher Controls)

To assist user testing, testing edge cases, and simulating review/payment states without real money or review backends:

- **How to Open:**
  - **Gesture:** Long-press (800ms) on the header logo **"नवभारत ऐड्स"** inside Flow B.
  - **Keyboard Shortcut:** Press `Ctrl + Shift + F` while focused on Flow B.
- **Features in Facilitator Panel:**
  - **Screen Jumper:** Instantly jump to any of the 12 screens (`S00` to `S11`) with prerequisites auto-filled.
  - **डेमो डेटा भरें (Fill Demo Data):** Instantly populates shop details, category, pin, ad creative, and contact.
  - **Review Mode Simulation:** Toggle between `auto_approve` (8s review → approved → live), `reject_once` (triggers "needs changes" with selectable reason), or `hold` (stays in review).
  - **Payment Outcome Simulation:** Choose `success`, `pending_then_success`, `failed`, or `failed_once`.
  - **Upload Simulation:** Toggle simulated image upload failure.
  - **Sample Data Acceleration:** Toggles live metric growth (10 real seconds = 1 campaign day) on Dashboard & Campaign Analytics.
  - **Event Log Download:** Download the in-memory array of user interaction events as JSON.
  - **Reset Session:** Clears all `nb2_*` localStorage keys without touching Flow A state.

---

## 5. Strict Boundaries & Isolation Guarantees

1. **Flow A Unchanged:** Zero modifications were made to Flow A screens, components, or state providers.
2. **Namespace Scoping:**
   - Flow B components, styles, and CSS variables live strictly under `.nb2-root`.
   - Local storage keys are prefixed with `nb2_` (`nb2_state`, `nb2_account`, `nb2_sim`, `nb2_events`).
   - Tailwind extensions are scoped under `theme.extend.colors.nb2`.
3. **No Aadhaar Collection:** Flow B strictly complies with privacy best practices. No Aadhaar numbers are requested, validated, or stored.
4. **Devanagari First:** All user-facing strings are in `src/flows/v2/strings/hi.js`. Zero English ad-tech jargon (CTR, CPM, Pixel, Impressions, Reach, etc.).

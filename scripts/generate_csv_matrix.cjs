const fs = require('fs');
const path = require('path');

const slidesData = [
  {
    slideNo: 1,
    title: "Cover: Navbharat (NB) App UX Audit & Product Teardown",
    surface: "App-wide Product Evaluation",
    observations: "Comprehensive teardown following the 4 competitive benchmark audits (CNN, Dainik Bhaskar, Dainik Jagran, Times of India). Focuses on architecture, UX patterns, and cognitive psychology.",
    whatWorks: "Objective, unbiased evaluation covering both genuine product moats and real usability flaws.",
    whatFallsShort: "N/A (Title & Executive Summary Slide)",
    strategicTakeaway: "Position Navbharat as a modern regional news platform combining civic UGC journalism, hyperlocal tiering, and SMB self-serve ads."
  },
  {
    slideNo: 2,
    title: "Flow of the Audit & Evaluated Surfaces",
    surface: "Information Architecture Roadmap",
    observations: "12 thematic UX chapters evaluating 32 unique screens across Onboarding, Feed, Article, Video, Nagrik Studio, Hyperlocal, E-Paper, Search, Notifications, Profile, and Ads.",
    whatWorks: "End-to-end full app lifecycle coverage mirroring competitive benchmark methodology.",
    whatFallsShort: "N/A (Agenda Slide)",
    strategicTakeaway: "Systematic auditing of every friction point before scale."
  },
  {
    slideNo: 3,
    title: "Onboarding: Splash & Geographic City Selection",
    surface: "SplashScreen, StateSelectionScreen, CitySelectionScreen",
    observations: "Zero-lag 0.8s animated splash. State/city selection uses iconic regional monument photography (Hawa Mahal, Sanchi Stupa, Gateway). Multi-select city architecture.",
    whatWorks: "Monuments accelerate visual recognition for Hindi readers; multi-city support solves migrant worker/commuter dual-city news needs.",
    whatFallsShort: "State selection before city creates a 2-step geographic barrier; lacks a 1-tap 'GPS Auto-detect' shortcut on step 1; no persistent selected counter badge.",
    strategicTakeaway: "Add 1-tap 'वर्तमान स्थान से चुनें (Auto-detect via GPS)' at top of step 1 to cut onboarding time by 50% for local residents."
  },
  {
    slideNo: 4,
    title: "Notification Permission & Guest/Phone Auth",
    surface: "NotificationsScreen, LoginScreen, OtpScreen",
    observations: "Contextual soft-ask card explaining value before native dialog; prominent 'बाद में' skip option; clean phone auth with simulated OTP autofill.",
    whatWorks: "Strict permission hygiene (zero unsolicited OS dialogs); friction-free guest mode enables instant reading.",
    whatFallsShort: "Onboarding notification is all-or-nothing (lacks CNN-style topic pills); login resets user to feed rather than returning to in-article context.",
    strategicTakeaway: "Expose 2-3 primary notification pills (ब्रेकिंग, मेरा शहर, मुख्य खबरें) directly on the soft-ask card for user agency."
  },
  {
    slideNo: 5,
    title: "Home Feed: TopNavShell & Dynamic Hero",
    surface: "TopNavShell, HomePage, HeroSlot",
    observations: "Compact 54px header with masthead, live city weather (28°C Bhopal), date, search, and drawer. Swipeable category carousel with active indicator.",
    whatWorks: "Integrated masthead + weather delivers high daily utility; seamless swipe/tap category strip adopts best of DB & TOI.",
    whatFallsShort: "TopNavShell + Tier-1 city bar + Tier-2 zone bar stacks to 115px of vertical real estate; lacks auto-collapse on downward scroll.",
    strategicTakeaway: "Implement smart sticky header: collapse weather and zone bars on downward scroll; reveal instantly on upward scroll flick."
  },
  {
    slideNo: 6,
    title: "Home Feed: Content Cards & Density",
    surface: "NewsCard, BreakingTicker, FeedList",
    observations: "Card-based vertical feed with high-contrast Hindi typography, relative timestamps ('10 मिनट पहले'), share/bookmark shortcuts, and inline breaking ticker.",
    whatWorks: "Clean 3-line headline clamp with excellent leading (1.35) prevents scan fatigue; inline WhatsApp share reduces friction.",
    whatFallsShort: "Read/opened articles lack visual dimming (50% opacity/greyed title) seen in TOI, forcing users to re-scan consumed headlines.",
    strategicTakeaway: "Implement persistent read-state tracking (LocalVault) with 40% headline text dimming on previously opened stories."
  },
  {
    slideNo: 7,
    title: "Live Article Experience: Header, Ticker & Summaries",
    surface: "ArticlePage, LiveBlogUpdates, AISummaryCard",
    observations: "Dynamic hero image with photographer credit, live blog pulsing badge, bulleted '30-सेकंड सारांश' (AI Key Takeaways), and text size adjuster (A- / A+).",
    whatWorks: "Key takeaways bullet box drastically boosts reader retention for skim-readers; live blog timestamp stream creates urgency.",
    whatFallsShort: "Sticky bottom action bar obscures the last 2 paragraphs on smaller Android viewports; text resize lacks preview before apply.",
    strategicTakeaway: "Add bottom padding spacer matching action bar height; auto-hide share bar on continuous downward scroll."
  },
  {
    slideNo: 8,
    title: "Interactive Article Widgets: Polls, Audio & Comments",
    surface: "OpinionPollWidget, AudioPlayerBar, SentimentBar",
    observations: "Single-tap interactive opinion poll ('आपकी राय') with live percentage feedback; audio narration bar ('खबर सुनें'); emoji sentiment reactions.",
    whatWorks: "Immediate gamified civic engagement; audio narration caters to commuting and low-literacy users.",
    whatFallsShort: "Audio player lacks 1.25x/1.5x speed controls and 10s scrub buttons; audio bar blocks comments input when both active.",
    strategicTakeaway: "Upgrade audio player to a mini-dock with playback speed selector (1x/1.25x/1.5x) and 10s skip controls."
  },
  {
    slideNo: 9,
    title: "Video & Media Hub: 3-in-1 Capsule & Reels",
    surface: "VideosPage, FullBleedReelItem, PodcastPlayer",
    observations: "Segmented 3-mode pill switch (रील्स, पॉडकास्ट, नागरिक रिपोर्टर); full-bleed 9:16 vertical video reel player with swipe navigation.",
    whatWorks: "Consolidates fragmented video, audio, and UGC into a single high-engagement media hub without tab clutter.",
    whatFallsShort: "2px progress bar scrubber has too small a touch target; double-tap to like lacks immediate haptic/visual heart burst.",
    strategicTakeaway: "Enlarge scrub handle to 6px touch zone on touch; add animated like heart overlay on video double-tap."
  },
  {
    slideNo: 10,
    title: "Reels-to-Article Bridge: 'न्यूज़ पढ़ें' Modal",
    surface: "CitizenReelItem, InLineArticleDrawer",
    observations: "Bottom floating 'विस्तार से पढ़ें' chip opens an in-place bottom sheet summary without terminating background video playback.",
    whatWorks: "Directly bridges the gap between shallow short-form video consumption and in-depth journalistic reporting.",
    whatFallsShort: "Closing the sheet sometimes pauses background reel audio unexpectedly; tap outside sheet dismisses without confirmation.",
    strategicTakeaway: "Decouple sheet scroll listener from video audio playback state; persist seamless background playback."
  },
  {
    slideNo: 11,
    title: "Nagrik Reporter Studio: Video Ingestion & Permissions",
    surface: "CitizenUploadSheet, CameraViewfinder, GalleryPicker",
    observations: "Dedicated UGC studio with 60s hard ceiling, dual camera/gallery upload, direct preview thumbnail, and guidelines checklist.",
    whatWorks: "60s restriction prevents bandwidth abuse and keeps content punchy; pure white camera icon provides high-contrast affordance.",
    whatFallsShort: "Upload sheet previously lacked structured surface framing (resolved by adopting ProfileScreen #F7F7F4 card styling).",
    strategicTakeaway: "Maintain structured card hierarchy (#F7F7F4 + #FFFFFF) with progressive disclosure to keep UGC submission frictionless."
  },
  {
    slideNo: 12,
    title: "Nagrik Reporter Studio: Locality Pinning & Voice Input",
    surface: "LocalitySelector, VoiceDictationMic, CategoryGrid",
    observations: "Hyperlocal sub-zone tagging with city suggestion pills, voice dictation mic for Hindi input, and 8 civic issue categories.",
    whatWorks: "Voice dictation lowers reporting barrier for blue-collar citizens and on-ground witnesses; category tagging routes issues accurately.",
    whatFallsShort: "Voice dictation lacks animated waveform feedback during speech, making users unsure if their speech is being transcribed.",
    strategicTakeaway: "Add pulsating audio wave animation and live interim transcript text inside the input box during voice recording."
  },
  {
    slideNo: 13,
    title: "Hyperlocal City Engine: 2-Tier Navigation",
    surface: "CityFeedContent, CityZoneSelector, WardFilterStrip",
    observations: "Tier-1 primary saved city tabs + Tier-2 urban zone / rural block pill strip (e.g., भोपाल > एमपी नगर / कोलार / बैरागढ़).",
    whatWorks: "Solves the 'hyperlocal dilution' problem of national apps by going deeper into neighborhood/ward-level dispatches.",
    whatFallsShort: "Switching Tier-2 zone pill does not smoothly reset scroll position to top; empty zones show blank space rather than nearby news.",
    strategicTakeaway: "Add automatic scroll-to-top on zone switch, and fallback to city-wide curated news with an 'आस-पास की खबरें' banner when zone has few stories."
  },
  {
    slideNo: 14,
    title: "Hyperlocal Community Dispatches Carousel",
    surface: "CitizenDispatchStrip, StoryCards, ReportActionCard",
    observations: "Horizontal card strip in City feed with 'रिपोर्ट भेजें' action card, amber locality tags, and verified citizen story reels.",
    whatWorks: "Brings community issues directly into the main city news feed; gives ordinary citizens equal prominence alongside staff journalists.",
    whatFallsShort: "Pre-refactor carousel lacked unified card container (resolved with #FFFFFF rounded-[22px] frame, VideoPlay badge, and orange pill).",
    strategicTakeaway: "Keep citizen carousel contained in the single surface frame with clear visual differentiation from editorial video reels."
  },
  {
    slideNo: 15,
    title: "E-Paper Experience: Archive Calendar & Edition Switch",
    surface: "EpaperScreen, CalendarPickerModal, EditionDropdown",
    observations: "Digital replica reader with 30-day historical archive calendar, multi-edition switcher (Bhopal, Raipur, Indore), and full-page canvas viewer.",
    whatWorks: "Preserves the tactile newspaper layout favored by traditional print loyalists; fast edition switching.",
    whatFallsShort: "Pure canvas/scan viewer lacks a tap-to-read reflowed digital article modal; pinch-to-zoom is jerky on lower-end Android hardware.",
    strategicTakeaway: "Implement tap-on-article bounding box detection that opens a clean digital reader sheet (like Dainik Bhaskar e-paper)."
  },
  {
    slideNo: 16,
    title: "E-Paper Monetization & Freemium Gate",
    surface: "PaywallModal, SubscriptionPlans, ClippingTool",
    observations: "Freemium access model: Page 1-2 free to preview, Page 3+ behind a subscription paywall with clipping tool for social sharing.",
    whatWorks: "Clipping tool drives viral social sharing while keeping watermark branding intact; transparent monthly/annual plan options.",
    whatFallsShort: "Paywall modal triggers abruptly when swiping past Page 2 without showing a partial teaser; annual plan lacks 'सर्वश्रेष्ठ मूल्य' badge.",
    strategicTakeaway: "Add blurred preview of Page 3 with floating unlock card rather than hard modal interruption; highlight annual savings badge (40% बचत)."
  },
  {
    slideNo: 17,
    title: "Universal Search: Voice-First & Chronological Sorting",
    surface: "SearchScreen, VoiceSearchModal, TrendingKeywords",
    observations: "Voice search input button, trending search tag pills, dual sorting tabs (सबसे नया vs सबसे प्रासंगिक), and search history chips.",
    whatWorks: "Voice-first search removes Hindi typing keyboard friction; dual sort gives power users control over temporal vs relevancy discovery.",
    whatFallsShort: "Recent searches lack individual deletion cross (only 'सब हटाएं'); no category filter chips (वीडियो, लेख, शहर) on results page.",
    strategicTakeaway: "Add individual 'x' dismiss button to recent search pills and horizontal filter chips (सभी, केवल वीडियो, ई-पेपर) below search bar."
  },
  {
    slideNo: 18,
    title: "Notifications Center: Batched Feed & Time Grouping",
    surface: "NotificationsFeedPage, SingleSurfaceCard, CategoryFilters",
    observations: "Time-bucketed notifications (आज, कल, इस हफ्ते) within a single-surface card frame; category filter pills (सभी, ब्रेकिंग, मेरा शहर).",
    whatWorks: "Single surface styling with subtle border lines avoids the disjointed floating bubble syndrome seen in Dainik Jagran.",
    whatFallsShort: "Mark all as read ('सब पढ़ा हुआ मार्क करें') is hidden inside a kebab menu rather than directly visible on top header.",
    strategicTakeaway: "Expose 'सब पढ़ा हुआ मार्क करें' as a 1-tap text button in the top right header when unread badge count > 0."
  },
  {
    slideNo: 19,
    title: "Side Menu & Profile: Skyline Header & Offline Vault",
    surface: "MenuScreen, ProfileScreen, SavedArticlesVault",
    observations: "Iconic regional skyline illustration header (Bhopal VIP Road / Amber Fort), offline reading vault with storage meter, font and theme toggles.",
    whatWorks: "Skyline creates high aesthetic delight and local pride; offline vault provides true offline reading without network connection.",
    whatFallsShort: "Offline cache clear button lacks clear warning prompt about downloaded articles being purged; storage meter numbers update slowly.",
    strategicTakeaway: "Add two-step confirmation on cache purge and optimistic cache recalculation on article delete."
  },
  {
    slideNo: 20,
    title: "SMB Advertiser Flow: Radius Targeting & Self-Serve Checkout",
    surface: "AdBookingFlowV2, RadiusSelector, AdCreativeWizard, Checkout",
    observations: "In-app self-serve ad booking portal for local shops, hyperlocal radius slider (1km to 15km), instant reach estimator, UPI payment.",
    whatWorks: "Groundbreaking monetization moat: democratizes digital advertising for Tier-2/3 local merchants directly inside their regional news app.",
    whatFallsShort: "Creative preview mockup doesn't let merchants upload a custom banner aspect ratio; GST invoice download missing in post-payment screen.",
    strategicTakeaway: "Add auto-crop tool for custom shop banners (1:1 and 16:9) and instant 1-tap GST tax invoice download button on the success screen."
  },
  {
    slideNo: 21,
    title: "Comparative Scorecard: Navbharat vs DB, Jagran, TOI, CNN",
    surface: "Strategic Competitive Positioning",
    observations: "Comparative benchmarking across 6 core pillars: Hyperlocal Depth, UGC/Civic Journalism, Ad-to-Content Ratio, Multimedia, Modern Visual Design, and SMB Monetization.",
    whatWorks: "NB scores highest in UGC Ingestion (9.5/10), SMB Monetization (9.0/10), and Hyperlocal Depth (9.2/10).",
    whatFallsShort: "INCUMBENTS (DB, TOI) lead in raw editorial throughput, recommendation engine personalization, and reflowed e-paper text extraction.",
    strategicTakeaway: "Leverage UGC and SMB self-serve ad revenue as the twin growth engines while refining e-paper reader and header scroll dynamics."
  },
  {
    slideNo: 22,
    title: "Strategic UX Debt Backlog & Implementation Priority",
    surface: "Product & Engineering Roadmap",
    observations: "Prioritized matrix of 8 UX debt fixes categorized by impact vs effort (P0: Header collapse, Read-state dimming; P1: Audio dock controls, E-paper text mode).",
    whatWorks: "Clear execution roadmap directly addressing user cognitive overhead and scan efficiency.",
    whatFallsShort: "Requires disciplined frontend execution to maintain 60fps performance across low-memory Android devices.",
    strategicTakeaway: "Ship P0 items immediately to elevate Navbharat's daily active user retention to industry-leading standards."
  }
];

function escapeCsv(val) {
  if (val == null) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

// Generate CSV with UTF-8 BOM so Google Sheets and Excel open without encoding issues
const headers = [
  "Slide #",
  "Slide Title / Chapter",
  "Surface / Screens Evaluated",
  "Key Observations & Visual Layout",
  "What Works (Honest Praise)",
  "What Needs Refinement (UX Gaps & Debt)",
  "Strategic Takeaway / Moat vs Incumbents"
];

const csvRows = [headers.map(escapeCsv).join(",")];

for (const row of slidesData) {
  csvRows.push([
    escapeCsv(row.slideNo),
    escapeCsv(row.title),
    escapeCsv(row.surface),
    escapeCsv(row.observations),
    escapeCsv(row.whatWorks),
    escapeCsv(row.whatFallsShort),
    escapeCsv(row.strategicTakeaway)
  ].join(","));
}

const csvContent = '\uFEFF' + csvRows.join("\r\n");
const outputPath = path.resolve('c:/Users/vishw/Downloads/NB frontend/nb_app_ux_audit_matrix.csv');
fs.writeFileSync(outputPath, csvContent, 'utf8');

console.log('Successfully generated CSV matrix at:', outputPath);


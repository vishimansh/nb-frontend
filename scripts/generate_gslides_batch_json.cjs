const fs = require('fs');
const path = require('path');

const slidesData = [
  {
    slideNo: 1,
    title: "Navbharat (NB) App UX Audit & Product Teardown",
    subtitle: "Critical Evaluation of Architecture, UX Patterns, Feature Ecosystem & User Psychology",
    category: "COVER",
    surface: "App-wide Product Evaluation",
    observations: "Comprehensive teardown following the 4 competitive benchmark audits (CNN, Dainik Bhaskar, Dainik Jagran, Times of India). Focuses on architecture, UX patterns, and cognitive psychology.",
    whatWorks: "Objective, unbiased evaluation covering both genuine product moats and real usability flaws.",
    whatFallsShort: "N/A (Title & Executive Summary Slide)",
    strategicTakeaway: "Position Navbharat as a modern regional news platform combining civic UGC journalism, hyperlocal tiering, and SMB self-serve ads."
  },
  {
    slideNo: 2,
    title: "Flow of the Audit & Evaluated Surfaces",
    subtitle: "12 Thematic UX Chapters Across 32 Unique Product Screens",
    category: "AGENDA",
    surface: "Information Architecture Roadmap",
    observations: "12 thematic UX chapters evaluating 32 unique screens across Onboarding, Feed, Article, Video, Nagrik Studio, Hyperlocal, E-Paper, Search, Notifications, Profile, and Ads.",
    whatWorks: "End-to-end full app lifecycle coverage mirroring competitive benchmark methodology.",
    whatFallsShort: "N/A (Agenda Slide)",
    strategicTakeaway: "Systematic auditing of every friction point before scale."
  },
  {
    slideNo: 3,
    title: "Onboarding: Splash & Geographic City Selection",
    subtitle: "SplashScreen, StateSelectionScreen, CitySelectionScreen",
    category: "CONTENT",
    surface: "SplashScreen, StateSelectionScreen, CitySelectionScreen",
    observations: "• Zero-lag 0.8s animated splash.\n• Iconic monument photography (Hawa Mahal, Sanchi Stupa, Gateway).\n• Multi-select city architecture from day one.",
    whatWorks: "• Monuments accelerate visual recognition for Hindi readers.\n• Multi-city support solves migrant worker dual-city news needs.",
    whatFallsShort: "• State selection before city creates a 2-step geographic barrier.\n• Lacks 1-tap 'GPS Auto-detect' shortcut on step 1.",
    strategicTakeaway: "Add 1-tap 'वर्तमान स्थान से चुनें (Auto-detect via GPS)' at top of step 1 to cut onboarding time by 50% for local residents."
  },
  {
    slideNo: 4,
    title: "Notification Permission & Guest/Phone Auth",
    subtitle: "NotificationsScreen, LoginScreen, OtpScreen",
    category: "CONTENT",
    surface: "NotificationsScreen, LoginScreen, OtpScreen",
    observations: "• Contextual in-app soft-ask card explaining alert utility.\n• Prominent 'बाद में' (Skip) option.\n• Clean phone auth with simulated OTP autofill.",
    whatWorks: "• Strict permission hygiene (zero unsolicited OS dialogs).\n• Friction-free guest mode enables instant reading.",
    whatFallsShort: "• Onboarding notification is all-or-nothing (lacks CNN-style topic pills).\n• Login resets user to feed rather than returning to in-article context.",
    strategicTakeaway: "Expose 2-3 primary notification pills (ब्रेकिंग, मेरा शहर, मुख्य खबरें) directly on the soft-ask card for user agency."
  },
  {
    slideNo: 5,
    title: "Home Feed: TopNavShell & Dynamic Hero",
    subtitle: "TopNavShell, HomePage, HeroSlot",
    category: "CONTENT",
    surface: "TopNavShell, HomePage, HeroSlot",
    observations: "• Compact 54px header with masthead, live city weather (28°C Bhopal), date, and search.\n• Swipeable category carousel with active indicator.",
    whatWorks: "• Integrated masthead + weather delivers high daily utility.\n• Seamless swipe/tap category strip adopts best of DB & TOI.",
    whatFallsShort: "• TopNavShell + Tier-1 city bar + Tier-2 zone bar stacks to 115px vertical space.\n• Lacks auto-collapse on downward scroll.",
    strategicTakeaway: "Implement smart sticky header: collapse weather and zone bars on downward scroll; reveal instantly on upward scroll flick."
  },
  {
    slideNo: 6,
    title: "Home Feed: Content Cards & Density",
    subtitle: "NewsCard, BreakingTicker, FeedList",
    category: "CONTENT",
    surface: "NewsCard, BreakingTicker, FeedList",
    observations: "• Card-based vertical feed with high-contrast Hindi typography.\n• Relative timestamps ('10 मिनट पहले') and inline WhatsApp share.\n• Breaking news ticker strip.",
    whatWorks: "• Clean 3-line headline clamp with excellent leading (1.35) prevents scan fatigue.\n• Inline WhatsApp share reduces friction.",
    whatFallsShort: "• Read/opened articles lack visual dimming (50% opacity/greyed title) seen in TOI, forcing users to re-scan consumed headlines.",
    strategicTakeaway: "Implement persistent read-state tracking (LocalVault) with 40% headline text dimming on previously opened stories."
  },
  {
    slideNo: 7,
    title: "Live Article Experience: Header, Ticker & Summaries",
    subtitle: "ArticlePage, LiveBlogUpdates, AISummaryCard",
    category: "CONTENT",
    surface: "ArticlePage, LiveBlogUpdates, AISummaryCard",
    observations: "• Dynamic hero image with photographer credit.\n• Live blog pulsing badge with timestamp updates.\n• Bulleted '30-सेकंड सारांश' (AI Key Takeaways) box.",
    whatWorks: "• Key takeaways bullet box drastically boosts reader retention for skim-readers.\n• Live blog timestamp stream creates urgency.",
    whatFallsShort: "• Sticky bottom action bar obscures the last 2 paragraphs on smaller viewports.\n• Text resize lacks preview before apply.",
    strategicTakeaway: "Add bottom padding spacer matching action bar height; auto-hide share bar on continuous downward scroll."
  },
  {
    slideNo: 8,
    title: "Interactive Article Widgets: Polls, Audio & Comments",
    subtitle: "OpinionPollWidget, AudioPlayerBar, SentimentBar",
    category: "CONTENT",
    surface: "OpinionPollWidget, AudioPlayerBar, SentimentBar",
    observations: "• Single-tap interactive opinion poll ('आपकी राय') with live percentage.\n• Audio narration bar ('खबर सुनें').\n• Emoji sentiment reactions.",
    whatWorks: "• Immediate gamified civic engagement.\n• Audio narration caters to commuting and low-literacy users.",
    whatFallsShort: "• Audio player lacks 1.25x/1.5x speed controls and 10s scrub buttons.\n• Audio bar blocks comments input when both active.",
    strategicTakeaway: "Upgrade audio player to a mini-dock with playback speed selector (1x/1.25x/1.5x) and 10s skip controls."
  },
  {
    slideNo: 9,
    title: "Video & Media Hub: 3-in-1 Capsule & Reels",
    subtitle: "VideosPage, FullBleedReelItem, PodcastPlayer",
    category: "CONTENT",
    surface: "VideosPage, FullBleedReelItem, PodcastPlayer",
    observations: "• Segmented 3-mode pill switch (रील्स, पॉडकास्ट, नागरिक रिपोर्टर).\n• Full-bleed 9:16 vertical video reel player with swipe navigation.",
    whatWorks: "• Consolidates fragmented video, audio, and UGC into a single high-engagement media hub without tab clutter.",
    whatFallsShort: "• 2px progress bar scrubber has too small a touch target.\n• Double-tap to like lacks immediate haptic/visual heart burst.",
    strategicTakeaway: "Enlarge scrub handle to 6px touch zone on touch; add animated like heart overlay on video double-tap."
  },
  {
    slideNo: 10,
    title: "Reels-to-Article Bridge: 'न्यूज़ पढ़ें' Modal",
    subtitle: "CitizenReelItem, InLineArticleDrawer",
    category: "CONTENT",
    surface: "CitizenReelItem, InLineArticleDrawer",
    observations: "• Bottom floating 'विस्तार से पढ़ें' chip opens an in-place bottom sheet summary without terminating background video playback.",
    whatWorks: "• Directly bridges the gap between shallow short-form video consumption and in-depth journalistic reporting.",
    whatFallsShort: "• Closing the sheet sometimes pauses background reel audio unexpectedly.\n• Tap outside sheet dismisses without confirmation.",
    strategicTakeaway: "Decouple sheet scroll listener from video audio playback state; persist seamless background playback."
  },
  {
    slideNo: 11,
    title: "Nagrik Reporter Studio: Video Ingestion & Permissions",
    subtitle: "CitizenUploadSheet, CameraViewfinder, GalleryPicker",
    category: "CONTENT",
    surface: "CitizenUploadSheet, CameraViewfinder, GalleryPicker",
    observations: "• Dedicated UGC studio with 60s hard ceiling.\n• Dual camera/gallery upload with direct preview thumbnail.\n• High-trust guidelines checklist.",
    whatWorks: "• 60s restriction prevents bandwidth abuse and keeps content punchy.\n• Pure white camera icon provides high-contrast affordance.",
    whatFallsShort: "• Upload sheet previously lacked structured surface framing (now resolved with #F7F7F4 card styling).",
    strategicTakeaway: "Maintain structured card hierarchy (#F7F7F4 + #FFFFFF) with progressive disclosure to keep UGC submission frictionless."
  },
  {
    slideNo: 12,
    title: "Nagrik Reporter Studio: Locality Pinning & Voice Input",
    subtitle: "LocalitySelector, VoiceDictationMic, CategoryGrid",
    category: "CONTENT",
    surface: "LocalitySelector, VoiceDictationMic, CategoryGrid",
    observations: "• Hyperlocal sub-zone tagging with city suggestion pills.\n• Voice dictation mic for Hindi input.\n• 8 civic issue categories.",
    whatWorks: "• Voice dictation lowers reporting barrier for blue-collar citizens and on-ground witnesses.\n• Category tagging routes issues accurately.",
    whatFallsShort: "• Voice dictation lacks animated waveform feedback during speech, making users unsure if speech is being captured.",
    strategicTakeaway: "Add pulsating audio wave animation and live interim transcript text inside the input box during voice recording."
  },
  {
    slideNo: 13,
    title: "Hyperlocal City Engine: 2-Tier Navigation",
    subtitle: "CityFeedContent, CityZoneSelector, WardFilterStrip",
    category: "CONTENT",
    surface: "CityFeedContent, CityZoneSelector, WardFilterStrip",
    observations: "• Tier-1 primary saved city tabs + Tier-2 urban zone / rural block pill strip (e.g., भोपाल > एमपी नगर / कोलार / बैरागढ़).",
    whatWorks: "• Solves the 'hyperlocal dilution' problem of national apps by going deeper into neighborhood/ward-level dispatches.",
    whatFallsShort: "• Switching Tier-2 zone pill does not smoothly reset scroll position to top.\n• Empty zones show blank space rather than nearby news.",
    strategicTakeaway: "Add automatic scroll-to-top on zone switch, and fallback to city-wide curated news with an 'आस-पास की खबरें' banner when zone has few stories."
  },
  {
    slideNo: 14,
    title: "Hyperlocal Community Dispatches Carousel",
    subtitle: "CitizenDispatchStrip, StoryCards, ReportActionCard",
    category: "CONTENT",
    surface: "CitizenDispatchStrip, StoryCards, ReportActionCard",
    observations: "• Horizontal card strip in City feed with 'रिपोर्ट भेजें' action card, amber locality tags, and verified citizen story reels.",
    whatWorks: "• Brings community issues directly into the main city news feed.\n• Gives ordinary citizens equal prominence alongside staff journalists.",
    whatFallsShort: "• Pre-refactor carousel lacked unified card container (resolved with #FFFFFF rounded-[22px] frame and VideoPlay badge).",
    strategicTakeaway: "Keep citizen carousel contained in the single surface frame with clear visual differentiation from editorial video reels."
  },
  {
    slideNo: 15,
    title: "E-Paper Experience: Archive Calendar & Edition Switch",
    subtitle: "EpaperScreen, CalendarPickerModal, EditionDropdown",
    category: "CONTENT",
    surface: "EpaperScreen, CalendarPickerModal, EditionDropdown",
    observations: "• Digital replica reader with 30-day historical archive calendar.\n• Multi-edition switcher (Bhopal, Raipur, Indore).\n• Full-page canvas viewer.",
    whatWorks: "• Preserves the tactile newspaper layout favored by traditional print loyalists.\n• Fast edition switching.",
    whatFallsShort: "• Pure canvas/scan viewer lacks a tap-to-read reflowed digital article modal.\n• Pinch-to-zoom is jerky on lower-end hardware.",
    strategicTakeaway: "Implement tap-on-article bounding box detection that opens a clean digital reader sheet (like Dainik Bhaskar e-paper)."
  },
  {
    slideNo: 16,
    title: "E-Paper Monetization & Freemium Gate",
    subtitle: "PaywallModal, SubscriptionPlans, ClippingTool",
    category: "CONTENT",
    surface: "PaywallModal, SubscriptionPlans, ClippingTool",
    observations: "• Freemium access model: Page 1-2 free to preview, Page 3+ behind paywall.\n• Clipping tool for WhatsApp/social sharing with watermark.",
    whatWorks: "• Clipping tool drives viral social sharing while keeping watermark branding intact.\n• Transparent monthly/annual plan options.",
    whatFallsShort: "• Paywall modal triggers abruptly when swiping past Page 2 without a partial teaser.\n• Annual plan lacks 'सर्वश्रेष्ठ मूल्य' badge.",
    strategicTakeaway: "Add blurred preview of Page 3 with floating unlock card rather than hard modal interruption; highlight annual savings badge (40% बचत)."
  },
  {
    slideNo: 17,
    title: "Universal Search: Voice-First & Chronological Sorting",
    subtitle: "SearchScreen, VoiceSearchModal, TrendingKeywords",
    category: "CONTENT",
    surface: "SearchScreen, VoiceSearchModal, TrendingKeywords",
    observations: "• Voice search input button and trending search tag pills.\n• Dual sorting tabs (सबसे नया vs सबसे प्रासंगिक).\n• Search history chips.",
    whatWorks: "• Voice-first search removes Hindi typing keyboard friction.\n• Dual sort gives power users control over temporal vs relevancy discovery.",
    whatFallsShort: "• Recent searches lack individual deletion cross (only 'सब हटाएं').\n• No category filter chips (वीडियो, लेख, शहर) on results page.",
    strategicTakeaway: "Add individual 'x' dismiss button to recent search pills and horizontal filter chips (सभी, केवल वीडियो, ई-पेपर) below search bar."
  },
  {
    slideNo: 18,
    title: "Notifications Center: Batched Feed & Time Grouping",
    subtitle: "NotificationsFeedPage, SingleSurfaceCard, CategoryFilters",
    category: "CONTENT",
    surface: "NotificationsFeedPage, SingleSurfaceCard, CategoryFilters",
    observations: "• Time-bucketed notifications (आज, कल, इस हफ्ते) within a single-surface card frame.\n• Category filter pills (सभी, ब्रेकिंग, मेरा शहर).",
    whatWorks: "• Single surface styling with subtle border lines avoids the disjointed floating bubble syndrome seen in Dainik Jagran.",
    whatFallsShort: "• Mark all as read ('सब पढ़ा हुआ मार्क करें') is hidden inside a kebab menu rather than directly visible on top header.",
    strategicTakeaway: "Expose 'सब पढ़ा हुआ मार्क करें' as a 1-tap text button in the top right header when unread badge count > 0."
  },
  {
    slideNo: 19,
    title: "Side Menu & Profile: Skyline Header & Offline Vault",
    subtitle: "MenuScreen, ProfileScreen, SavedArticlesVault",
    category: "CONTENT",
    surface: "MenuScreen, ProfileScreen, SavedArticlesVault",
    observations: "• Iconic regional skyline illustration header (Bhopal VIP Road / Amber Fort).\n• Offline reading vault with storage meter, font and theme toggles.",
    whatWorks: "• Skyline creates high aesthetic delight and local pride.\n• Offline vault provides true offline reading without network connection.",
    whatFallsShort: "• Offline cache clear button lacks clear warning prompt about downloaded articles being purged.\n• Storage meter numbers update slowly.",
    strategicTakeaway: "Add two-step confirmation on cache purge and optimistic cache recalculation on article delete."
  },
  {
    slideNo: 20,
    title: "SMB Advertiser Flow: Radius Targeting & Self-Serve Checkout",
    subtitle: "AdBookingFlowV2, RadiusSelector, AdCreativeWizard, Checkout",
    category: "CONTENT",
    surface: "AdBookingFlowV2, RadiusSelector, AdCreativeWizard, Checkout",
    observations: "• In-app self-serve ad booking portal for local shops.\n• Hyperlocal radius slider (1km to 15km) with instant reach estimator.\n• UPI payment integration.",
    whatWorks: "• Groundbreaking monetization moat: democratizes digital advertising for Tier-2/3 local merchants directly inside their regional news app.",
    whatFallsShort: "• Creative preview mockup doesn't let merchants upload custom banner aspect ratios.\n• GST invoice download missing in post-payment screen.",
    strategicTakeaway: "Add auto-crop tool for custom shop banners (1:1 and 16:9) and instant 1-tap GST tax invoice download button on the success screen."
  },
  {
    slideNo: 21,
    title: "Comparative Scorecard: Navbharat vs Competitors",
    subtitle: "Benchmarking Across 6 Core Strategic UX Pillars",
    category: "SCORECARD",
    surface: "Strategic Competitive Positioning",
    observations: "Comparative benchmarking across 6 core pillars: Hyperlocal Depth, UGC/Civic Journalism, Ad-to-Content Ratio, Multimedia, Modern Visual Design, and SMB Monetization.",
    whatWorks: "NB scores highest in UGC Ingestion (9.5/10), SMB Monetization (9.0/10), and Hyperlocal Depth (9.2/10).",
    whatFallsShort: "INCUMBENTS (DB, TOI) lead in raw editorial throughput, recommendation engine personalization, and reflowed e-paper text extraction.",
    strategicTakeaway: "Leverage UGC and SMB self-serve ad revenue as the twin growth engines while refining e-paper reader and header scroll dynamics."
  },
  {
    slideNo: 22,
    title: "Strategic UX Debt Backlog & Implementation Priority",
    subtitle: "Prioritized Matrix of 8 Fixes Categorized by Impact vs Effort",
    category: "ROADMAP",
    surface: "Product & Engineering Roadmap",
    observations: "Prioritized matrix of 8 UX debt fixes categorized by impact vs effort (P0: Header collapse, Read-state dimming; P1: Audio dock controls, E-paper text mode).",
    whatWorks: "Clear execution roadmap directly addressing user cognitive overhead and scan efficiency.",
    whatFallsShort: "Requires disciplined frontend execution to maintain 60fps performance across low-memory Android devices.",
    strategicTakeaway: "Ship P0 items immediately to elevate Navbharat's daily active user retention to industry-leading standards."
  }
];

const ops = [
  // Clean default title placeholders from the initial slide 'p'
  { "op": "delete-element", "element": "i0" },
  { "op": "delete-element", "element": "i1" },
  { "op": "set-background", "slide": "p", "color": "#1E1926" },
  
  // Slide 1 Content on initial slide 'p'
  {
    "op": "add-textbox",
    "slide": "p",
    "text": "नवभारत\nNAVBHARAT APP UX AUDIT",
    "x": 60, "y": 80, "width": 600, "height": 90,
    "font_size": 28, "bold": true, "color": "#F5B55C", "font_family": "Montserrat"
  },
  {
    "op": "add-textbox",
    "slide": "p",
    "text": "Comprehensive Product Analysis, UX Evaluation & Strategic Assessment\nBenchmarked against CNN, Dainik Bhaskar, Dainik Jagran & Times of India",
    "x": 60, "y": 180, "width": 600, "height": 70,
    "font_size": 14, "bold": false, "color": "#FFFFFF", "font_family": "Roboto"
  },
  {
    "op": "add-shape",
    "slide": "p",
    "shape_type": "RECTANGLE",
    "x": 60, "y": 270, "width": 600, "height": 2,
    "background_color": "#F5B55C"
  },
  {
    "op": "add-textbox",
    "slide": "p",
    "text": "PREPARED FOR PRODUCT & DESIGN LEADERSHIP  |  CONFIDENTIAL UX AUDIT",
    "x": 60, "y": 290, "width": 600, "height": 30,
    "font_size": 11, "bold": true, "color": "#A098AE", "font_family": "Roboto"
  }
];

// Iterate over slides 2 to 22
for (let i = 1; i < slidesData.length; i++) {
  const data = slidesData[i];
  const slideId = `SLIDE_${data.slideNo}`;

  ops.push({
    "op": "add-slide",
    "layout": "BLANK",
    "id": slideId
  });

  if (data.category === "AGENDA") {
    ops.push({ "op": "set-background", "slide": slideId, "color": "#F9FAFB" });
    // Header
    ops.push({
      "op": "add-textbox",
      "slide": slideId,
      "text": data.title,
      "x": 40, "y": 25, "width": 640, "height": 35,
      "font_size": 20, "bold": true, "color": "#1E1926", "font_family": "Montserrat"
    });
    ops.push({
      "op": "add-textbox",
      "slide": slideId,
      "text": data.subtitle,
      "x": 40, "y": 58, "width": 640, "height": 20,
      "font_size": 12, "bold": false, "color": "#6B7280", "font_family": "Roboto"
    });
    // Agenda Cards Table / Grid
    const chapters = [
      "01. Onboarding & Entry Flow", "02. Permission & Auth Hygiene",
      "03. Home Feed & Hero Layer", "04. Content Density & Read States",
      "05. Live Article Reading Experience", "06. Interactive Civic Widgets",
      "07. Video Hub & 3-Mode Capsule", "08. Reels-to-Article Bridge",
      "09. Nagrik Reporter UGC Studio", "10. Voice Dictation & Locality Pinning",
      "11. Hyperlocal City 2-Tier Engine", "12. Citizen Dispatches Carousel",
      "13. E-Paper Replica & Calendar", "14. Freemium Paywall & Clipping",
      "15. Universal Voice Search", "16. Notifications Center Framing",
      "17. Side Drawer & Offline Vault", "18. SMB Self-Serve Advertiser Flow",
      "19. Strategic Comparative Scorecard", "20. UX Debt Backlog & Priority"
    ];
    
    // Left column
    ops.push({
      "op": "add-textbox",
      "slide": slideId,
      "text": chapters.slice(0, 10).join("\n"),
      "x": 40, "y": 90, "width": 310, "height": 270,
      "font_size": 11, "bold": false, "color": "#2B2437", "font_family": "Roboto",
      "background_color": "#FFFFFF", "line_spacing": 140
    });
    // Right column
    ops.push({
      "op": "add-textbox",
      "slide": slideId,
      "text": chapters.slice(10, 20).join("\n"),
      "x": 370, "y": 90, "width": 310, "height": 270,
      "font_size": 11, "bold": false, "color": "#2B2437", "font_family": "Roboto",
      "background_color": "#FFFFFF", "line_spacing": 140
    });
  } else if (data.category === "SCORECARD" || data.category === "ROADMAP") {
    ops.push({ "op": "set-background", "slide": slideId, "color": "#1E1926" });
    // Header
    ops.push({
      "op": "add-textbox",
      "slide": slideId,
      "text": data.title,
      "x": 40, "y": 25, "width": 640, "height": 35,
      "font_size": 20, "bold": true, "color": "#F5B55C", "font_family": "Montserrat"
    });
    ops.push({
      "op": "add-textbox",
      "slide": slideId,
      "text": data.subtitle,
      "x": 40, "y": 58, "width": 640, "height": 20,
      "font_size": 12, "bold": false, "color": "#CADCFC", "font_family": "Roboto"
    });
    // Content box
    ops.push({
      "op": "add-textbox",
      "slide": slideId,
      "text": `KEY OBSERVATIONS:\n${data.observations}\n\nWHAT WORKS (COMPETITIVE MOATS):\n${data.whatWorks}\n\nWHAT FALLS SHORT (INCUMBENT ADVANTAGES):\n${data.whatFallsShort}`,
      "x": 40, "y": 90, "width": 640, "height": 220,
      "font_size": 12, "bold": false, "color": "#FFFFFF", "font_family": "Roboto",
      "background_color": "#2B2437", "line_spacing": 130
    });
    // Takeaway Box
    ops.push({
      "op": "add-textbox",
      "slide": slideId,
      "text": `STRATEGIC DIRECTIVE: ${data.strategicTakeaway}`,
      "x": 40, "y": 325, "width": 640, "height": 55,
      "font_size": 11, "bold": true, "color": "#1E1926", "font_family": "Roboto",
      "background_color": "#F5B55C"
    });
  } else {
    // Standard Content Slide (Light background with 3 structured cards + takeaway banner)
    ops.push({ "op": "set-background", "slide": slideId, "color": "#F9FAFB" });
    
    // Header
    ops.push({
      "op": "add-textbox",
      "slide": slideId,
      "text": `${data.slideNo < 10 ? '0' : ''}${data.slideNo}. ${data.title}`,
      "x": 40, "y": 20, "width": 640, "height": 30,
      "font_size": 17, "bold": true, "color": "#1E1926", "font_family": "Montserrat"
    });
    ops.push({
      "op": "add-textbox",
      "slide": slideId,
      "text": `Evaluated Surface: ${data.surface}`,
      "x": 40, "y": 48, "width": 640, "height": 18,
      "font_size": 11, "bold": false, "color": "#6B7280", "font_family": "Roboto"
    });

    // Card 1: Key Observations
    ops.push({
      "op": "add-textbox",
      "slide": slideId,
      "text": `🔍 KEY OBSERVATIONS\n\n${data.observations}`,
      "x": 40, "y": 72, "width": 205, "height": 235,
      "font_size": 10.5, "bold": false, "color": "#1F2937", "font_family": "Roboto",
      "background_color": "#FFFFFF", "line_spacing": 130
    });

    // Card 2: What Works (Honest Praise)
    ops.push({
      "op": "add-textbox",
      "slide": slideId,
      "text": `✅ WHAT WORKS (HONEST PRAISE)\n\n${data.whatWorks}`,
      "x": 257, "y": 72, "width": 205, "height": 235,
      "font_size": 10.5, "bold": false, "color": "#065F46", "font_family": "Roboto",
      "background_color": "#ECFDF5", "line_spacing": 130
    });

    // Card 3: What Falls Short (UX Gaps & Debt)
    ops.push({
      "op": "add-textbox",
      "slide": slideId,
      "text": `⚠️ WHAT FALLS SHORT (UX DEBT)\n\n${data.whatFallsShort}`,
      "x": 474, "y": 72, "width": 206, "height": 235,
      "font_size": 10.5, "bold": false, "color": "#991B1B", "font_family": "Roboto",
      "background_color": "#FEF2F2", "line_spacing": 130
    });

    // Bottom Takeaway Banner
    ops.push({
      "op": "add-textbox",
      "slide": slideId,
      "text": `💡 KEY TAKEAWAY FOR NAVBHARAT: ${data.strategicTakeaway}`,
      "x": 40, "y": 320, "width": 640, "height": 55,
      "font_size": 11, "bold": true, "color": "#1E1926", "font_family": "Roboto",
      "background_color": "#FFFBEB"
    });
  }
}

const outputPath = path.resolve('c:/Users/vishw/Downloads/NB frontend/scripts/gslides_nb_audit_batch.json');
fs.writeFileSync(outputPath, JSON.stringify(ops, null, 2), 'utf8');
console.log('Successfully generated GSlides batch operations JSON at:', outputPath);
console.log('Total operations:', ops.length);


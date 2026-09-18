// State and City Master Mock Data for Nava Bharat Hyperlocal Onboarding

export const STATES_DATA = [
  {
    id: "mp",
    name: "मध्य प्रदेश",
    landmark: "सांची स्तूप",
    defaultPriority: 1,
  },
  {
    id: "rj",
    name: "राजस्थान",
    landmark: "हवा महल",
    defaultPriority: 2,
  },
  {
    id: "mh",
    name: "महाराष्ट्र",
    landmark: "गेटवे ऑफ इंडिया",
    defaultPriority: 3,
  },
  {
    id: "gj",
    name: "गुजरात",
    landmark: "स्टैच्यू ऑफ यूनिटी",
    defaultPriority: null,
  },
  {
    id: "cg",
    name: "छत्तीसगढ़",
    landmark: "बस्तर / भोरमदेव",
    defaultPriority: null,
  },
];

export const CITIES_BY_STATE = {
  mp: {
    stateName: "मध्य प्रदेश",
    primary: ["इंदौर", "भोपाल", "ग्वालियर", "जबलपुर", "उज्जैन", "सतना"],
    expanded: ["सागर", "रीवा", "छिंदवाड़ा", "रतलाम", "खंडवा"],
  },
  rj: {
    stateName: "राजस्थान",
    primary: ["जयपुर", "जोधपुर", "कोटा", "अजमेर", "उदयपुर", "बीकानेर"],
    expanded: ["भीलवाड़ा", "अलवर", "सीकर"],
  },
  mh: {
    stateName: "महाराष्ट्र",
    primary: ["मुंबई", "पुणे", "नागपुर", "नाशिक"],
    expanded: ["ठाणे", "औरंगाबाद", "कोल्हापुर"],
  },
  gj: {
    stateName: "गुजरात",
    primary: ["अहमदाबाद", "सूरत", "वडोदरा", "राजकोट"],
    expanded: ["भावनगर", "जामनगर", "गांधीनगर"],
  },
  cg: {
    stateName: "छत्तीसगढ़",
    primary: ["रायपुर", "बिलासपुर", "दुर्ग", "भिलाई"],
    expanded: ["जगदलपुर", "कोरबा", "रायगढ़"],
  },
};

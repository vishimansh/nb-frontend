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

export const TOP_CITIES_BY_STATE = {
  mp: ["इंदौर", "भोपाल", "जबलपुर", "ग्वालियर"],
  rj: ["जयपुर", "जोधपुर", "कोटा", "बीकानेर"],
  mh: ["मुंबई", "पुणे", "नागपुर", "ठाणे"],
  gj: ["अहमदाबाद", "सूरत", "वडोदरा", "राजकोट"],
  cg: ["रायपुर", "भिलाई", "बिलासपुर", "कोरबा"]
};

export const CITIES_BY_STATE = {
  mp: {
    stateName: "मध्य प्रदेश",
    primary: ["इंदौर", "भोपाल", "ग्वालियर", "जबलपुर", "उज्जैन", "सतना"],
    expanded: ["सागर", "रीवा", "छिंदवाड़ा", "रतलाम", "खंडवा"],
    all: ["इंदौर", "भोपाल", "ग्वालियर", "जबलपुर", "उज्जैन", "सतना", "सागर", "रीवा", "छिंदवाड़ा", "रतलाम", "खंडवा"]
  },
  rj: {
    stateName: "राजस्थान",
    primary: ["जयपुर", "जोधपुर", "कोटा", "अजमेर", "उदयपुर", "बीकानेर"],
    expanded: ["भीलवाड़ा", "अलवर", "सीकर"],
    all: ["जयपुर", "जोधपुर", "कोटा", "अजमेर", "उदयपुर", "बीकानेर", "भीलवाड़ा", "अलवर", "सीकर"]
  },
  mh: {
    stateName: "महाराष्ट्र",
    primary: ["मुंबई", "पुणे", "नागपुर", "नाशिक"],
    expanded: ["ठाणे", "औरंगाबाद", "कोल्हापुर"],
    all: ["मुंबई", "पुणे", "नागपुर", "नाशिक", "ठाणे", "औरंगाबाद", "कोल्हापुर"]
  },
  gj: {
    stateName: "गुजरात",
    primary: ["अहमदाबाद", "सूरत", "वडोदरा", "राजकोट"],
    expanded: ["भावनगर", "जामनगर", "गांधीनगर"],
    all: ["अहमदाबाद", "सूरत", "वडोदरा", "राजकोट", "भावनगर", "जामनगर", "गांधीनगर"]
  },
  cg: {
    stateName: "छत्तीसगढ़",
    primary: ["रायपुर", "बिलासपुर", "दुर्ग", "भिलाई"],
    expanded: ["जगदलपुर", "कोरबा", "रायगढ़"],
    all: ["रायपुर", "बिलासपुर", "दुर्ग", "भिलाई", "जगदलपुर", "कोरबा", "रायगढ़"]
  },
};

export const getAllCities = (stateId) => {
  const state = CITIES_BY_STATE[stateId];
  return state?.all || [];
};

export const CITY_NAME_TO_ID = {
  'भोपाल': 'bhopal',
  'इंदौर': 'indore',
  'ग्वालियर': 'gwalior',
  'जबलपुर': 'jabalpur',
  'उज्जैन': 'ujjain',
  'सतना': 'satna',
  'सागर': 'sagar',
  'रीवा': 'rewa',
  'छिंदवाड़ा': 'chhindwara',
  'रतलाम': 'ratlam',
  'खंडवा': 'khandwa',
  'जयपुर': 'jaipur',
  'जोधपुर': 'jodhpur',
  'कोटा': 'kota',
  'अजमेर': 'ajmer',
  'उदयपुर': 'udaipur',
  'बीकानेर': 'bikaner',
  'भीलवाड़ा': 'bhilwara',
  'अलवर': 'alwar',
  'सीकर': 'sikar',
  'मुंबई': 'mumbai',
  'पुणे': 'pune',
  'नागपुर': 'nagpur',
  'नाशिक': 'nashik',
  'ठाणे': 'thane',
  'औरंगाबाद': 'aurangabad',
  'कोल्हापुर': 'kolhapur',
  'अहमदाबाद': 'ahmedabad',
  'सूरत': 'surat',
  'वडोदरा': 'vadodara',
  'राजकोट': 'rajkot',
  'भावनगर': 'bhavnagar',
  'जामनगर': 'jamnagar',
  'गांधीनगर': 'gandhinagar',
  'रायपुर': 'raipur',
  'बिलासपुर': 'bilaspur',
  'दुर्ग': 'durg',
  'भिलाई': 'bhilai',
  'जगदलपुर': 'jagdalpur',
  'कोरबा': 'korba',
  'रायगढ़': 'raigarh',
};

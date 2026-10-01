export const CATEGORIES = [
  { id: 'grocery', label: 'किराना', icon: 'ShoppingBag' },
  { id: 'clothing', label: 'कपड़े', icon: 'Shirt' },
  { id: 'electronics', label: 'इलेक्ट्रॉनिक्स', icon: 'Tv' },
  { id: 'restaurant', label: 'रेस्टोरंट', icon: 'UtensilsCrossed' },
  { id: 'medical', label: 'मेडिकल', icon: 'Stethoscope', restricted: true },
  { id: 'education', label: 'शिक्षा', icon: 'GraduationCap', watch: true },
  { id: 'hardware', label: 'हार्डवेयर', icon: 'Wrench' },
  { id: 'jewellery', label: 'ज्वेलरी', icon: 'Sparkles' },
  { id: 'mobile', label: 'मोबाइल', icon: 'Smartphone' },
  { id: 'beauty', label: 'ब्यूटी', icon: 'Scissors' },
  { id: 'auto', label: 'ऑटो', icon: 'Car' },
  { id: 'agriculture', label: 'कृषि', icon: 'Sprout' },
  { id: 'other', label: 'अन्य', icon: 'Store' },
];

export const getCategoryById = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[12];

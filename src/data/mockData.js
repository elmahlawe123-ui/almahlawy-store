export const brands = [
  { id: 1, name: 'بولو بلاست', logo: 'Polo Plast' },
  { id: 2, name: 'استاندورف', logo: 'Standorf' },
  { id: 3, name: 'ايديال ستاندرد', logo: 'Ideal Standard' },
  { id: 4, name: 'جروهى', logo: 'Grohe' },
  { id: 5, name: 'بانيوهات الطيب', logo: 'Al-Tayeb' },
  { id: 6, name: 'بليزا', logo: 'Pleza' },
];

export const products = [
  {
    id: 101,
    name: 'خلاط حوض جروهى يورو سمارت',
    brand: 'جروهى',
    price: 3450,
    category: 'خلاطات',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400',
    description: 'خلاط حوض عالي الجودة بتصميم عصري ولمعان يدوم طويلاً.'
  },
  {
    id: 102,
    name: 'طقم حمام ايديال ستاندرد سبيس',
    brand: 'ايديال ستاندرد',
    price: 5200,
    category: 'أطقم حمامات',
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=400',
    description: 'طقم حمام كامل يشمل الحوض والمرحاض بتصميم انسيابي مريح.'
  },
  {
    id: 103,
    name: 'بانيو الطيب أكريليك 170x70',
    brand: 'بانيوهات الطيب',
    price: 4800,
    category: 'بانيوهات',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174296fb?auto=format&fit=crop&q=80&w=400',
    description: 'بانيو أكريليك عالي المتانة ومقاوم للخدش والانزلاق.'
  },
  {
    id: 104,
    name: 'مجموعة إكسسوارات بليزا فضي',
    brand: 'بليزا',
    price: 1200,
    category: 'إكسسوارات',
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=400',
    description: 'مكونة من 6 قطع متينة بتشطيب فضي لامع.'
  },
  {
    id: 105,
    name: 'مواسير بولو بلاست ضغط عالي',
    brand: 'بولو بلاست',
    price: 150,
    category: 'تأسيس وسباكة',
    image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&q=80&w=400',
    description: 'مواسير بولى بروبيلين مقاومة للحرارة والضغط.'
  },
  {
    id: 106,
    name: 'مرحاض معلق استاندورف',
    brand: 'استاندورف',
    price: 6500,
    category: 'أطقم حمامات',
    image: 'https://images.unsplash.com/photo-1552550186-b4d6df1ea7f7?auto=format&fit=crop&q=80&w=400',
    description: 'مرحاض معلق عصري يوفر المساحة ويتميز بتدفق ماء قوي.'
  }
];

export const bundles = [
  {
    id: 201,
    name: 'العرض الماسي - تشطيب كامل',
    price: 14500,
    oldPrice: 16200,
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=600',
    description: 'احصل على طقم حمام ايديال، خلاطات جروهي، وبانيو الطيب بسعر لا يقبل المنافسة.',
    items: ['طقم حمام ايديال ستاندرد', 'طقم خلاطات جروهي 3 قطع', 'بانيو الطيب 170 سم']
  },
  {
    id: 202,
    name: 'عرض التأسيس من بولو بلاست',
    price: 4500,
    oldPrice: 5100,
    image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=600',
    description: 'مجموعة التأسيس الكاملة لحمامك بمواسير ووصلات بولو بلاست الألمانية الأصلية.',
    items: ['مواسير بولو بلاست', 'وصلات وملحقات كاملة لحمام ومطبخ']
  }
];

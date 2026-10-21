// Seed content for Yusafir. Figma-provided copy/prices are used where available;
// everything else is plain, factual travel information that admins can edit from the dashboard.
const IMG = '/assets/images';

export const destinations = [
  {
    slug: 'coxs-bazar',
    name: "Cox's Bazar",
    category: 'Beach',
    region: 'Chattogram Division',
    summary:
      "Cox's Bazar is a city, fishing port, tourism centre and district headquarters in southeastern Bangladesh. It is famous mostly for its long natural sandy beach.",
    overview:
      "Cox's Bazar is a town on the southeast coast of Bangladesh. It's known for its very long, sandy beachfront, stretching from Sea Beach in the north to Kolatoli Beach in the south. Aggameda Khyang monastery is home to bronze statues and centuries-old Buddhist manuscripts. South of town, the tropical rainforest of Himchari National Park has waterfalls and many birds. North, sea turtles breed on nearby Sonadia Island.",
    image: `${IMG}/destinations/coxs-bazar.webp`,
    heroImage: `${IMG}/destinations/coxs-bazar-hero.webp`,
    lat: 21.4272,
    lng: 91.9702,
  },
  {
    slug: 'sreemangal',
    name: 'Sreemangal',
    category: 'Tea gardens',
    region: 'Sylhet Division',
    summary:
      'Sreemangal is a town in Moulvibazar District, widely known as the tea capital of Bangladesh. Rolling tea estates and the rainforest of Lawachara National Park surround it.',
    overview:
      "Sreemangal is a town in Moulvibazar District, widely known as the tea capital of Bangladesh. Tea estates cover the low hills around it, and Lawachara National Park, a protected rainforest, is a short ride away and is home to the western hoolock gibbon. Seven-layer tea is a local specialty served in the town's tea cabins.",
    image: `${IMG}/destinations/sreemangal.webp`,
    heroImage: `${IMG}/destinations/sreemangal.webp`,
    lat: 24.3065,
    lng: 91.7296,
  },
  {
    slug: 'sundarbans',
    name: 'Sundarbans',
    category: 'Mangrove forest',
    region: 'Khulna Division',
    summary:
      'The Sundarbans is the largest mangrove forest in the world, shared by Bangladesh and India and listed as a UNESCO World Heritage Site. It is home to the Royal Bengal tiger.',
    overview:
      'The Sundarbans is the largest mangrove forest in the world, shared by Bangladesh and India and listed as a UNESCO World Heritage Site. It is a maze of tidal rivers and channels and is the habitat of the Royal Bengal tiger. Most visits are by boat, usually starting from Khulna or Mongla, and entry is regulated by the Forest Department.',
    image: `${IMG}/destinations/sundarbans.webp`,
    heroImage: `${IMG}/destinations/sundarbans.webp`,
    lat: 22.0,
    lng: 89.2,
  },
  {
    slug: 'sajek',
    name: 'Sajek Valley',
    category: 'Hills',
    region: 'Chattogram Division',
    summary:
      'Sajek Valley is a hilltop area in Rangamati District, in the Chittagong Hill Tracts, known for its views over rolling hills and clouds.',
    overview:
      'Sajek Valley lies in Baghaichhari Upazila of Rangamati District, in the Chittagong Hill Tracts. Visitors come for the views over layered hills and low clouds, especially at sunrise. Several indigenous communities, including Chakma and Tripura families, live in the surrounding hills.',
    image: `${IMG}/destinations/sajek.webp`,
    heroImage: `${IMG}/destinations/sajek.webp`,
    lat: 23.3814,
    lng: 92.2938,
  },
];

const rooms = [`${IMG}/stays/room-1.webp`, `${IMG}/stays/room-2.webp`, `${IMG}/stays/room-3.webp`];
const gallery = (first, ...rest) => [first, ...rooms.filter((r) => r !== first), ...rest].slice(0, 4);
const core = ['Wifi', 'Air conditioning', 'Kitchen'];

export const stays = [
  {
    title: 'Light bright airy stylish apt & safe peaceful stay',
    destination: 'coxs-bazar', pricePerNight: 34, ratingAvg: 4.9, ratingCount: 20, featured: true,
    guests: 4, bedrooms: 2, beds: 2, baths: 2, amenities: core, flexibleCancellation: true,
    description: "Two-bedroom apartment for up to four guests in Cox's Bazar with Wifi, air conditioning and a full kitchen.",
    overview: "A bright two-bedroom apartment with two beds and two bathrooms, set up for families or small groups. The kitchen lets you cook your own meals, air conditioning keeps the rooms cool, and Wifi is included. Flexible cancellation is available.",
    images: gallery(rooms[0]),
  },
  {
    title: 'Apartment in Lost Panorama',
    destination: 'coxs-bazar', pricePerNight: 52, ratingAvg: 4.8, ratingCount: 10, featured: true,
    guests: 4, bedrooms: 2, beds: 2, baths: 2, amenities: core, flexibleCancellation: true,
    description: "Two-bedroom apartment for up to four guests in Cox's Bazar with Wifi, air conditioning and a full kitchen.",
    overview: 'A two-bedroom apartment with two beds and two bathrooms for up to four guests. It has a full kitchen, air conditioning and Wifi, and flexible cancellation is available if your plans change.',
    images: gallery(rooms[1]),
  },
  {
    title: 'AR Lounge & Pool (r&r + b&b)',
    destination: 'coxs-bazar', pricePerNight: 44, ratingAvg: 4.9, ratingCount: 25, featured: true,
    guests: 4, bedrooms: 2, beds: 2, baths: 2, amenities: [...core, 'Pool'], flexibleCancellation: true,
    description: "Bed and breakfast with a pool and beachside lounge, sleeping up to four guests in Cox's Bazar.",
    overview: 'A bed and breakfast with two bedrooms, two beds and two bathrooms for up to four guests, plus a pool and an open-air lounge. Wifi, air conditioning and a kitchen are included, and flexible cancellation is available.',
    images: gallery(rooms[2]),
  },
  {
    title: 'Sea-view studio near Kolatoli Beach',
    destination: 'coxs-bazar', pricePerNight: 46, ratingAvg: 4.7, ratingCount: 14, featured: false,
    guests: 2, bedrooms: 1, beds: 1, baths: 1, amenities: ['Wifi', 'Air conditioning', 'Breakfast included'], flexibleCancellation: false,
    description: 'Compact studio for two guests with air conditioning, Wifi and breakfast included, close to Kolatoli Beach.',
    overview: 'A compact studio with one bed and one bathroom, suited to couples or solo travellers. Breakfast, Wifi and air conditioning are included. Cancellation follows the standard policy with no flexible refund.',
    images: gallery(rooms[1]),
  },
  {
    title: 'Family suite with garden courtyard',
    destination: 'coxs-bazar', pricePerNight: 77, ratingAvg: 4.6, ratingCount: 8, featured: false,
    guests: 6, bedrooms: 3, beds: 4, baths: 2, amenities: [...core, 'Parking', 'Garden'], flexibleCancellation: true,
    description: 'Three-bedroom suite for up to six guests with a private garden courtyard, parking and a full kitchen.',
    overview: 'A spacious suite with three bedrooms, four beds and two bathrooms for up to six guests. It has a private garden courtyard, on-site parking, a full kitchen, air conditioning and Wifi. Flexible cancellation is available.',
    images: gallery(rooms[2]),
  },
  {
    title: 'Budget twin room near Sea Beach',
    destination: 'coxs-bazar', pricePerNight: 20, ratingAvg: 4.5, ratingCount: 31, featured: false,
    guests: 2, bedrooms: 1, beds: 2, baths: 1, amenities: ['Wifi', 'Air conditioning'], flexibleCancellation: false,
    description: 'Simple twin room for two guests with air conditioning and Wifi, near Sea Beach.',
    overview: 'A simple room with two single beds and a private bathroom. It is a practical base for travellers who plan to spend the day on the beach. Wifi and air conditioning are included.',
    images: gallery(rooms[0]),
  },
  {
    title: 'Tea estate cottage in Sreemangal',
    destination: 'sreemangal', pricePerNight: 38, ratingAvg: 4.8, ratingCount: 17, featured: true,
    guests: 4, bedrooms: 2, beds: 2, baths: 1, amenities: ['Wifi', 'Breakfast included', 'Garden'], flexibleCancellation: true,
    description: 'Two-bedroom cottage for up to four guests in Sreemangal, with breakfast included and a garden.',
    overview: 'A two-bedroom cottage with two beds and one bathroom for up to four guests. Breakfast is included, there is a garden to sit in, and Wifi is available. Flexible cancellation is available.',
    images: gallery('/assets/images/destinations/sreemangal.webp'),
  },
  {
    title: 'Rainforest-edge guesthouse near Lawachara',
    destination: 'sreemangal', pricePerNight: 29, ratingAvg: 4.6, ratingCount: 12, featured: false,
    guests: 3, bedrooms: 1, beds: 2, baths: 1, amenities: ['Wifi', 'Breakfast included'], flexibleCancellation: false,
    description: 'One-bedroom guesthouse for up to three guests near Lawachara National Park, breakfast included.',
    overview: 'A one-bedroom guesthouse with two beds and one bathroom, a short ride from Lawachara National Park. Breakfast and Wifi are included. Cancellation follows the standard policy.',
    images: gallery('/assets/images/destinations/sreemangal.webp'),
  },
  {
    title: 'Hilltop cottage in Sajek Valley',
    destination: 'sajek', pricePerNight: 41, ratingAvg: 4.7, ratingCount: 22, featured: true,
    guests: 4, bedrooms: 2, beds: 3, baths: 1, amenities: ['Breakfast included', 'Parking', 'Garden'], flexibleCancellation: true,
    description: 'Two-bedroom hilltop cottage for up to four guests in Sajek Valley, with breakfast and parking included.',
    overview: 'A two-bedroom cottage with three beds and one bathroom for up to four guests. Breakfast and parking are included, and the garden faces the hills. Flexible cancellation is available.',
    images: gallery('/assets/images/destinations/sajek.webp'),
  },
  {
    title: 'Riverside guesthouse in Mongla',
    destination: 'sundarbans', pricePerNight: 33, ratingAvg: 4.4, ratingCount: 9, featured: false,
    guests: 3, bedrooms: 1, beds: 2, baths: 1, amenities: ['Wifi', 'Air conditioning', 'Breakfast included'], flexibleCancellation: false,
    description: 'Guesthouse for up to three guests in Mongla, a common starting point for Sundarbans boat trips.',
    overview: 'A one-bedroom guesthouse with two beds and one bathroom in Mongla, a common starting point for boat trips into the Sundarbans. Breakfast, Wifi and air conditioning are included. Cancellation follows the standard policy.',
    images: gallery('/assets/images/destinations/sundarbans.webp'),
  },
];

const days = (n) => new Date(Date.now() - n * 86_400_000);

export const posts = [
  {
    slug: 'first-timers-guide-to-coxs-bazar', category: 'guide', title: "A first-timer's guide to Cox's Bazar", author: 'Yusafir Editorial', readMinutes: 3, publishedAt: days(10),
    image: `${IMG}/destinations/coxs-bazar.webp`,
    excerpt: "Where to start on the world's longest natural sea beach, and what to see when you want a break from the sand.",
    content: "Cox's Bazar is best known for its beachfront, which runs from Sea Beach in the north to Kolatoli Beach in the south and continues along the coast beyond town. Most visitors base themselves near these central stretches because restaurants, shops and transport are close by.\n\nWhen you want to leave the beach, Aggameda Khyang monastery is home to bronze statues and old Buddhist manuscripts, and Himchari National Park to the south has waterfalls and rainforest birdlife. Sonadia Island to the north is a breeding ground for sea turtles.\n\nBook a stay first, then plan day trips around it. Staying central keeps travel short, while a quieter place further out suits travellers who want space.",
  },
  {
    slug: 'a-weekend-among-the-tea-gardens-of-sreemangal', category: 'guide', title: 'A weekend among the tea gardens of Sreemangal', author: 'Yusafir Editorial', readMinutes: 3, publishedAt: days(24),
    image: `${IMG}/destinations/sreemangal.webp`,
    excerpt: 'Walk the tea estates, look for wildlife in Lawachara, and try the local layered tea.',
    content: "Sreemangal is known as the tea capital of Bangladesh. The low hills around the town are covered in tea estates, and early morning is the best time to walk through them, before the light gets harsh.\n\nLawachara National Park is a protected rainforest close to town and is home to the western hoolock gibbon. Go with a local guide and keep to the marked trails.\n\nBefore you leave, try seven-layer tea, a local specialty served in the town's tea cabins.",
  },
  {
    slug: 'planning-a-trip-into-the-sundarbans', category: 'guide', title: 'Planning a trip into the Sundarbans', author: 'Yusafir Editorial', readMinutes: 4, publishedAt: days(41),
    image: `${IMG}/destinations/sundarbans.webp`,
    excerpt: 'The largest mangrove forest in the world is explored by boat. Here is what to arrange before you go.',
    content: "The Sundarbans is a UNESCO World Heritage Site and the habitat of the Royal Bengal tiger. Its tidal rivers and channels are the main way in, which means most trips are boat tours rather than walks.\n\nTours usually start from Khulna or Mongla, and entry to the forest is regulated by the Forest Department, so check permit requirements with your tour operator before you travel.\n\nBecause tours depart from the edge of the forest, many travellers book a stay in Mongla the night before to start early.",
  },
  {
    slug: 'stay-booking-is-open-for-four-destinations', category: 'news', title: 'Stay booking is open for four destinations', author: 'Yusafir Team', readMinutes: 2, publishedAt: days(5),
    image: `${IMG}/destinations/coxs-bazar-hero.webp`,
    excerpt: "You can now browse and book stays in Cox's Bazar, Sreemangal, Sundarbans and Sajek Valley.",
    content: "Yusafir now lists stays in Cox's Bazar, Sreemangal, Sundarbans and Sajek Valley. Each listing shows the price per night, the number of guests, bedrooms, beds and baths, and the cancellation policy.\n\nCreate an account to book. A new booking starts as pending and is confirmed by our team. You can follow its status, and cancel it, from the My Bookings page in your dashboard.",
  },
  {
    slug: 'reviews-are-now-open-on-every-stay', category: 'news', title: 'Reviews are now open on every stay', author: 'Yusafir Team', readMinutes: 2, publishedAt: days(2),
    image: `${IMG}/stays/room-1.webp`,
    excerpt: 'Logged-in guests can rate a stay from one to five and leave a written review.',
    content: "Every stay page now has a reviews section. If you are logged in you can give the stay a rating from one to five and write a short review. Each account can review a stay once.\n\nThe rating shown on stay cards is the average of all ratings and updates as new reviews arrive.",
  },
];

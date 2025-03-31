const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const Collection = require('../models/collectionModel');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Perfume data with detailed descriptions
const perfumes = [
  // Luxury Perfumes
  {
    name: 'Royal Essence',
    description: 'A majestic blend of rare oud, royal amber, and precious saffron. This opulent fragrance opens with bergamot and cardamom, unveiling a heart of Bulgarian rose and orris. The base notes of sandalwood, patchouli, and vanilla create a sophisticated, lingering trail that embodies true luxury. Perfect for special occasions, this scent commands attention with its distinctive character and exceptional longevity.',
    image: 'https://images.pexels.com/photos/755992/pexels-photo-755992.jpeg',
    price: 8999,
    stock: '50',
    category: ['Luxury', 'Oud', 'Unisex Fragrances', 'New Arrivals']
  },
  {
    name: 'Midnight Velvet',
    description: 'An enchanting nocturnal blend capturing the essence of mystery and allure. This sophisticated perfume combines rich black currant and midnight jasmine with deep notes of smoky vetiver and amber. The velvety texture evolves on the skin, revealing layers of complexity with each passing hour. A perfect companion for elegant evenings and unforgettable nights, Midnight Velvet leaves an intoxicating trail that lingers in the memory.',
    image: 'https://th.bing.com/th/id/OIP.gwd_XwTivnxa6olBO3b7qAHaE8?rs=1&pid=ImgDetMain',
    price: 7499,
    stock: '75',
    category: ['Luxury', 'Evening Wear', "Women's Fragrances", 'Best Sellers']
  },
  {
    name: 'Amber Royale',
    description: 'A majestic composition centered around precious amber, enriched with rare woods and exotic spices. The opening bursts with vibrant bergamot and saffron, leading to a warm heart of labdanum and myrrh. Base notes of vanilla, sandalwood, and benzoin create a rich, resinous foundation that encapsulates timeless luxury. This regal fragrance envelops the wearer in an aura of sophistication and distinction, ideal for those who appreciate extraordinary olfactory experiences.',
    image: 'https://th.bing.com/th/id/OIP.I-thhbeRfi7xnvXCopiRoQHaMB?w=196&h=318&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
    price: 9999,
    stock: '40',
    category: ['Luxury', 'Amber', 'Unisex Fragrances', 'Limited Editions']
  },
  
  // Fresh & Citrus
  {
    name: 'Mediterranean Breeze',
    description: 'A refreshing escape to sun-drenched citrus groves along the Mediterranean coast. This invigorating fragrance opens with sparkling notes of Sicilian lemon, bergamot, and mandarin, balanced by aromatic rosemary and basil. The heart reveals white flowers and sea salt accord, while the base offers a subtle blend of cedar and white musk. Perfect for warm weather, this scent captures the essence of coastal bliss and carefree summer days with remarkable clarity and brightness.',
    image: 'https://th.bing.com/th/id/OIP.HEqlDJcJSC-QDodpJ8Ng6AHaF7?w=279&h=223&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
    price: 3999,
    stock: '120',
    category: ['Fresh', 'Citrus', "Summer Collection", 'New Arrivals']
  },
  {
    name: 'Citrus Splash',
    description: 'An energizing explosion of citrus notes designed to invigorate the senses and lift the spirit. This vibrant composition begins with zesty lime, grapefruit, and lemon verbena, complemented by green tea and mint for added freshness. The heart features subtle aquatic notes and transparent florals, while the base provides a clean, modern foundation of white woods and musk. A perfect daily companion, this effervescent fragrance brings a burst of energy and optimism to any moment.',
    image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg',
    price: 2999,
    stock: '150',
    category: ['Fresh', 'Citrus', "Unisex Fragrances", 'Best Sellers']
  },
  
  // Floral
  {
    name: 'Rose Symphony',
    description: 'A magnificent tribute to the queen of flowers, showcasing different facets of rose in perfect harmony. This elegant composition intertwines Bulgarian rose, Turkish rose, and May rose, enhanced by bright bergamot and pink pepper. The heart reveals supporting notes of peony, lily of the valley, and a touch of raspberry for modern radiance. The base features patchouli, sandalwood, and musk creating a timeless, sophisticated floral masterpiece with exceptional depth and character.',
    image: 'https://th.bing.com/th/id/OIP.dkHwewY8IFAMznlJRtkKQwHaLG?w=204&h=305&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
    price: 5999,
    stock: '100',
    category: ['Floral', "Women's Fragrances", 'Best Sellers']
  },
  {
    name: 'White Blossom',
    description: 'A celebration of luminous white flowers in their most exquisite expression. This pure and radiant composition showcases the ethereal beauty of jasmine sambac, orange blossom, and tuberose, opening with delicate notes of dewy pear and lychee. The heart is a magnificent floral bouquet, while the base offers creamy sandalwood, vanilla, and white amber. This sophisticated fragrance embodies feminine grace and elegance, leaving a memorable trail of refined beauty.',
    image: 'https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg',
    price: 4999,
    stock: '85',
    category: ['Floral', "Women's Fragrances", 'New Arrivals']
  },
  
  // Woody
  {
    name: 'Cedar Majesty',
    description: 'A sophisticated woody composition celebrating the noble character of cedar in its most refined form. This distinctive fragrance opens with bright bergamot and cardamom, leading to a heart dominated by Atlas cedar, cypress, and subtle violet leaves. The base reveals a complex blend of vetiver, amber, and leather accords, creating a powerful yet elegant statement. Perfect for those who appreciate architectural, structured scents with depth and character that command respect.',
    image: 'https://bellavitaorganic.com/cdn/shop/files/download_8064dace-302a-4462-a075-9da8103f97f9.jpg?v=1738909116&width=400',
    price: 4599,
    stock: '90',
    category: ['Woody', "Men's Fragrances", 'Best Sellers']
  },
  {
    name: 'Sandalwood Legacy',
    description: 'An homage to precious sandalwood in all its creamy, sophisticated glory. This rich composition begins with cardamom and nutmeg, unveiling a heart of smooth Australian sandalwood enhanced by rose and violet. The base offers depth through vetiver, amber, and a touch of vanilla, creating a warm, enveloping aura that becomes like a second skin. This timeless fragrance offers exceptional longevity and sillage, perfect for those who appreciate refined, natural elegance.',
    image: 'https://bellavitaorganic.com/cdn/shop/files/download_5bea8eae-fa1f-45d3-95bc-81ced6860f9d.jpg?v=1732892381&width=400',
    price: 6999,
    stock: '65',
    category: ['Woody', 'Sandalwood', 'Unisex Fragrances', 'Limited Editions']
  },
  
  // Oriental
  {
    name: 'Spice Market',
    description: 'A captivating journey through ancient spice markets of the East, rich with exotic aromas and mystery. This opulent oriental opens with vibrant saffron and cardamom, revealing a heart of precious oud, Turkish rose, and incense. The base offers rich amber, vanilla, and musk for a warm, enveloping trail that lingers beautifully. This complex fragrance transcends seasons with its magnificent presence, perfect for those who appreciate bold, statement perfumes with cultural depth.',
    image: 'https://bellavitaorganic.com/cdn/shop/files/0_3.jpg?v=1698055971&width=400',
    price: 7499,
    stock: '70',
    category: ['Oriental', 'Spicy', 'Unisex Fragrances', 'Limited Editions']
  },
  {
    name: 'Amber Nights',
    description: 'A sumptuous oriental amber that captures the magic of desert nights under the stars. This sophisticated composition begins with saffron and bergamot, leading to a rich heart of amber, labdanum, and rose. The base reveals vanilla, patchouli, and oud notes that create a warm, resinous embrace lasting for hours. This luxurious fragrance offers exceptional depth and complexity, perfect for cool evenings and special occasions where its magnificent trail makes an unforgettable impression.',
    image: 'https://bellavitaorganic.com/cdn/shop/files/1_25f79680-b265-4423-b0c2-bdf6af78b69a.jpg?v=1700137801&width=400',
    price: 6999,
    stock: '80',
    category: ['Oriental', 'Amber', 'Unisex Fragrances', 'Best Sellers']
  },
  
  // Fresh Additions
  {
    name: 'Ocean Breeze',
    description: 'A refreshing aquatic fragrance that captures the essence of a pristine coastline. This invigorating scent opens with sea salt accord, bergamot, and ozonic notes, creating an immediate sensation of fresh sea air. The heart reveals water lily, jasmine, and transparent florals, while the base offers ambergris, driftwood, and white musk. Perfect for hot summer days, this clean, refreshing fragrance evokes the serenity of ocean vistas and the revitalizing power of coastal escapes.',
    image: 'https://images.pexels.com/photos/161599/scent-sticks-fragrance-aromatic-161599.jpeg',
    price: 3499,
    stock: '110',
    category: ['Fresh', 'Aquatic', 'Unisex Fragrances', 'Summer Collection']
  },
  {
    name: 'Green Vitality',
    description: 'A vibrant celebration of lush greenery and vital energy. This refreshing composition opens with crushed mint leaves, lime zest, and galbanum, creating an immediate sensation of natural freshness. The heart features violet leaves, green tea, and aromatic herbs, while the base offers vetiver, cedar, and light musk. An ideal companion for active lifestyles, this energizing fragrance breathes life into everyday moments with its crisp, natural character and uplifting presence.',
    image: 'https://images.pexels.com/photos/4110348/pexels-photo-4110348.jpeg',
    price: 2999,
    stock: '130',
    category: ['Fresh', 'Green', "Men's Fragrances", 'New Arrivals']
  },
  
  // Modern Luxury
  {
    name: 'Black Opulence',
    description: 'A bold, contemporary statement fragrance that embodies modern luxury and sophistication. This striking composition opens with black pepper, dark berries, and a touch of absinthe, leading to an intense heart of black leather, black orchid, and smoky incense. The base reveals powerful notes of oud, black amber, and patchouli for a distinctive, long-lasting trail. This exceptional fragrance commands attention with its contemporary character and mysterious depth, perfect for confident individuals who appreciate artistic expression.',
    image: 'https://bellavitaorganic.com/cdn/shop/files/Tiger-10_1_2_1.jpg?v=1720330847&width=1000',
    price: 8499,
    stock: '60',
    category: ['Luxury', 'Modern', "Men's Fragrances", 'Limited Editions']
  },
  {
    name: 'Velvet Iris',
    description: 'A masterful interpretation of noble iris in its most luxurious form. This sophisticated fragrance showcases precious orris butter enhanced by violet leaves and subtle carrot seed, opening with bright bergamot and pink pepper. The heart reveals the full glory of iris pallida alongside rose and jasmine, while the base offers cashmere woods, vanilla, and ambrette seeds. This elegant, powdery creation embodies refined taste and timeless elegance, perfect for those who appreciate understated luxury.',
    image: 'https://images.pexels.com/photos/264870/pexels-photo-264870.jpeg',
    price: 7999,
    stock: '70',
    category: ['Luxury', 'Floral', "Women's Fragrances", 'Best Sellers']
  },
  
  // Distinctive Men's Fragrances
  {
    name: 'Leather & Oud',
    description: 'A powerful masculine statement combining two iconic materials in perfect balance. This sophisticated fragrance opens with spicy saffron and cardamom, revealing a heart of smoky oud wood complemented by rich leather accord and tobacco. The base features dark patchouli, amber, and benzoin, creating a bold, memorable signature. This distinguished fragrance offers exceptional projection and longevity, perfect for the confident man who appreciates traditional masculine elements with contemporary sophistication.',
    image: 'https://images.pexels.com/photos/3910071/pexels-photo-3910071.jpeg',
    price: 6799,
    stock: '75',
    category: ['Woody', 'Leather', "Men's Fragrances", 'Best Sellers']
  },
  {
    name: 'Gentleman\'s Club',
    description: 'A sophisticated tribute to traditional gentleman\'s clubs with their rich atmosphere of polished wood, fine spirits, and leather armchairs. This elegant composition opens with bergamot, mandarin, and cinnamon, revealing a heart of tobacco, cognac accord, and cedarwood. The base features vetiver, vanilla, and leather for a warm, refined trail. This distinguished fragrance offers timeless masculinity with modern refinement, perfect for the discerning gentleman who values tradition with a contemporary edge.',
    image: 'https://bellavitaorganic.com/cdn/shop/files/1_f67f45b0-f265-4845-98bf-982e0c595504.jpg?v=1714740709&width=400',
    price: 5999,
    stock: '85',
    category: ['Woody', 'Aromatic', "Men's Fragrances", 'New Arrivals']
  },
  
  // More products to reach 100
  // You can continue this pattern with more perfumes
];

// Function to generate additional perfumes to reach 100
const generateMorePerfumes = () => {
  const categories = [
    ['Luxury', 'Oud', 'Unisex Fragrances', 'New Arrivals'],
    ['Fresh', 'Citrus', "Men's Fragrances", 'Summer Collection'],
    ['Floral', "Women's Fragrances", 'Best Sellers'],
    ['Woody', 'Aromatic', "Men's Fragrances", 'New Arrivals'],
    ['Oriental', 'Spicy', 'Unisex Fragrances', 'Limited Editions'],
    ['Fresh', 'Aquatic', "Women's Fragrances", 'Summer Collection'],
    ['Woody', 'Leather', "Men's Fragrances", 'Best Sellers'],
    ['Luxury', 'Modern', "Women's Fragrances", 'New Arrivals'],
    ['Oriental', 'Amber', "Men's Fragrances", 'Winter Collection'],
    ['Floral', 'Fruity', "Women's Fragrances", 'Spring Collection']
  ];
  
  const adjectives = ['Majestic', 'Elegant', 'Divine', 'Royal', 'Celestial', 'Eternal', 'Precious', 'Sublime', 'Exquisite', 'Opulent', 'Timeless', 'Classic', 'Modern', 'Sophisticated', 'Intense'];
  
  const nouns = ['Rose', 'Oud', 'Amber', 'Musk', 'Jasmine', 'Sandalwood', 'Vanilla', 'Vetiver', 'Iris', 'Leather', 'Woods', 'Saffron', 'Bergamot', 'Neroli', 'Incense', 'Spice', 'Violets', 'Cedar', 'Orchid', 'Patchouli'];
  
  const images = [
    'https://images.pexels.com/photos/755992/pexels-photo-755992.jpeg',
    'https://www.elpalaciodehierro.com/on/demandware.static/-/Sites-palacio-master-catalog/default/dw624c9c8c/images/15763616/large/15763616_x1.jpg',
    'https://img.lazcdn.com/g/p/1469d54cae3a44ee412b71802b2e8e26.jpg_720x720q80.jpg',
    'https://th.bing.com/th/id/OIP.9EnwxNCinROJvsu9Np_mJwHaHa?rs=1&pid=ImgDetMain',
    'https://goodmockups.com/wp-content/uploads/2022/08/Free-Clear-Glass-Perfume-Bottle-Mockup-PSD.jpg',
    'https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg',
    'https://image.shutterstock.com/z/stock-photo-perfume-bottle-244186693.jpg',
    'https://static.vecteezy.com/system/resources/previews/024/050/446/non_2x/a-high-class-bottle-of-glass-perfume-with-light-blue-liquid-aromatic-perfume-bottles-on-white-background-beauty-product-cosmetic-perfume-day-fragrance-day-or-perfume-launch-event-by-ai-generated-free-photo.jpg',
    'https://th.bing.com/th/id/OIP.zdUQuyq7OXzrYZ818aEfAwHaKF?w=1087&h=1481&rs=1&pid=ImgDetMain',
    'https://th.bing.com/th/id/OIP.Q6bkV1x5TDdqWHD_u7IoSwHaHa?w=626&h=626&rs=1&pid=ImgDetMain',
    'https://images.pexels.com/photos/161599/scent-sticks-fragrance-aromatic-161599.jpeg',
    'https://images.pexels.com/photos/4110348/pexels-photo-4110348.jpeg',
    'https://th.bing.com/th/id/OIP.Vl8gQsZHYwX5otvLU8E5tQHaHa?w=626&h=626&rs=1&pid=ImgDetMain',
    'https://images.pexels.com/photos/264870/pexels-photo-264870.jpeg',
    'https://images.pexels.com/photos/3910071/pexels-photo-3910071.jpeg',
    'https://cdn.pixabay.com/photo/2021/12/28/16/40/perfume-6899766_1280.jpg',
    'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg'
  ];
  
  const descriptions = [
    "A captivating blend that opens with vibrant citrus notes, leading to a heart of exquisite florals. The base reveals precious woods and amber for a sophisticated, lasting impression. This extraordinary fragrance embodies elegance and distinction, perfect for those who appreciate refined olfactory experiences.",
    
    "An opulent creation showcasing the finest ingredients from around the world. This luxurious composition begins with sparkling bergamot and pink pepper, unveiling a rich heart of rare florals and spices. The base offers a complex blend of precious woods, resins, and musks, creating a magnificent trail that lasts for hours.",
    
    "A masterpiece of perfumery that captures the essence of timeless elegance. This sophisticated fragrance harmoniously balances brightness and depth, opening with fresh citrus notes before revealing its floral heart. The dry down features rare woods and amber, creating a signature that's both distinctive and refined.",
    
    "An artistic expression that pushes the boundaries of traditional perfumery. This innovative composition features unexpected contrasts and harmonies, opening with vibrant top notes that evolve into a complex heart. The base provides a rich foundation that evolves beautifully throughout the day, revealing new facets with each hour.",
    
    "A tribute to natural beauty and artisanal craftsmanship. This exceptional fragrance showcases the finest natural ingredients, expertly blended to create a harmonious composition with remarkable depth. From the bright opening to the rich base notes, every element has been carefully calibrated for perfect balance and exceptional longevity."
  ];
  
  const additionalPerfumes = [];
  
  for (let i = 0; i < 85; i++) {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const name = `${adjective} ${noun}`;
    
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    const image = images[Math.floor(Math.random() * images.length)];
    const price = Math.floor(Math.random() * 8000) + 2000; // Random price between 2000 and 10000
    const stock = (Math.floor(Math.random() * 150) + 50).toString(); // Random stock between 50 and 200
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    additionalPerfumes.push({
      name,
      description,
      image,
      price,
      stock,
      category
    });
  }
  
  return additionalPerfumes;
};

// Add generated perfumes to the list
const allPerfumes = [...perfumes, ...generateMorePerfumes()];

// Seed the database
const seedDatabase = async () => {
  try {
    // Clear existing collections
    await Collection.deleteMany({});
    console.log('Previous collections cleared');
    
    // Insert new perfumes
    const result = await Collection.insertMany(allPerfumes);
    console.log(`Successfully added ${result.length} perfumes to the database`);
    
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
};

// Run the seeding
seedDatabase(); 
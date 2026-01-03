
export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  category: string;
  description: string;
  image: string;
  images: string[];
  variants: {
    color: string;
    stock: number;
  }[];
  isNew?: boolean;
  isBestSeller?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Breitling Premier B01",
    brand: "Breitling",
    price: 550000,
    category: "Watches",
    description: "The Premier B01 Chronograph 42 features a stainless steel case, a silver dial and a brown alligator leather strap. Designed for elegance and performance.",
    image: "/attached_assets/front_facing_watch_1767424726883.png",
    images: ["/attached_assets/front_facing_watch_1767424726883.png"],
    variants: [
      { color: "Silver/Brown", stock: 5 },
      { color: "Blue/Black", stock: 2 }
    ],
    isBestSeller: true
  },
  {
    id: 2,
    name: "Royal Oak Selfwinding",
    brand: "Audemars Piguet",
    price: 2800000,
    category: "Watches",
    description: "Experience the iconic Royal Oak design with its steel case, octagonal bezel, and integrated bracelet.",
    image: "/attached_assets/front_facing_watch_1767424726883.png", // Using provided asset
    images: ["/attached_assets/front_facing_watch_1767424726883.png"],
    variants: [
      { color: "Gold/Black", stock: 1 },
      { color: "Silver/Blue", stock: 3 }
    ],
    isNew: true
  },
  {
    id: 3,
    name: "Classic Fusion Original",
    brand: "Hublot",
    price: 620000,
    category: "Watches",
    description: "A perfect fusion of classic elegance and modern innovation. Features a polished titanium case.",
    image: "/attached_assets/right_tilted_watch_1767424726883.png", // Using provided asset
    images: ["/attached_assets/right_tilted_watch_1767424726883.png"],
    variants: [
      { color: "Gold/White", stock: 4 }
    ],
    isBestSeller: true
  },
  {
    id: 4,
    name: "Oyster Perpetual 41",
    brand: "Rolex",
    price: 580000,
    category: "Watches",
    description: "The Oyster Perpetual 41 with a bright black dial and an Oyster bracelet.",
    image: "/attached_assets/Overview_2_1767424726884.png", // Using provided asset (Gold watch)
    images: ["/attached_assets/Overview_2_1767424726884.png"],
    variants: [
      { color: "Gold", stock: 8 }
    ]
  },
  {
    id: 5,
    name: "Signature Belt",
    brand: "Gucci",
    price: 35000,
    category: "Belts",
    description: "Leather belt with Double G buckle.",
    image: "/attached_assets/leather-belt.jpg",
    images: ["/attached_assets/leather-belt.jpg"],
    variants: [
      { color: "Black", stock: 10 },
      { color: "Brown", stock: 5 }
    ]
  },
  {
    id: 6,
    name: "Aviator Classics",
    brand: "Ray-Ban",
    price: 12000,
    category: "Sunglasses",
    description: "Timeless aviator style sunglasses with gold frame and green classic G-15 lenses.",
    image: "/attached_assets/Sunglasses.png",
    images: ["/attached_assets/Sunglasses.png"],
    variants: [
      { color: "Gold", stock: 15 }
    ]
  },
  {
    id: 7,
    name: "Exquisite Attar",
    brand: "Scent Masters",
    price: 4500,
    category: "Attar",
    description: "Premium concentrated perfume oil with long-lasting fragrance.",
    image: "/attached_assets/Attar.jpg",
    images: ["/attached_assets/Attar.jpg"],
    variants: [
      { color: "Oudh", stock: 20 }
    ]
  }
];

export const CATEGORIES = ["Watches", "Belts", "Sunglasses", "Attar"];

// Bulletproof In-Memory Fallback Data Store for Presentation Uptime
const fallbackProducts = [
    {
        id: 1,
        name: "Ardor Avaitor",
        brand: "Ray-Ban",
        price: 2499.00,
        newPrice: 1999.00,
        category: "sports",
        gender: "unisex",
        description: "Classic aviator style for the bold. Features polarising UV-400 protective lenses with durable titanium gold frames.",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
        rating: 4.7,
        trending: true,
        qty: 15,
        additionalImages: [
            "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&q=80&w=800"
        ],
        colors: ["Gold", "Black"],
        sizes: ["Medium", "Large"]
    },
    {
        id: 2,
        name: "Caper Active",
        brand: "Oakley",
        price: 1599.00,
        newPrice: 1299.00,
        category: "sports",
        gender: "men",
        description: "Active wear for high performance sports. Lightweight frame designed for max comfort during movement.",
        image: "https://images.unsplash.com/photo-1502489597346-dad15683d4c2?auto=format&fit=crop&q=80&w=800",
        rating: 4.5,
        trending: true,
        qty: 20,
        additionalImages: [
            "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=800"
        ],
        colors: ["Matte Black"],
        sizes: ["Standard"]
    },
    {
        id: 3,
        name: "Alder Street",
        brand: "Fastrack",
        price: 3499.00,
        newPrice: 2999.00,
        category: "sports",
        gender: "unisex",
        description: "Street style with unmatched durability. Anti-glare coating with shatterproof poly-carbonate lenses.",
        image: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=800",
        rating: 4.8,
        trending: true,
        qty: 10,
        additionalImages: [
            "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800"
        ],
        colors: ["Silver"],
        sizes: ["Medium"]
    },
    {
        id: 4,
        name: "Black boss",
        brand: "Boss",
        price: 3999.00,
        newPrice: 2999.00,
        category: "sunglasses",
        gender: "men",
        description: "Premium luxury black sunglasses crafted with hand-polished Italian acetate.",
        image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=800",
        rating: 4.9,
        trending: true,
        qty: 8,
        additionalImages: [
            "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800"
        ],
        colors: ["Black"],
        sizes: ["Large"]
    },
    {
        id: 5,
        name: "Hip Hop Candy",
        brand: "Vogue",
        price: 1999.00,
        newPrice: 1499.00,
        category: "sports",
        gender: "women",
        description: "Funky and fresh pop-color design for everyday fashion statement.",
        image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800",
        rating: 4.3,
        trending: true,
        qty: 25,
        additionalImages: [
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=800"
        ],
        colors: ["Pink", "Yellow"],
        sizes: ["Small", "Medium"]
    },
    {
        id: 6,
        name: "Punk Cut Out",
        brand: "Diesel",
        price: 3599.00,
        newPrice: 2999.00,
        category: "sunglasses",
        gender: "unisex",
        description: "Edgy cut-out frame design with dark gradient UV protection lenses.",
        image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800",
        rating: 4.6,
        trending: true,
        qty: 12,
        additionalImages: [
            "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=800"
        ],
        colors: ["Gunmetal"],
        sizes: ["Medium"]
    },
    {
        id: 7,
        name: "Rounded Gold",
        brand: "Lenskart",
        price: 1799.00,
        newPrice: 1299.00,
        category: "vision",
        gender: "women",
        description: "Gold rimmed elegant round eyeglasses with blue-light filtering lenses.",
        image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=800",
        rating: 4.4,
        trending: true,
        qty: 30,
        additionalImages: [
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=800"
        ],
        colors: ["Rose Gold", "Gold"],
        sizes: ["Small", "Medium"]
    }
];

const fallbackCategories = [
    { 
        id: 1, 
        categoryName: "sports", 
        description: "High performance athletic eyewear",
        categoryImg: "https://images.unsplash.com/photo-1502489597346-dad15683d4c2?auto=format&fit=crop&q=80&w=800"
    },
    { 
        id: 2, 
        categoryName: "sunglasses", 
        description: "UV protected luxury fashion sunglasses",
        categoryImg: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800"
    },
    { 
        id: 3, 
        categoryName: "vision", 
        description: "Blue light blocking optical glasses",
        categoryImg: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=800"
    }
];

const fallbackCart = [];
const fallbackWishlist = [];
const fallbackOrders = [];

module.exports = {
    fallbackProducts,
    fallbackCategories,
    fallbackCart,
    fallbackWishlist,
    fallbackOrders
};

require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');

// 🟢 1. THE ULTIMATE MEGA-DATABASE (Fully Repaired)
const restaurantDB = [
    {
        idKey: 'burgerking',
        name: "Burger King", tags: "American • Burgers • Fast Food", rating: "4.5", loc: "Connaught Place, New Delhi",
        logo: "https://tse4.mm.bing.net/th/id/OIP.cuT8f44iiICDTIAdw1Ns6gHaEK?r=0&rs=1&pid=ImgDetMain",
        bg: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2065&auto=format&fit=crop",
        menu: {
            "Recommended": [
                { name: "Classic Cheese Burger", price: 199, desc: "Signature beef patty with melted cheddar.", isVeg: false, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop" },
                { name: "Crispy Veg Burger", price: 149, desc: "A wholesome veg patty with fresh lettuce and mayo.", isVeg: true, img: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?q=80&w=500&auto=format&fit=crop" },
                { name: "Double Whopper", price: 349, desc: "Two flame-grilled patties with fresh tomatoes.", isVeg: false, img: "https://images.unsplash.com/photo-1586816001966-79b736744398?q=80&w=500&auto=format&fit=crop" }
            ],
            "Bestsellers": [
                { name: "Peri Peri Fries", price: 129, desc: "Crispy golden fries tossed in spicy Peri Peri.", isVeg: true, img: "https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=500&auto=format&fit=crop" },
                { name: "Chicken Nuggets (9 Pc)", price: 219, desc: "Tender and breaded chicken nuggets served hot.", isVeg: false, img: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=500&auto=format&fit=crop" }
            ],
            "Sides & Beverages": [
                { name: "Hershey's Sundae", price: 99, desc: "Creamy vanilla ice cream drizzled with chocolate.", isVeg: true, img: "https://madebykiara.com/wp-content/uploads/2025/07/Homemade_Chocolate_Ice_Cream_Recipe_4.webp" },
                { name: "Pepsi Large", price: 89, desc: "A perfectly chilled large Pepsi for your meal.", isVeg: true, img: "https://m.media-amazon.com/images/I/51-r9pOh08L._SX522_.jpg" },
                { name: "Veggie Wrap", price: 179, desc: "A delicious wrap loaded with fresh veggies and sauces.", isVeg: true, img: "https://th.bing.com/th/id/OIP.sZYj3jpgnzZeLju8LmuDWwHaHa?w=162&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" }
            ]
        }
    },
    {
        idKey: 'dominos',
        name: "Domino's Pizza", tags: "Pizzas • Italian • Fast Food", rating: "4.3", loc: "South Extension, New Delhi",
        logo: "https://upload.wikimedia.org/wikipedia/commons/7/74/Dominos_pizza_logo.svg",
        bg: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2000&auto=format&fit=crop",
        menu: {
            "Recommended": [
                { name: "Farmhouse Pizza (Medium)", price: 459, desc: "A pizza that goes ballistic on veggies! crisp capsicum & tomato.", isVeg: true, img: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=500&auto=format&fit=crop" },
                { name: "Pepperoni Pizza (Large)", price: 599, desc: "Classic American pepperoni with extra mozzarella cheese.", isVeg: false, img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=500&auto=format&fit=crop" }
            ],
            "Bestsellers": [
                { name: "Margherita Pizza (Reg)", price: 219, desc: "A classic delight loaded with extra cheese.", isVeg: true, img: "https://images.unsplash.com/photo-1613564834361-9436948817d1?q=80&w=500&auto=format&fit=crop" },
                { name: "Veg Extravaganza Pizza", price: 549, desc: "Loaded with black olives, capsicum, onion & corn.", isVeg: true, img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&auto=format&fit=crop" }
            ],
            "Sides & Desserts": [
                { name: "Garlic Breadsticks", price: 149, desc: "Freshly baked garlic bread, served with cheese dip.", isVeg: true, img: "https://th.bing.com/th/id/OIP.kAOhmqRKUo4QSDIxEzAvigHaE8?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3" },
                { name: "Choco Lava Cake", price: 109, desc: "Delicious hot cake oozing with chocolate lava.", isVeg: true, img: "https://madebykiara.com/wp-content/uploads/2025/07/Homemade_Chocolate_Ice_Cream_Recipe_4.webp" },
                { name: "Cheese Burst Patty", price: 69, desc: "A side dish loaded with molten cheese.", isVeg: true, img: "https://th.bing.com/th/id/OIP.HQfUZ3XNAV3f5lSeYX8unwHaE1?w=239&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
                { name: "Coca-Cola (500ml)", price: 60, desc: "A cool and refreshing Coca-Cola bottle.", isVeg: true, img: "https://m.media-amazon.com/images/I/71ry6WTpKdL._SL1500_.jpg" },
                { name: "Choco Lava Cake (Extra)", price: 109, desc: "Delicious hot cake oozing with chocolate lava.", isVeg: true, img: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=500&auto=format&fit=crop" }
            ]
        }
    },
    {
        idKey: 'kfc',
        name: "KFC", tags: "Fried Chicken • American • Fast Food", rating: "4.1", loc: "Lajpat Nagar, New Delhi",
        logo: "https://upload.wikimedia.org/wikipedia/commons/b/bf/KFC_logo.svg",
        bg: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?q=80&w=2067&auto=format&fit=crop",
        menu: {
            "Recommended": [
                { name: "Zinger Burger", price: 219, desc: "Signature crispy chicken breast with mayo and lettuce.", isVeg: false, img: "https://tse2.mm.bing.net/th/id/OIP.6q1UNLBc7OQL7merlUraDgHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
                { name: "Hot & Crispy Bucket", price: 699, desc: "8 pcs of signature Hot & Crispy fried chicken.", isVeg: false, img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=500&auto=format&fit=crop" }
            ],
            "Bestsellers": [
                { name: "Popcorn Chicken (Med)", price: 189, desc: "Bite-sized crispy chicken pieces.", isVeg: false, img: "https://th.bing.com/th/id/OSK.34c2174bfcba43c7b0dd1b2f655d2628?w=424&h=424&c=7&rs=1&qlt=90&o=6&dpr=1.3&pid=16.1" },
                { name: "Classic Chicken Wrap", price: 179, desc: "A wholesome wrap loaded with crispy chicken.", isVeg: false, img: "https://tse3.mm.bing.net/th/id/OIP.n-pLX0u_BpI2U5UaSjLNDgHaHa?r=0&w=847&h=847&rs=1&pid=ImgDetMain&o=7&rm=3" },
                { name: "Hot Wings (4 Pc)", price: 149, desc: "Spicy and crispy fried chicken wings.", isVeg: false, img: "https://tse4.mm.bing.net/th/id/OIP.VqCnkA9j5UNVV7W_LX8BWgHaEK?r=0&w=780&h=438&rs=1&pid=ImgDetMain&o=7&rm=3" }
            ],
            "Combos & Sides": [
                { name: "Meal for 2 - $69", price: 599, desc: "A combo meal with wings, tenders, and fries.", isVeg: false, img: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?q=80&w=500&auto=format&fit=crop" },
                { name: "Fries (Large)", price: 119, desc: "A large portion of crispy golden fries.", isVeg: true, img: "https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=500&auto=format&fit=crop" },
                { name: "Chocolate Krusher", price: 159, desc: "A rich and thick chocolate shake.", isVeg: true, img: "https://img.buzzfeed.com/buzzfeed-static/static/2021-10/12/1/asset/6676598cc8c8/sub-buzz-771-1634001885-8.png?downsize=900:*&output-format=auto&output-quality=auto" }
            ]
        }
    },
    {
        idKey: 'subway',
        name: "Subway", tags: "Healthy • Sandwiches • Salads", rating: "4.2", loc: "Hauz Khas, New Delhi",
        logo: "https://tse3.mm.bing.net/th/id/OIP.0y_TByRb8p4mw8fMYtVETwHaES?r=0&rs=1&pid=ImgDetMain",
        bg: "https://www.havehalalwilltravel.com/cdn-cgi/image/width=3840,f=auto,quality=60/https://minio.havehalalwilltravel.com/hhwt-upload/images/15012023170801_1521623182.original.format-webp.webp",
        menu: {
            "Recommended": [
                { name: "Paneer Tikka Sub", price: 249, desc: "Spicy paneer tikka with veggies and signature sauces.", isVeg: true, img: "https://th.bing.com/th/id/OIP.B4TGAaHtbtN-qSwciUhphAHaE8?w=274&h=183&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
                { name: "Roasted Chicken Sub", price: 279, desc: "Premium roasted chicken slices loaded with fresh veggies.", isVeg: false, img: "https://th.bing.com/th/id/OIP.mbp22I-7A709mv8K4RaavQHaHa?w=200&h=200&c=7&r=0&o=5&dpr=1.3&pid=1.7" }
            ],
            "Bestsellers": [
                { name: "Tuna Sub", price: 299, desc: "A healthy tuna mix layered with fresh veggies.", isVeg: false, img: "https://recipes.net/wp-content/uploads/2023/05/jersey-mikes-tuna-sub-recipe_aae1239bccdab8af00f6389c8fc6fcb7.jpeg" },
                { name: "Steak & Cheese Sub", price: 376, desc: "Loaded with steak, cheese, and your favorite sauces.", isVeg: false, img: "https://th.bing.com/th/id/OIP.KTC4wWO-At2a_uBgl7X1LQHaEK?w=312&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" }
            ],
            "Veggie Specials": [
                { name: "Aloo Patty Sub", price: 219, desc: "A hearty aloo patty with your favorite sauces.", isVeg: true, img: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/8/27/3f80c960-df92-4762-bc79-f27772adf3a6_85557513-a3e2-460e-8072-f41e1d1534d1.png" },
                { name: "Veggie Delite Sub", price: 199, desc: "Loaded with capsicum, onion, tomato and lettuce.", isVeg: true, img: "https://assets3.thrillist.com/v1/image/2778173/size/gn-gift_guide_variable_c;jpeg_quality=20.jpg" },
                { name: "Veg Shammi Kebab Sub", price: 239, desc: "Spicy and wholesome veg kabab patty.", isVeg: true, img: "https://th.bing.com/th/id/OIP.4yJ51AvVio7-sdL07beaFwHaEK?w=333&h=187&c=7&r=0&o=5&dpr=1.3&pid=1.7" }
            ],
            "Sides": [
                { name: "Choco Chip Cookie", price: 69, desc: "Freshly baked gooey chocolate chip cookie.", isVeg: true, img: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=500&auto=format&fit=crop" }
            ]
        }
    },
    {
        idKey: 'starbucks',
        name: "Starbucks", tags: "Beverages • Coffee • Desserts", rating: "4.7", loc: "Cyber Hub, New Delhi",
        logo: "https://tse3.mm.bing.net/th/id/OIP.1YhNk4Jn_ZwIN3ZbCznuvgHaHa?r=0&w=1024&h=1024&rs=1&pid=ImgDetMain&o=7&rm=3",
        bg: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=2071&auto=format&fit=crop",
        menu: {
            "Hot Coffees": [
                { name: "Caffè Latte", price: 199, desc: "Espresso with steamed milk and a light layer of foam.", isVeg: true, img: "https://th.bing.com/th/id/OIP.Zbj1SemTGhMY8oSoxl55mAHaE8?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3" },
                { name: "Caramel Macchiato", price: 219, desc: "Espresso with vanilla syrup, steamed milk, and caramel.", isVeg: true, img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=500&auto=format&fit=crop" },
                { name: "Espresso Shot", price: 129, desc: "A strong and bold shot of espresso.", isVeg: true, img: "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=500&auto=format&fit=crop" }
            ],
            "Cold Coffees": [
                { name: "Mocha Frappuccino", price: 249, desc: "Blended coffee with chocolate and whipped cream.", isVeg: true, img: "https://th.bing.com/th/id/OIP.VBdfNsjjGfuZtkksE1b74gHaLH?w=204&h=306&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
                { name: "Vanilla Bean Frappuccino", price: 229, desc: "Blended vanilla with milk and whipped cream.", isVeg: true, img: "https://foodpluswords.com/wp-content/uploads/2025/07/starbucks-vanilla-bean-frappuccino-recipe-1026x1536.jpg" },
                { name: "Iced Coffee", price: 179, desc: "Chilled brewed coffee served over ice.", isVeg: true, img: "https://cdn.pixabay.com/photo/2024/06/26/06/58/ai-generated-8854172_1280.jpg" }
                ],
            "must try": [
                { name: "Java Chip Frappuccino", price: 290, desc: "Coffee with rich mocha sauce and chocolaty chips.", isVeg: true, img: "https://lisarecipe.com/wp-content/uploads/2025/07/9-Java-Chip-Frappuccino.png" },
                { name: "Caramel Macchiato", price: 270, desc: "Freshly steamed milk with vanilla-flavored syrup.", isVeg: true, img: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=500&auto=format&fit=crop" },
                { name: "Iced Americano", price: 220, desc: "Espresso shots topped with water to produce a light layer of crema.", isVeg: true, img: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=500&auto=format&fit=crop" }
            ],
            "Desserts": [
                { name: "Butter Croissant", price: 180, desc: "Classic flaky and buttery French pastry.", isVeg: true, img: "https://img.freepik.com/premium-photo/scrumptious-croissant-french-bakery-delight_1106454-19100.jpg" },
                { name: "New York Cheesecake", price: 320, desc: "Rich and creamy baked cheesecake on a graham crust.", isVeg: true, img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=500&auto=format&fit=crop" }
            ]
        }
    },
    {
        idKey: 'mcdonalds',
        name: "McDonald's", tags: "Burgers • Fast Food • American", rating: "4.4", loc: "Rajouri Garden, New Delhi",
        logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg",
        bg: "https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3",
        menu: {
            "Recommended": [
                { name: "Big Mac", price: 219, desc: "Two all-beef patties, special sauce, lettuce, cheese.", isVeg: false, img: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=500&auto=format&fit=crop" },
                { name: "Crispy Chicken Sandwich", price: 149, desc: "A crispy chicken patty with fresh lettuce and mayo.", isVeg: false, img: "https://th.bing.com/th/id/OSK.d9a1c9ddc43eeda896d9fe4ac2866004?w=424&h=424&c=7&rs=1&qlt=90&o=6&dpr=1.3&pid=16.1" }
            ],
            "Bestsellers": [
                { name: "Filet-O-Fish", price: 179, desc: "A crispy fish fillet with tartar sauce and cheese.", isVeg: false, img: "https://th.bing.com/th/id/OIP.S-R_xwfA0eACQ9vIAcklCQHaFg?w=200&h=200&c=10&o=6&dpr=1.3&pid=genserp&rm=2" },
                { name: "McSpicy Paneer", price: 169, desc: "A spicy paneer patty with lettuce and mayo.", isVeg: true, img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&auto=format&fit=crop" },
                { name: "Chicken McNuggets (6 Pc)", price: 219, desc: "Tender and breaded chicken nuggets served hot.", isVeg: false, img: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=500&auto=format&fit=crop" }
            ],
            "Sides & Beverages": [
                { name: "Fries (Large)", price: 119, desc: "A large portion of crispy golden fries.", isVeg: true, img: "https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=500&auto=format&fit=crop" },
                { name: "McFlurry with Oreo", price: 99, desc: "Creamy vanilla ice cream mixed with Oreo cookies.", isVeg: true, img: "https://madebykiara.com/wp-content/uploads/2025/07/Homemade_Chocolate_Ice_Cream_Recipe_4.webp" },
                { name: "Coca-Cola (500ml)", price: 89, desc: "A perfectly chilled large Coca-Cola for your meal.", isVeg: true, img: "https://m.media-amazon.com/images/I/71ry6WTpKdL._SL1500_.jpg" },
                { name: "Oreo McFlurry", price: 119, desc: "Vanilla soft serve mixed with crushed Oreo cookies.", isVeg: true, img: "https://th.bing.com/th/id/OIP.yWc_Rv4g3yFaw51Bunqi-gHaHa?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3" }
            ]
        }
    }
];

// 🟢 2. THE INJECTION ENGINE
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('🟢 Vault Open! Preparing to inject Mega-Database...');
        
        await Restaurant.deleteMany({});
        console.log('🧹 Vault swept clean.');

        await Restaurant.insertMany(restaurantDB);
        console.log('🔥 MISSION SUCCESS: All Custom Restaurants & Menus injected successfully!');

        mongoose.connection.close();
    })
    .catch(err => {
        console.error('🔴 Injection Failed:', err);
    });
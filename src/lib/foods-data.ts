import type { FoodItem, FoodCategory } from "@/types";

export const FOOD_DATABASE: FoodItem[] = [
  // =====================================================
  // GREEN - MEAT
  // =====================================================
  { id: "beef-steak", name: "Beef Steak", category: "meat", subcategory: "Beef", trafficLight: "green" },
  { id: "beef-mince", name: "Beef Mince", category: "meat", subcategory: "Beef", trafficLight: "green" },
  { id: "beef-roast", name: "Beef Roasting Joint", category: "meat", subcategory: "Beef", trafficLight: "green" },
  { id: "beef-burgers-homemade", name: "Homemade Beef Burgers", category: "meat", subcategory: "Beef", trafficLight: "green" },
  { id: "pork-chops", name: "Pork Chops", category: "meat", subcategory: "Pork", trafficLight: "green" },
  { id: "pork-belly", name: "Pork Belly", category: "meat", subcategory: "Pork", trafficLight: "green" },
  { id: "pork-loin", name: "Pork Loin", category: "meat", subcategory: "Pork", trafficLight: "green" },
  { id: "bacon", name: "Bacon", category: "meat", subcategory: "Pork", trafficLight: "green", servingNote: "Unprocessed preferred" },
  { id: "pork-sausages", name: "Pork Sausages (high meat %)", category: "meat", subcategory: "Pork", trafficLight: "green", servingNote: "Choose high meat content, low filler" },
  { id: "chicken-breast", name: "Chicken Breast", category: "meat", subcategory: "Chicken", trafficLight: "green" },
  { id: "chicken-thigh", name: "Chicken Thighs", category: "meat", subcategory: "Chicken", trafficLight: "green" },
  { id: "chicken-whole", name: "Whole Chicken", category: "meat", subcategory: "Chicken", trafficLight: "green" },
  { id: "chicken-wings", name: "Chicken Wings", category: "meat", subcategory: "Chicken", trafficLight: "green" },
  { id: "lamb-chops", name: "Lamb Chops", category: "meat", subcategory: "Lamb", trafficLight: "green" },
  { id: "lamb-leg", name: "Leg of Lamb", category: "meat", subcategory: "Lamb", trafficLight: "green" },
  { id: "lamb-shoulder", name: "Lamb Shoulder", category: "meat", subcategory: "Lamb", trafficLight: "green" },
  { id: "lamb-mince", name: "Lamb Mince", category: "meat", subcategory: "Lamb", trafficLight: "green" },
  { id: "turkey-breast", name: "Turkey Breast", category: "meat", subcategory: "Turkey", trafficLight: "green" },
  { id: "turkey-mince", name: "Turkey Mince", category: "meat", subcategory: "Turkey", trafficLight: "green" },
  { id: "duck-breast", name: "Duck Breast", category: "meat", subcategory: "Duck", trafficLight: "green" },
  { id: "venison", name: "Venison", category: "meat", subcategory: "Game", trafficLight: "green" },

  // =====================================================
  // GREEN - FISH & SEAFOOD
  // =====================================================
  { id: "salmon", name: "Salmon", category: "fish", subcategory: "Oily Fish", trafficLight: "green" },
  { id: "tuna-fresh", name: "Fresh Tuna", category: "fish", subcategory: "Oily Fish", trafficLight: "green" },
  { id: "mackerel", name: "Mackerel", category: "fish", subcategory: "Oily Fish", trafficLight: "green" },
  { id: "sardines", name: "Sardines", category: "fish", subcategory: "Oily Fish", trafficLight: "green" },
  { id: "trout", name: "Trout", category: "fish", subcategory: "Oily Fish", trafficLight: "green" },
  { id: "cod", name: "Cod", category: "fish", subcategory: "White Fish", trafficLight: "green" },
  { id: "haddock", name: "Haddock", category: "fish", subcategory: "White Fish", trafficLight: "green" },
  { id: "sea-bass", name: "Sea Bass", category: "fish", subcategory: "White Fish", trafficLight: "green" },
  { id: "plaice", name: "Plaice", category: "fish", subcategory: "White Fish", trafficLight: "green" },
  { id: "prawns", name: "Prawns", category: "fish", subcategory: "Shellfish", trafficLight: "green" },
  { id: "mussels", name: "Mussels", category: "fish", subcategory: "Shellfish", trafficLight: "green" },
  { id: "crab", name: "Crab", category: "fish", subcategory: "Shellfish", trafficLight: "green" },
  { id: "tuna-tinned", name: "Tinned Tuna (in olive oil)", category: "fish", subcategory: "Tinned Fish", trafficLight: "green" },
  { id: "sardines-tinned", name: "Tinned Sardines", category: "fish", subcategory: "Tinned Fish", trafficLight: "green" },

  // =====================================================
  // GREEN - EGGS
  // =====================================================
  { id: "eggs", name: "Eggs", category: "eggs", subcategory: "Eggs", trafficLight: "green", description: "Free range preferred" },

  // =====================================================
  // GREEN - DAIRY
  // =====================================================
  { id: "butter", name: "Butter", category: "dairy", subcategory: "Butter & Cream", trafficLight: "green" },
  { id: "double-cream", name: "Double Cream", category: "dairy", subcategory: "Butter & Cream", trafficLight: "green" },
  { id: "single-cream", name: "Single Cream", category: "dairy", subcategory: "Butter & Cream", trafficLight: "green" },
  { id: "cheddar", name: "Cheddar Cheese", category: "dairy", subcategory: "Hard Cheese", trafficLight: "green" },
  { id: "parmesan", name: "Parmesan", category: "dairy", subcategory: "Hard Cheese", trafficLight: "green" },
  { id: "brie", name: "Brie", category: "dairy", subcategory: "Soft Cheese", trafficLight: "green" },
  { id: "cream-cheese", name: "Cream Cheese", category: "dairy", subcategory: "Soft Cheese", trafficLight: "green" },
  { id: "mozzarella", name: "Mozzarella", category: "dairy", subcategory: "Soft Cheese", trafficLight: "green" },
  { id: "halloumi", name: "Halloumi", category: "dairy", subcategory: "Other Cheese", trafficLight: "green" },
  { id: "stilton", name: "Stilton", category: "dairy", subcategory: "Other Cheese", trafficLight: "green" },
  { id: "greek-yogurt", name: "Full-Fat Greek Yogurt", category: "dairy", subcategory: "Yogurt", trafficLight: "green" },
  { id: "natural-yogurt", name: "Full-Fat Natural Yogurt", category: "dairy", subcategory: "Yogurt", trafficLight: "green" },
  { id: "full-fat-milk", name: "Full-Fat Milk", category: "dairy", subcategory: "Milk", trafficLight: "green", servingNote: "Small amounts" },
  { id: "creme-fraiche", name: "Creme Fraiche", category: "dairy", subcategory: "Butter & Cream", trafficLight: "green" },

  // =====================================================
  // GREEN - VEGETABLES (Above Ground)
  // =====================================================
  { id: "broccoli", name: "Broccoli", category: "vegetables", subcategory: "Cruciferous", trafficLight: "green" },
  { id: "cauliflower", name: "Cauliflower", category: "vegetables", subcategory: "Cruciferous", trafficLight: "green" },
  { id: "cabbage", name: "Cabbage", category: "vegetables", subcategory: "Cruciferous", trafficLight: "green" },
  { id: "brussels-sprouts", name: "Brussels Sprouts", category: "vegetables", subcategory: "Cruciferous", trafficLight: "green" },
  { id: "spinach", name: "Spinach", category: "vegetables", subcategory: "Leafy Greens", trafficLight: "green" },
  { id: "kale", name: "Kale", category: "vegetables", subcategory: "Leafy Greens", trafficLight: "green" },
  { id: "lettuce", name: "Lettuce", category: "vegetables", subcategory: "Leafy Greens", trafficLight: "green" },
  { id: "rocket", name: "Rocket", category: "vegetables", subcategory: "Leafy Greens", trafficLight: "green" },
  { id: "watercress", name: "Watercress", category: "vegetables", subcategory: "Leafy Greens", trafficLight: "green" },
  { id: "courgette", name: "Courgette", category: "vegetables", subcategory: "Squash", trafficLight: "green" },
  { id: "peppers", name: "Bell Peppers", category: "vegetables", subcategory: "Peppers", trafficLight: "green" },
  { id: "mushrooms", name: "Mushrooms", category: "vegetables", subcategory: "Mushrooms", trafficLight: "green" },
  { id: "asparagus", name: "Asparagus", category: "vegetables", subcategory: "Stalks", trafficLight: "green" },
  { id: "celery", name: "Celery", category: "vegetables", subcategory: "Stalks", trafficLight: "green" },
  { id: "cucumber", name: "Cucumber", category: "vegetables", subcategory: "Salad", trafficLight: "green" },
  { id: "green-beans", name: "Green Beans", category: "vegetables", subcategory: "Beans", trafficLight: "green" },
  { id: "runner-beans", name: "Runner Beans", category: "vegetables", subcategory: "Beans", trafficLight: "green" },
  { id: "aubergine", name: "Aubergine", category: "vegetables", subcategory: "Other Veg", trafficLight: "green" },
  { id: "pak-choi", name: "Pak Choi", category: "vegetables", subcategory: "Leafy Greens", trafficLight: "green" },
  { id: "spring-onions", name: "Spring Onions", category: "vegetables", subcategory: "Alliums", trafficLight: "green" },
  { id: "leeks", name: "Leeks", category: "vegetables", subcategory: "Alliums", trafficLight: "green" },
  { id: "avocado", name: "Avocado", category: "vegetables", subcategory: "Other Veg", trafficLight: "green" },
  { id: "olives", name: "Olives", category: "vegetables", subcategory: "Other Veg", trafficLight: "green" },
  { id: "radishes", name: "Radishes", category: "vegetables", subcategory: "Root Veg", trafficLight: "green" },
  { id: "mange-tout", name: "Mange Tout", category: "vegetables", subcategory: "Beans", trafficLight: "green" },

  // =====================================================
  // GREEN - NUTS & SEEDS
  // =====================================================
  { id: "almonds", name: "Almonds", category: "nuts-seeds", subcategory: "Nuts", trafficLight: "green" },
  { id: "walnuts", name: "Walnuts", category: "nuts-seeds", subcategory: "Nuts", trafficLight: "green" },
  { id: "pecans", name: "Pecans", category: "nuts-seeds", subcategory: "Nuts", trafficLight: "green" },
  { id: "macadamia", name: "Macadamia Nuts", category: "nuts-seeds", subcategory: "Nuts", trafficLight: "green" },
  { id: "brazil-nuts", name: "Brazil Nuts", category: "nuts-seeds", subcategory: "Nuts", trafficLight: "green" },
  { id: "hazelnuts", name: "Hazelnuts", category: "nuts-seeds", subcategory: "Nuts", trafficLight: "green" },
  { id: "chia-seeds", name: "Chia Seeds", category: "nuts-seeds", subcategory: "Seeds", trafficLight: "green" },
  { id: "flax-seeds", name: "Flax Seeds", category: "nuts-seeds", subcategory: "Seeds", trafficLight: "green" },
  { id: "pumpkin-seeds", name: "Pumpkin Seeds", category: "nuts-seeds", subcategory: "Seeds", trafficLight: "green" },
  { id: "sunflower-seeds", name: "Sunflower Seeds", category: "nuts-seeds", subcategory: "Seeds", trafficLight: "green" },

  // =====================================================
  // GREEN - FATS & OILS
  // =====================================================
  { id: "olive-oil", name: "Extra Virgin Olive Oil", category: "fats-oils", subcategory: "Oils", trafficLight: "green" },
  { id: "coconut-oil", name: "Coconut Oil", category: "fats-oils", subcategory: "Oils", trafficLight: "green" },
  { id: "avocado-oil", name: "Avocado Oil", category: "fats-oils", subcategory: "Oils", trafficLight: "green" },
  { id: "ghee", name: "Ghee", category: "fats-oils", subcategory: "Animal Fats", trafficLight: "green" },
  { id: "lard", name: "Lard", category: "fats-oils", subcategory: "Animal Fats", trafficLight: "green" },

  // =====================================================
  // GREEN - CONDIMENTS
  // =====================================================
  { id: "salt", name: "Salt", category: "condiments", subcategory: "Seasonings", trafficLight: "green" },
  { id: "pepper", name: "Black Pepper", category: "condiments", subcategory: "Seasonings", trafficLight: "green" },
  { id: "herbs-fresh", name: "Fresh Herbs", category: "condiments", subcategory: "Herbs", trafficLight: "green" },
  { id: "herbs-dried", name: "Dried Herbs & Spices", category: "condiments", subcategory: "Herbs", trafficLight: "green" },
  { id: "mustard", name: "Mustard", category: "condiments", subcategory: "Sauces", trafficLight: "green" },
  { id: "vinegar", name: "Vinegar (Apple Cider/Wine)", category: "condiments", subcategory: "Sauces", trafficLight: "green" },
  { id: "stock-cubes", name: "Stock Cubes", category: "condiments", subcategory: "Cooking", trafficLight: "green" },

  // =====================================================
  // GREEN - DRINKS
  // =====================================================
  { id: "water", name: "Water", category: "drinks", subcategory: "Water", trafficLight: "green" },
  { id: "tea", name: "Tea (no sugar)", category: "drinks", subcategory: "Hot Drinks", trafficLight: "green" },
  { id: "coffee", name: "Coffee (no sugar)", category: "drinks", subcategory: "Hot Drinks", trafficLight: "green" },
  { id: "herbal-tea", name: "Herbal Tea", category: "drinks", subcategory: "Hot Drinks", trafficLight: "green" },

  // =====================================================
  // AMBER - FRUIT
  // =====================================================
  { id: "strawberries", name: "Strawberries", category: "fruit", subcategory: "Berries", trafficLight: "amber", servingNote: "Small portions" },
  { id: "blueberries", name: "Blueberries", category: "fruit", subcategory: "Berries", trafficLight: "amber", servingNote: "Small portions" },
  { id: "raspberries", name: "Raspberries", category: "fruit", subcategory: "Berries", trafficLight: "amber", servingNote: "Small portions" },
  { id: "blackberries", name: "Blackberries", category: "fruit", subcategory: "Berries", trafficLight: "amber", servingNote: "Small portions" },
  { id: "apples", name: "Apples", category: "fruit", subcategory: "Orchard Fruit", trafficLight: "amber", servingNote: "One small apple occasionally" },
  { id: "pears", name: "Pears", category: "fruit", subcategory: "Orchard Fruit", trafficLight: "amber", servingNote: "Occasionally" },
  { id: "plums", name: "Plums", category: "fruit", subcategory: "Stone Fruit", trafficLight: "amber" },
  { id: "peaches", name: "Peaches", category: "fruit", subcategory: "Stone Fruit", trafficLight: "amber" },
  { id: "cherries", name: "Cherries", category: "fruit", subcategory: "Stone Fruit", trafficLight: "amber", servingNote: "Small portions" },
  { id: "lemon", name: "Lemon", category: "fruit", subcategory: "Citrus", trafficLight: "amber" },
  { id: "lime", name: "Lime", category: "fruit", subcategory: "Citrus", trafficLight: "amber" },

  // =====================================================
  // AMBER - VEGETABLES (Root / Higher Carb)
  // =====================================================
  { id: "onions", name: "Onions", category: "vegetables", subcategory: "Alliums", trafficLight: "amber", servingNote: "Use in cooking" },
  { id: "garlic", name: "Garlic", category: "vegetables", subcategory: "Alliums", trafficLight: "amber" },
  { id: "tomatoes", name: "Tomatoes", category: "vegetables", subcategory: "Salad", trafficLight: "amber" },
  { id: "carrots", name: "Carrots", category: "vegetables", subcategory: "Root Veg", trafficLight: "amber", servingNote: "Small amounts" },
  { id: "beetroot", name: "Beetroot", category: "vegetables", subcategory: "Root Veg", trafficLight: "amber", servingNote: "Small amounts" },
  { id: "swede", name: "Swede", category: "vegetables", subcategory: "Root Veg", trafficLight: "amber" },
  { id: "parsnips", name: "Parsnips", category: "vegetables", subcategory: "Root Veg", trafficLight: "amber" },
  { id: "butternut-squash", name: "Butternut Squash", category: "vegetables", subcategory: "Squash", trafficLight: "amber", servingNote: "Small portions" },
  { id: "sweetcorn", name: "Sweetcorn", category: "vegetables", subcategory: "Other Veg", trafficLight: "amber" },

  // =====================================================
  // AMBER - LEGUMES
  // =====================================================
  { id: "peas", name: "Peas", category: "legumes", subcategory: "Peas", trafficLight: "amber" },
  { id: "lentils", name: "Lentils", category: "legumes", subcategory: "Lentils", trafficLight: "amber" },
  { id: "chickpeas", name: "Chickpeas", category: "legumes", subcategory: "Beans", trafficLight: "amber" },
  { id: "kidney-beans", name: "Kidney Beans", category: "legumes", subcategory: "Beans", trafficLight: "amber" },
  { id: "butter-beans", name: "Butter Beans", category: "legumes", subcategory: "Beans", trafficLight: "amber" },
  { id: "edamame", name: "Edamame Beans", category: "legumes", subcategory: "Beans", trafficLight: "amber" },

  // =====================================================
  // AMBER - OTHER
  // =====================================================
  { id: "dark-chocolate-85", name: "Dark Chocolate (85%+)", category: "sweets-snacks", subcategory: "Chocolate", trafficLight: "amber", servingNote: "A few squares" },
  { id: "peanut-butter-natural", name: "Natural Peanut Butter (no sugar)", category: "nuts-seeds", subcategory: "Nut Butters", trafficLight: "amber" },
  { id: "coconut-cream", name: "Coconut Cream", category: "dairy", subcategory: "Alternatives", trafficLight: "amber" },
  { id: "tinned-tomatoes", name: "Tinned Tomatoes", category: "condiments", subcategory: "Cooking", trafficLight: "amber" },
  { id: "tomato-puree", name: "Tomato Puree", category: "condiments", subcategory: "Cooking", trafficLight: "amber" },
  { id: "soy-sauce", name: "Soy Sauce", category: "condiments", subcategory: "Sauces", trafficLight: "amber" },
  { id: "red-wine", name: "Red Wine", category: "drinks", subcategory: "Alcohol", trafficLight: "amber", servingNote: "Occasional glass" },
  { id: "white-wine", name: "White Wine", category: "drinks", subcategory: "Alcohol", trafficLight: "amber", servingNote: "Occasional glass" },
  { id: "spirits", name: "Spirits (gin, vodka, whisky)", category: "drinks", subcategory: "Alcohol", trafficLight: "amber", servingNote: "With sugar-free mixer" },

  // =====================================================
  // RED - GRAINS & STARCH
  // =====================================================
  { id: "white-bread", name: "White Bread", category: "grains-starch", subcategory: "Bread", trafficLight: "red" },
  { id: "wholemeal-bread", name: "Wholemeal Bread", category: "grains-starch", subcategory: "Bread", trafficLight: "red" },
  { id: "wraps-tortillas", name: "Wraps & Tortillas", category: "grains-starch", subcategory: "Bread", trafficLight: "red" },
  { id: "pasta", name: "Pasta", category: "grains-starch", subcategory: "Pasta", trafficLight: "red" },
  { id: "white-rice", name: "White Rice", category: "grains-starch", subcategory: "Rice", trafficLight: "red" },
  { id: "brown-rice", name: "Brown Rice", category: "grains-starch", subcategory: "Rice", trafficLight: "red" },
  { id: "potatoes", name: "Potatoes", category: "grains-starch", subcategory: "Potatoes", trafficLight: "red" },
  { id: "sweet-potatoes", name: "Sweet Potatoes", category: "grains-starch", subcategory: "Potatoes", trafficLight: "red" },
  { id: "chips-fries", name: "Chips / French Fries", category: "grains-starch", subcategory: "Potatoes", trafficLight: "red" },
  { id: "cereals", name: "Breakfast Cereals", category: "grains-starch", subcategory: "Cereals", trafficLight: "red" },
  { id: "oats-porridge", name: "Oats / Porridge", category: "grains-starch", subcategory: "Cereals", trafficLight: "red" },
  { id: "couscous", name: "Couscous", category: "grains-starch", subcategory: "Grains", trafficLight: "red" },
  { id: "noodles", name: "Noodles", category: "grains-starch", subcategory: "Pasta", trafficLight: "red" },
  { id: "flour", name: "Flour (white/wholemeal)", category: "grains-starch", subcategory: "Baking", trafficLight: "red" },

  // =====================================================
  // RED - SWEETS & SNACKS
  // =====================================================
  { id: "sugar", name: "Sugar", category: "sweets-snacks", subcategory: "Sugar", trafficLight: "red" },
  { id: "honey", name: "Honey", category: "sweets-snacks", subcategory: "Sugar", trafficLight: "red" },
  { id: "chocolate-bars", name: "Chocolate Bars", category: "sweets-snacks", subcategory: "Chocolate", trafficLight: "red" },
  { id: "biscuits", name: "Biscuits", category: "sweets-snacks", subcategory: "Baked Goods", trafficLight: "red" },
  { id: "cakes", name: "Cakes", category: "sweets-snacks", subcategory: "Baked Goods", trafficLight: "red" },
  { id: "sweets-candy", name: "Sweets & Candy", category: "sweets-snacks", subcategory: "Confectionery", trafficLight: "red" },
  { id: "crisps", name: "Crisps", category: "sweets-snacks", subcategory: "Snacks", trafficLight: "red" },
  { id: "ice-cream", name: "Ice Cream", category: "sweets-snacks", subcategory: "Frozen", trafficLight: "red" },
  { id: "jam", name: "Jam & Marmalade", category: "sweets-snacks", subcategory: "Spreads", trafficLight: "red" },

  // =====================================================
  // RED - DRINKS
  // =====================================================
  { id: "fizzy-drinks", name: "Fizzy Drinks (Coke, Pepsi etc.)", category: "drinks", subcategory: "Soft Drinks", trafficLight: "red" },
  { id: "fruit-juice", name: "Fruit Juice", category: "drinks", subcategory: "Soft Drinks", trafficLight: "red" },
  { id: "energy-drinks", name: "Energy Drinks", category: "drinks", subcategory: "Soft Drinks", trafficLight: "red" },
  { id: "beer", name: "Beer & Lager", category: "drinks", subcategory: "Alcohol", trafficLight: "red" },
  { id: "cider", name: "Cider", category: "drinks", subcategory: "Alcohol", trafficLight: "red" },

  // =====================================================
  // RED - FATS & OILS (Bad)
  // =====================================================
  { id: "margarine", name: "Margarine", category: "fats-oils", subcategory: "Spreads", trafficLight: "red" },
  { id: "rapeseed-oil", name: "Rapeseed Oil", category: "fats-oils", subcategory: "Seed Oils", trafficLight: "red" },
  { id: "sunflower-oil", name: "Sunflower Oil", category: "fats-oils", subcategory: "Seed Oils", trafficLight: "red" },
  { id: "soya-oil", name: "Soya Oil", category: "fats-oils", subcategory: "Seed Oils", trafficLight: "red" },
  { id: "vegetable-oil", name: "Vegetable Oil (blended)", category: "fats-oils", subcategory: "Seed Oils", trafficLight: "red" },

  // =====================================================
  // RED - FRUIT (High Sugar)
  // =====================================================
  { id: "bananas", name: "Bananas", category: "fruit", subcategory: "Tropical", trafficLight: "red" },
  { id: "grapes", name: "Grapes", category: "fruit", subcategory: "Tropical", trafficLight: "red" },
  { id: "mango", name: "Mango", category: "fruit", subcategory: "Tropical", trafficLight: "red" },
  { id: "pineapple", name: "Pineapple", category: "fruit", subcategory: "Tropical", trafficLight: "red" },
  { id: "dried-fruit", name: "Dried Fruit", category: "fruit", subcategory: "Dried", trafficLight: "red" },

  // =====================================================
  // RED - PROCESSED
  // =====================================================
  { id: "ready-meals", name: "Ready Meals", category: "processed", subcategory: "Convenience", trafficLight: "red" },
  { id: "pizza", name: "Pizza", category: "processed", subcategory: "Fast Food", trafficLight: "red" },
  { id: "chicken-nuggets", name: "Chicken Nuggets", category: "processed", subcategory: "Fast Food", trafficLight: "red" },
  { id: "fish-fingers", name: "Fish Fingers", category: "processed", subcategory: "Fast Food", trafficLight: "red" },
  { id: "ketchup", name: "Ketchup", category: "condiments", subcategory: "Sauces", trafficLight: "red", servingNote: "High sugar content" },
  { id: "bbq-sauce", name: "BBQ Sauce", category: "condiments", subcategory: "Sauces", trafficLight: "red", servingNote: "High sugar content" },
];

// Derived lookup structures
export const FOOD_BY_ID = new Map<string, FoodItem>(
  FOOD_DATABASE.map((food) => [food.id, food])
);

export const CATEGORIES = Array.from(
  new Set(FOOD_DATABASE.map((f) => f.category))
).sort() as FoodCategory[];

export const SUBCATEGORIES_BY_CATEGORY: Record<string, string[]> = {};
for (const food of FOOD_DATABASE) {
  if (!SUBCATEGORIES_BY_CATEGORY[food.category]) {
    SUBCATEGORIES_BY_CATEGORY[food.category] = [];
  }
  if (!SUBCATEGORIES_BY_CATEGORY[food.category].includes(food.subcategory)) {
    SUBCATEGORIES_BY_CATEGORY[food.category].push(food.subcategory);
  }
}

export function getFoodsByTrafficLight(tl: string): FoodItem[] {
  return FOOD_DATABASE.filter((f) => f.trafficLight === tl);
}

export function getFoodsByCategory(category: FoodCategory): FoodItem[] {
  return FOOD_DATABASE.filter((f) => f.category === category);
}

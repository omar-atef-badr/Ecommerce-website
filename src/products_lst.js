import { randomUUID } from "node:crypto";

import fs from 'node:fs';
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WriteStream } from "node:fs";
/*
//defining products
const product0 = {
    id: randomUUID(),
    title: "Cool Knit Rose",
    image_url: "https://www.peggsandson.com/cdn/shop/files/9B9A1314_2e22b1dc-3b7a-4150-baf3-9ca8391e649c.jpg?v=1732632698&width=2048",
    price: 59.99,
    rating: 5,
    description: "Wrap yourself in effortless style and comfort with the Cool Knit Sweater in a soft, blush pink hue. This lightweight yet cozy sweater features a modern knit design with a relaxed fit, perfect for layering or wearing on its own. Its breathable fabric provides warmth without the bulk, making it ideal for cooler days or breezy evenings.",
    size_options: ["XL","L","M","S","XS"],
    stock_count: 120,
}

const product1 = {
    id: randomUUID(),
    title: "The Neighbourhood Jumper",
    image_url: "https://i.ebayimg.com/images/g/8sYAAOSwtbxhE~Z0/s-l1200.jpg",
    price: 24.99,
    rating: 4,
    description: "Celebrate the iconic vibes of Sweater Weather with this officially inspired sweater from The Neighbourhood. Designed in a moody monochrome palette, this cozy knit captures the band's signature aesthetic—cool, understated, and effortlessly edgy.",
    size_options: ["XL","L","M","S","XS"],
    stock_count: 100,
}

const product2 = {
    id: randomUUID(),
    title: "Nike Passion Red T-Shirt",
    image_url: "https://down-ph.img.susercontent.com/file/16dfa75d61d76da09dea4d2b1ca98ede",
    price: 19.99,
    rating: 3,
    description: "Simplicity meets bold style with the Nike Passion Red T-Shirt. This crisp white tee is crafted from soft, breathable fabric for all-day comfort, making it perfect for both workouts and casual outings. At the center, the iconic Nike logo stands out in a striking passion red, creating a timeless and eye-catching design.",
    size_options: ["L","M","S"],
    stock_count: 70,
}

const product3 = {
    id: randomUUID(),
    title: "Nike Dri-Fit Orange/Blue Shirt",
    image_url: "https://i.ebayimg.com/images/g/uSgAAOSwpjNk2G8R/s-l1200.jpg",
    price: 19.99,
    rating: 3,
    description: "Stay cool, dry, and stylish with the Nike Dri-FIT Orange/Blue Shirt. Designed for performance and comfort, this shirt features Nike's signature Dri-FIT technology to wick away sweat and keep you feeling fresh during your most intense workouts.",
    size_options: ["M","S","XS"],
    stock_count: 10,
}

const product4 = {
    id: randomUUID(),
    title: "Gymshark Gym Tank Top",
    image_url: "https://i.ebayimg.com/images/g/sZsAAOSwknBkFi4A/s-l400.jpg",
    price: 14.99,
    rating: 5,
    description: "Elevate your training sessions with the Gymshark Gym Tank Top—a perfect fusion of style and functionality. Designed with lightweight, sweat-wicking fabric, this tank keeps you cool and dry as you push through every rep and set.",
    size_options: ["L","M","S"],
    stock_count: 250,
}

const product5 = {
    id: randomUUID(),
    title: "Puma Women's T-Shirt",
    image_url: "https://cdn.shopify.com/s/files/1/1754/6207/files/a7092c12-c60d-4f45-aee1-159087c1e3c2_1200x.jpg.webp?v=1720800656",
    price: 24.99,
    rating: 3,
    description: "Freshen up your wardrobe with the Puma Women's Green T-Shirt, a perfect blend of sporty style and everyday comfort. Crafted from soft, breathable fabric, this tee is designed to keep you cool and comfortable whether you're working out or relaxing.",
    size_options: ["L","M","S"],
    stock_count: 58,
}

const product6 = {
    id: randomUUID(),
    title: "coloured shirt",
    image_url: "https://image....",
    price: 39.99,
    rating: 2,
    description: "blablabla",
    size_options: ["L","M","S"],
    stock_count: 250,
}

const product7 = {
    id: randomUUID(),
    title: "coloured shirt",
    image_url: "https://image....",
    price: 39.99,
    rating: 2,
    description: "blablabla",
    size_options: ["L","M","S"],
    stock_count: 100,
}

const product8 = {
    id: randomUUID(),
    title: "coloured shirt",
    image_url: "https://image....",
    price: 39.99,
    rating: 5,
    description: "blablabla",
    size_options: ["L","M","S"],
    stock_count: 100,
}

const product9 = {
    id: randomUUID(),
    title: "coloured shirt",
    image_url: "https://image....",
    price: 39.99,
    rating: 5,
    description: "blablabla",
    size_options: ["L","M","S"],
    stock_count: 100,
}
*/

export async function loadProducts(filePath) {
  const productsList = await readFromCacheOrDefault(filePath); 
  //console.log(productsList)
  const productsMap = new Map(productsList.map((product) => ([product.id, product])));
  //console.log("this worked!")
  return productsMap;
}



export async function saveProducts(filePath, productsMap) {
    const productsList = Array.from(productsMap.values());
    const jsonData = JSON.stringify(productsList, null, 2);
    try {
      writeToCache(filePath,jsonData);
    } catch (err) {
        if (err) {
          alert(err);
          //console.log("Error saving products to file:", err);
    }
    };
    //console.log("File written successfully");
  }
//await saveProducts("products_info2.json");
//const productsMap = await loadProducts("products_info.json");

/*
const products_entries_list = []

for (const index of products_list) {
    products_entries_list.push([index.id, index])
}
const products_map = new Map(products_list.map((product) => ([product.id, product])))
//console.log(products_map)
fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading the file:", err);
    } else {
        console.log("File content:");
        console.log(data);
    }
});
*/


// function to write to cache folder
export async function writeToCache(fileName, data) {
  try {
      // Path to the cache folder
      const cacheFolderPath = path.join(import.meta.dirname, "../cache");
      //console.log("Cache folder path:", cacheFolderPath);

      // Ensure the cache folder exists
      if (!fs.existsSync(cacheFolderPath)) {
          await fs.promises.mkdir(cacheFolderPath, { recursive: true });
          //console.log("Cache folder created.");
      }

      // Path to the file
      const filePath = path.join(cacheFolderPath, fileName);

      const dataToWrite = typeof data === "string" ? data : JSON.stringify(data, null, 2);

      await fs.promises.writeFile(filePath, dataToWrite, "utf8");
      //console.log(`Data successfully written to ${filePath}`);
  } catch (err) {
      console.error("Error writing to cache:", err);
  }
}
//writeToCache('products_info.json',[]);


//function to read from cache/default folder
export async function readFromCacheOrDefault(fileName) {
    const cachePath = path.join(import.meta.dirname, '../cache', fileName);
    const defaultPath = path.join(import.meta.dirname, '../default', fileName);
  
    //console.log('Cache Path:', cachePath); 
    //console.log('Default Path:', defaultPath);
  
    try {
      try {
        // Check if the cache file exists and then read it
        await fs.promises.access(cachePath);
        //console.log('File found in cache folder!'); 
        const cacheData = await fs.promises.readFile(cachePath, 'utf8');
        return JSON.parse(cacheData);
      } catch (err) {
        if (err.code !== "ENOENT") {
          throw err;
        }
      }
  
        // Cache file doesn't exist, try default folder
        try {
          await fs.promises.access(defaultPath);
          //console.log('File found in default folder!');
          const defaultData = await fs.promises.readFile(defaultPath, 'utf8');
          return JSON.parse(defaultData); 
        } catch (err) {
          if (err.code !== "ENOENT") {
            throw err;
          }
      }
    } catch (err) {
      if (err.code !== "ENOENT") {
        throw err;
      }
  }
}


/*
function decodeJsonToMap(jsonString) {
    try {
        
        const parsedData = JSON.parse(jsonString);

        const dataMap = new Map(parsedData.map((item) => [item.id, item]));

        console.log("Successfully converted JSON to Map!");
        return dataMap;
    } catch (err) {
        console.error("Error decoding JSON and converting to Map:", err.message);
    }
}
const thisMap = decodeJsonToMap(wow_its_json);
//console.log(thisMap);
*/
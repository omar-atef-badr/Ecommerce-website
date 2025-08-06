import { randomUUID } from "node:crypto";

import fs from 'node:fs';
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WriteStream } from "node:fs";

import { readFromCacheOrDefault } from "./products_lst.js"
import { writeToCache } from "./products_lst.js"
/*
//defining sellers
const seller0 = {
    id: randomUUID(),
    name: 'Nike',
}
const seller1 = {
  id: randomUUID(),
  name: 'Addidas',
}
const seller2 = {
  id: randomUUID(),
  name: 'Puma',
}
const seller3 = {
  id: randomUUID(),
  name: 'Gymshark',
}
*/

export async function loadSellers(filePath) {
  const SellersList = await readFromCacheOrDefault(filePath); 
  const SellersMap = new Map(SellersList.map((seller) => ([seller.id, seller])));
  //console.log("this worked!")
  return SellersMap;
}


export async function saveSellers(filePath) {
    const SellersMap = await loadSellers("sellers_info.json");
    const SellersList = Array.from(SellersMap.values());
    const jsonData = JSON.stringify(SellersList, null, 2);
    try {
      writeToCache(filePath,jsonData);
    } catch (err) {
        if (err) {
          console.log("Error saving sellers to file:", err);
    }
    };
    //console.log("File written successfully");
  }
//await saveSellers("seller_info2.json");
/*
const sellers_list = [seller0,seller1,seller2,seller3]

const wow_its_json = JSON.stringify(sellers_list, null, 2);
writeToCache("seller_info.json",wow_its_json)
*/
/*
const sellers_entries_list = []

for (const index of sellers_list) {
    sellers_entries_list.push([index.id, index])
}
const sellers_map = new Map(sellers_list.map((seller) => ([seller.id, seller])));
*/

/*
const products_list = [product0, product1, product2, product3, product4, product5]

const products_entries_list = []

for (const index of products_list) {
    products_entries_list.push([index.id, index])
}
const products_map = new Map(products_list.map((product) => ([product.id, product])))
console.log(products_map)

const wow_its_json = JSON.stringify(products_list,null,2)
console.log(wow_its_json)


fs.writeFile("products_info.json", wow_its_json, (err) => {
    if (err) {
        console.error("Error writing to the file:", err);
    } else {
        console.log("File written successfully!");
    }
});
*/
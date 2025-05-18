// worker.js
import { Worker } from 'worker_threads';
import { parentPort, workerData } from 'worker_threads';
//const { parentPort, workerData } = require('worker_threads');
import fs from 'fs';
import { dirname, join } from 'path';
import { JSDOM } from 'jsdom';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from "dotenv";
import ProductModel from "./models/productModel.js";
import UserModel from "./models/userModel.js";
//const User = require('../models/UserModel'); // this should point to your user model
import connectDB from "./config/dbworker.js";
import axios from 'axios';
//import fetch from 'node-fetch';
import { tidy } from 'htmltidy2';
import pLimit from 'p-limit';
//const pLimit = require('p-limit');
//var promiseLimit = require('promise-limit')

//const pLimit = require('p-limit');
//var promiseLimit = require('promise-limit')
let globalAdminUser = undefined;

function isEmptyObject(obj) {
  return obj && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).length === 0;
}
function serializeElement(el) {
  return {
    tag: el.tagName.toLowerCase(),
    text: el.textContent.trim(),
   // attributes: getAttributes(el),
    html: el.outerHTML
  };
}

async function waitForDBUser( timeout = 5000) {
  return new Promise(async (resolve, reject) => {
    const interval = 4900;
    let elapsed = 0;

    const email = 'vvanvekar@gmail.com';
    const present = await UserModel.find({email: email   }); //isAdmin: true await UserModel.findOne({ email });  const admin = await 
    if (present) {
     // clearInterval(timer);
      globalAdminUser = present;
      console.log(" globalAdminUser connected id ",globalAdminUser.id);
      resolve("Connected with Admin user DB");
     
    } else /*if ((elapsed += interval) >= timeout) */{
     //  clearInterval(timer);
      reject(new Error('Timeout: Admin User DB Connection Failed '));
    }

    /*const timer = setInterval(async () => {
      const email = 'vvanvekar@gmail.com';
      const present = await UserModel.findOne({ isAdmin: true }); //await UserModel.findOne({ email });  const admin = await 
      if (present) {
        clearInterval(timer);
        globalAdminUser = present;
        console.log(" globalAdminUser connected id ",globalAdminUser.id);
        resolve("Connected with Admin user DB");
       
      } else if ((elapsed += interval) >= timeout) {
        clearInterval(timer);
        reject(new Error('Timeout: Admin User DB Connection Failed '));
      }
    }, interval);*/
  });
}


async function waitForElements(document , selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const interval = 100;
    let elapsed = 0;

    const timer = setInterval(() => {
      const elements = document.querySelectorAll(selector);
      if (elements.length) {
        clearInterval(timer);
        resolve(Array.from(elements));
      } else if ((elapsed += interval) >= timeout) {
        clearInterval(timer);
        reject(new Error('Timeout: Elements not found'));
      }
    }, interval);
  });
}
function waitForElementsMutation(document , selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const found = document.querySelectorAll(selector);
    if (found.length) return resolve(Array.from(found));

    const observer = new MutationObserver(() => {
      const elements = document.querySelectorAll(selector);
      if (elements.length) {
        observer.disconnect();
        resolve(Array.from(elements));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Timeout: No elements found for selector "${selector}"`));
    }, timeout);
  });
}
function waitForElementsFullyReady(document ,selector, {
  timeout = 50000,
  check = el => el.textContent.trim().length > 0 // custom check per element
} = {}) {
  return new Promise((resolve, reject) => {
    let timer;
    const start = Date.now();

    const tryResolve = () => {
      const elements = Array.from(document.querySelectorAll(selector));
      const allReady = elements.length && elements.every(check);

      if (allReady) {
        clearInterval(interval);
        clearTimeout(timer);
        resolve(elements);
      } else if (Date.now() - start > timeout) {
        clearInterval(interval);
        reject(new Error(`Timeout: elements not fully ready for "${selector}"`));
      }
    };

    const interval = setInterval(tryResolve, 4500);
    timer = setTimeout(() => {
      clearInterval(interval);
      reject(new Error(`Timeout: elements never ready for "${selector}"`));
    }, timeout);
  });
}
async function waitForExactProdElements(document , selector, expectedCount = 1, timeout = 5000) {
  return new Promise((resolve, reject) => {
    let start = Date.now();

    const logElements = async  () => {
      const found = await document.querySelectorAll(selector);
      console.log(`[${Date.now() - start}ms] Found ${found.length} elements for ${selector}`);
      let tkp = JSON.stringify(found);
    //  console.log(` found  ${tkp} `);
      let innerElem = [] ;
      const minLength = Math.min(found.length,13);

      
       for (let i = 0; i < minLength; i++) { 
          let kto = found[i] ;
          let th = serializeElement(kto);
         // console.log(" found inner elem" ,th  );
          innerElem.push(th);
      }
      //const serialized =found.map(serializeElement);
      //console.log(JSON.stringify(serialized, null, 2));
      const merged =innerElem ;  // Array.from(found);
       let prodText = {  } ; 
       let prodA = []
      //for (let i = 0; i < minLength; i++) { 
        await Promise.all( merged.map(async (item) => {
            // html: el.outerHTML
             const htmlPlain =  await   item.html; // item.querySelector('img').title;
             let domProductInner = new JSDOM(htmlPlain);
             let document = domProductInner.window.document;
             let title = await document.querySelector('img').title;
             let imgsrc  = await document.querySelector('img').src;
             let a = await document.querySelector('a').href
               prodText = {title , imgsrc , a } ; // `${title } ${imgsrc} ` 
 
             let mergedText = Object.assign({}, prodText );     
          //  const imgsrc  =  await  // item.querySelector('img').src;
          //const a =     //  item.querySelector('a').href;
            // prodText = {title  } ; 
            prodA.push(prodText);
        }));
        //await waitForExactElements(document ,'div._flx._bwrp',4);

    //  }
   // console.log(" product  ",JSON.stringify(prodA));
      return prodA ;
    };

    const check = async () => {
      const elements = await logElements();
      if (elements.length >= expectedCount) {
        clearInterval(interval);
        clearTimeout(failTimer);
        resolve(elements);
      }
    };

    const interval = setInterval(check, 4500);

    const failTimer = setTimeout(() => {
      clearInterval(interval);
      reject(new Error(`❌ Timeout: Only ${document.querySelectorAll(selector).length} elements found for selector "${selector}"`));
    }, timeout);
  });
}

async function waitForExactPriceElements(document , selector, expectedCount = 1, timeout = 5000) {
  return new Promise((resolve, reject) => {
    let start = Date.now();

    const logElements = async  () => {
      const found = await document.querySelectorAll(selector);
      console.log(`[${Date.now() - start}ms] Found ${found.length} elements for ${selector}`);
      let tkp = JSON.stringify(found);
    //  console.log(` found  ${tkp} `);
      let innerElem = [] ;
      const minLength = Math.min(found.length,13);

      
       for (let i = 0; i < minLength; i++) { 
          let kto = found[i] ;
          let th = serializeElement(kto);
         // console.log(" found inner elem" ,th  );
          innerElem.push(th);
      }
      //const serialized =found.map(serializeElement);
      //console.log(JSON.stringify(serialized, null, 2));
      const merged =innerElem ;  // Array.from(found);
       let prodText = {  } ; 
       let prodA = []
      //for (let i = 0; i < minLength; i++) { 
        await Promise.all( merged.map(async (item) => {
            // html: el.outerHTML
             const htmlPlain =  await   item.html; // item.querySelector('img').title;
             let domPriceInner = new JSDOM(htmlPlain);
             let document = domPriceInner.window.document;
            
             ///const prodText = {title , imgsrc , a } ; // `${title } ${imgsrc} ` 

            // const span = container.querySelector('span'); // outer span

             const span  = await document.querySelector('span');
             const rupee = span.textContent.replace(/Rs\./, '').trim();
             
             const priceText =  {rupee }; 
             let mergedText = Object.assign({},  priceText);     
          //  const imgsrc  =  await  // item.querySelector('img').src;
          //const a =     //  item.querySelector('a').href;
           // prodText = {title  } ; 
            prodA.push(priceText);
        }));
        //await waitForExactElements(document ,'div._flx._bwrp',4);

    //  }
     //  console.log(" price  ",JSON.stringify(prodA));
      return prodA;
    };

    const check = async() => {
      const elements = await logElements();
      if (elements.length >= expectedCount) {
        clearInterval(interval);
        clearTimeout(failTimer);
        resolve(elements);
      }
    };

    const interval = setInterval(check, 2);

    const failTimer = setTimeout(() => {
      clearInterval(interval);
      reject(new Error(`❌ Timeout: Only ${document.querySelectorAll(selector).length} elements found for selector "${selector}"`));
    }, timeout);
  });
}
(async () => {
  try {

  
   /// const email = 'vvanvekar@gmail.com';
   // const present = await UserModel.findOne({ email });
  
    const { brand, page , user} = workerData;
    if (!user) {
      console.log(" Admin User not found");
     
      
    }
    const query = `${brand}&pageNumber=${page}`;
    const url = `https://gadgets360.com/search?searchtext=${query}`;
    let results = [];
    let prodResults = [];
    /*if (!fs.existsSync('./data')) {
      fs.mkdirSync('./data');
    }*/
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      // Step 3: Move 2 directories up
       const twoLevelsUp = path.resolve(__dirname, '..');  
       const dir = path.join(twoLevelsUp, 'client', 'public/data'); 

      const fileName = `${brand}Page${page}.json`;
      const fileDetailName = `${brand}PageDetail${page}.json`;
     /*const filePath =  path.resolve(dir,fileName );//path.join(__dirname, 'data', fileName);
      if (!fs.existsSync(filePath)) {
        
          fs.writeFileSync(filePath, ''); // or '{}' for empty JSON
          console.log(`🆕 Created: ${filePath}`);
        
        //fs.writeFileSync(filePath, JSON.stringify(data, null, 2)); // or '{}' for empty JSON
     
      }*/
      // Ensure the directory exists
     //  const dir = path.dirname(filePath);
     
     await axios.get(url).then(async response => {
        if (!response.statusText && response.status !=200) {
          throw new Error(`HTTP error! status: ${response.status}  ${response.statusText}
            response.ok ${response.ok}`);
        }
    
       let fetHTML =   (async () => {
          const t = await   response.data; //response.text();
           let text =t;
           let dom = new JSDOM(text);
           let document = dom.window.document;

           let  items = []; //Array.from(document.querySelectorAll('div.rvw-imgbox'));
           let pricebuy = [];
           const imgLoadedCheck = el => {
            const img = el.querySelector('img');
            return img ? img.complete : true;
           }; 
           const hrefLoadedCheck = el => {
            const img = el.querySelector('a');
            return img ? img.complete : true;
          };
           const priceLoadedCheck = el => {
            const img = el.querySelector('rupee');
            return img ? img.complete : true;
          };
           // Log to verify the list is not empty
            try {
                items = await waitForExactProdElements(document , 'div.rvw-imgbox',3); //{ check: imgLoadedCheck });

                pricebuy =   await waitForExactPriceElements(document ,'div._flx._bwrp',1) ; // { check: priceLoadedCheck });
                //pricebuy =   await waitForElementsMutation(document ,'div._flx._bwrp');
                //Array.from(document.querySelectorAll('div._flx._bwrp'));
              console.log(`✅ Found product  ${items.length} items`);
              console.log(`Found pricebuy  ${items.length} items`);
             // console.log(" product  -->  ",JSON.stringify(items));
              //console.log(" price  -->  ",JSON.stringify(pricebuy));
                // GET BOTHE the arrays  and form a merged product array with price 
                const minLength = Math.min(items.length, pricebuy.length);
               const merged = [];
            for (let i = 0; i < minLength; i++) { 
                     let prd = items[i];
                     let price = pricebuy[i];
                     let rp = price.rupee!==undefined ? price.rupee  : '';
                   // console.log(" price  -->  ",JSON.stringify(price));
                    let  totalProd  = Object.assign({}, prd, { price : rp});
                    console.log(` ${JSON.stringify(totalProd.title) } `,JSON.stringify(totalProd.price));
                    merged.push(totalProd);
            }
            await Promise.all( merged.map(async (item) => {
              await extractDetailResults(item)
              .then(data => { //console.log(data); 
              // const fileName = `${brand}Page${page}.json`;
               //const filePath =  path.resolve(dir,fileName ); //path.join(__dirname, 'data', fileName);
               //const fileDetailName = `${brand}PageDetail${page}.json`;
               //  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));  
              

                //const fileName = `${brand}Page${page}.json`;

              //  parentPort.postMessage(data);
                 prodResults.push(data);
               //const filePath =  path.resolve(dir,fileName ); //path.join(__dirname, 'data', fileName);
               //const fileDetailName = `${brand}PageDetail${page}.json`;
               //  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));  
                 return data;
                 }).catch(error => {
                   console.error('Product details fetch  error:', error);
                   return { error: true, error_message: error.message };
                 });
       
            })
 
            );
           /*   const minLength = Math.min(items.length, pricebuy.length);
            const merged = [];
            for (let i = 0; i < minLength; i++) {   // .textContent 
              
              let mergedText = {};
              console.log(" items[i] ",JSON.stringify(items[i]));
              console.log(" pricebuy[i] ",JSON.stringify(pricebuy[i]));
              try {  
                let domProductInner = new JSDOM(items[i]);
              const title = await domProductInner.querySelector('img').title;
              const imgsrc  = await domProductInner.querySelector('img').src;
              const a = await domProductInner.querySelector('a').href
              const prodText = {title , imgsrc , a } ; // `${title } ${imgsrc} ` 
              let domPriceInner = new JSDOM(pricebuy[i]);
              const rupee  = await domPriceInner.querySelector('rupee').textContent;
              const priceText =  {rupee }; 
              mergedText = Object.assign({}, prodText, priceText);
              } catch(err ) {
              console.log(" could not merge ",JSON.stringify(err)); //console.error('Fetch error:', err);
              }
              console.log(" mergedText ",mergedText);
              if(!isEmptyObject(mergedText)) 
                {  merged.push(mergedText); } 
            }  
              */

             
             // const pricebuy =  Array.from(document.querySelectorAll('div._flx._bwrp'));
             // const merged = [...items, ...pricebuy];
             //{ check: imgLoadedCheck });
          /*  await waitForExactElements(document , 'div.rvw-imgbox',4).then(items => async () => {
              console.log(" product  ",JSON.stringify(items));
               await waitForExactElements(document ,'div._flx._bwrp',4).then(pricebuy =>  async () => {
                 console.log(" price  ",JSON.stringify(pricebuy));
                    const minLength = Math.min(items.length, pricebuy.length);
                  const merged = [];
                  for (let i = 0; i < minLength; i++) {   // .textContent 
                    
                    let mergedText = {};
                    console.log(" items[i] ",JSON.stringify(items[i]));
                    console.log(" pricebuy[i] ",JSON.stringify(pricebuy[i]));
                    try {  
                      let domProductInner = new JSDOM(items[i]);
                    const title = await domProductInner.querySelector('img').title;
                    const imgsrc  = await domProductInner.querySelector('img').src;
                    const a = await domProductInner.querySelector('a').href
                    const prodText = {title , imgsrc , a } ; // `${title } ${imgsrc} ` 
                    let domPriceInner = new JSDOM(pricebuy[i]);
                    const rupee  = await domPriceInner.querySelector('rupee').textContent;
                    const priceText =  {rupee }; 
                    mergedText = Object.assign({}, prodText, priceText);
                    } catch(err ) {
                    console.log(" could not merge ",JSON.stringify(err)); //console.error('Fetch error:', err);
                    }
                    console.log(" mergedText ",mergedText);
                    if(!isEmptyObject(mergedText)) 
                      {  merged.push(mergedText); } 
                  }  
        

                    })

                  }  );
                */



                  } catch (error) {
                    console.error(error.message);
                  }
         // })();



         /*  waitForElements('div.rvw-imgbox')
            .then(itemsfound => { console.log(`✅ Found ${itemsfound.length} items`, itemsfound);
                items.push(itemsfound);
              } )
            .catch(err => console.error(err)); */
           // Log to verify the list is not empty
          
          //process.exit();
         /*   await Promise.all( merged.map(async (item) => {
               await extractResults(item)
               .then(data => { console.log(data); 
                
                const fileName = `${brand}Page${page}.json`;
                const filePath =  path.resolve(dir,fileName ); //path.join(__dirname, 'data', fileName);
                const fileDetailName = `${brand}PageDetail${page}.json`;
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2));  
                
                return data;
        
                  }).catch(error => {
                    console.error('Fetch error:', error);
                    return { error: true, error_message: error.message };
                  });
        
             })


         

             );*/
             
           
            /*.then(data => { console.log(data); 

           

              if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2)); // or '{}' for empty JSON
                console.log(`🆕 Created: ${filePath}`);
              } else {
                console.log(`✅ Exists: ${filePath}`);
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
              }
              
              // this data should contain all the data for the products includeing subscritpoins
                 return data;
      
                }).catch(error => {
                  console.error('Fetch error:', error);
                  return { error: true, error_message: error.message };
                });
                */
            
        });
        // let jsonData = fetHTML();

       await   fetHTML();
        if (prodResults.length > 0) {
          console.log(" fetHTML over  " );
          console.log(" products fetched "+prodResults.length);
        }
        return prodResults;

    })
    .then(data => { 
      console.log(` axios get (${url}) over ` );
      console.log(" axios get then ", Array.isArray(data) ? data.length : JSON.stringify(data));  
      if (prodResults.length > 0) {
        console.log("  axios get over  " );
        console.log(" products fetched "+prodResults.length);
      }
      return prodResults;
  
     } )
    .catch(error => {
      console.error(' axios get (${url}) Fetch error:', error);
    });
     

    function tidyAsync(rawHtml, item , id, userGold, prodDescArr, prodImgHref, price , reqProduct, options = {}) {
      return new Promise((resolve, reject) => {
          tidy(rawHtml, { doctype: 'html5', indent: true }, async (err, cleanedHtml) => {
            if (err) {
              console.error('HTML Tidy Error:', err);
            return reject(err);
            }
          let prodDesc = []; let   prodImg='';
            const dom = new JSDOM(cleanedHtml);
            const documentD = dom.window.document;
           // const contDocument = contDom.window.document;
              prodDesc = documentD.querySelectorAll('._pdsd'); //documentD.querySelectorAll('div._pdsd');
             if(prodDesc.length  > 0){
                // req = req[0].nextElementSibling.textContene  
                   prodDesc.forEach(element => {
                  //  console.log('element:', element.textContent);
                      let descSplit = element.textContent.split('\n');
                      if( descSplit.length >1){
                       // console.log('key :', descSplit[0]);
                       // console.log('value :', descSplit[1]);
                        //jsun[descSplit[0]] = descSplit[1];
                      }
                      prodDescArr.push(element.textContent.trim());   
                   });
                // console.log('product descript ', JSON.stringify(prodDescArr));   
             }
             prodImg =  documentD.querySelectorAll('._pdmimg'); // .__arModalBtn ._flx
             if(prodImg !==null && prodImg !== undefined  ){
                 // fetch the image url
                 if(prodImg.childNodes  !== null && prodImg.childNodes !== undefined  && prodImg.childNodes.length > 0) {
                   if(prodImg.childNodes [0] !==null && prodImg.childNodes[0] !== undefined  ){
                     prodImgHref = prodImg.childNodes[0];
                    if(prodImgHref.src !==null && prodImgHref.src !== undefined  ){
                    // console.log('image href:', prodImgHref.src);
                       jsun.image = prodImgHref.src;
                    }
                 }
               }
                
             }
            // request prodect with image and detais descrip attributes
            let t =item.title;
            let img = item.imgsrc;
            reqProduct = { t , img, prodDescArr};

          //console.log('reqProduct:', reqProduct);
            const fileDetailName = `${brand}PageDetail${page}.json`;
            const fileDetailPath =  path.resolve(dir,fileDetailName );
               
            reqProduct = { t , img, prodDescArr , price };
          let product = undefined;
            // 'aidfe'+Math.abs(Math.random()*10)
            //for( let kk=0; kk<dr.length; kk++){
            // 'store_'+Math.abs(Math.random()*10)
           
           // productModels.push(product)
            //  products = productModels
         // }
        // 
       // await waitForDBUser () ;
       /* if (!globalAdminUser) {
           console.log("Second Try  Admin User not found");
              //process.exit(0); // ✅ Terminates the worker from inside
          }
       
          
        if (globalAdminUser) {
          const productMong = await ProductModel.create({
            name: reqProduct.t,
            price: parseFloat(reqProduct.price),
            user: globalAdminUser._id,
            image: reqProduct.img ,
            brand:  reqProduct.t,
            category:'mobile',
            countInStock: 0,
            numReviews: 0,
            description:  prodDescArr.join('\n'),
          });
            product  =  { _id :  productMong._id , user: globalAdminUser._id,
                name: reqProduct.t,
                image: reqProduct.img ,
                brand: reqProduct.t,
                category: 'mobile',
            
                description:   prodDescArr.join('\n'),
          //  reviews:  [],
           // rating:  1,   
            numReviews:0,
                price:   reqProduct.price,
            countInStock:0,
              } ;
             // productModels.push(product)
         fs.writeFileSync(fileDetailPath, JSON.stringify(product, null, 2));
              //  products = productModels
        }
        else {
           // }
           product  =  { _id :   id , user: userGold,
            name: reqProduct.t,
            image: reqProduct.img ,
            brand: reqProduct.t,
            category: 'mobile',
          // 
            description:   prodDescArr.join('\n'),
            
           // fs.writeFileSync(fileDetailPath, JSON.stringify(product, null, 2));
             
            numReviews:0,
            price:   reqProduct.price,
            countInStock:0,
          } ; 
          console.log('admin user not found PRODUCT FETCHED  COULD not be CACHED in DB and FILE');
        }*/
        product  =  { _id :   id , user: userGold,
          name: reqProduct.t,
          image: reqProduct.img ,
          brand: reqProduct.t,
          category: 'mobile',

          description:   prodDescArr.join('\n'),

         // rating:  1,   
          numReviews:0,
          price:   reqProduct.price,
          countInStock:0,
        } ; 
        return resolve(product);
          });
      });
    }
    async function extractDetailResults(item) {
     
      let jsun = ''; let  prodDesc ='' , prodImg='';
      let id=  'store_'+Math.abs(Math.random()*10); 
      let userGold = 'aidfe'+Math.abs(Math.random()*10);
      let price = item.rupee;
      jsun  = { };
      let prodDescArr =[]; let prodImgHref ='';
      let reqProduct = {}
      // read https://www.gadgets360.com/vivo-t4-5g-price-in-india-131722#pfrom=search
      try { //const contResponse = await fetch(item.querySelector('a').href);
         const url = item.a; // ..item.querySelector('a').href
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' // Some sites block non-browser agents
            }
          });
        
          const rawHtml = await response.text();
          try {
            let opt = {"emptyText": "" };
            const productFromHTML = await tidyAsync(rawHtml ,item,  id, userGold, prodDescArr, 
              prodImgHref, price , reqProduct, opt);
             return productFromHTML;
          } catch (error) {
            console.error('Error tidying HTML:', error);
           }
        
        } catch (error) {
          console.error('❌ Fetch error:', error.message);
     }
     // const contText = await contResponse.text();
     // const contDom = new JSDOM(contText);
     

      async function fpInReq(fp) {
          const ty = fp.nextElementSibling;
          if (!ty) return;
          jsun[ty.textContent] = ty.nextElementSibling.textContent;
      }
      const limit = pLimit(10); // Set concurrency limit to 10
      /* const limit =    promiseLimit(2)*/
       const tasks =   Array.from(reqProduct).map(item => 
         limit(() => fpInReq(item))
       );
       await Promise.all(tasks);
       results.push(jsun);
       return results;
  }




     
    async function extractResults(item) {
      const title = item.title;//await item.querySelector('img').title;
      const imgsrc  = item.imgsrc; //await item.querySelector('img').src;
      const rupee  = item.rupee; //await item.querySelector('rupee').textContent;
      let jsun = ''; let  prodDesc ='' , prodImg='';
      let id=  'store_'+Math.abs(Math.random()*10); 
      let userGold = 'aidfe'+Math.abs(Math.random()*10);
      let price = rupee;
      jsun  = { title , imgsrc , id , price};
      let prodDescArr =[]; let prodImgHref ='';
      let reqProduct = {}
      // read https://www.gadgets360.com/vivo-t4-5g-price-in-india-131722#pfrom=search
      try { //const contResponse = await fetch(item.querySelector('a').href);
         const url = item.a; // ..item.querySelector('a').href
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' // Some sites block non-browser agents
            }
          });
        
          const rawHtml = await response.text();
        
          tidy(rawHtml, { doctype: 'html5', indent: true }, async (err, cleanedHtml) => {
            if (err) {
              console.error('HTML Tidy Error:', err);
              return;
            }
        
            const dom = new JSDOM(cleanedHtml);
            const documentD = dom.window.document;
           // const contDocument = contDom.window.document;
              prodDesc = documentD.querySelectorAll('._pdsd'); //documentD.querySelectorAll('div._pdsd');
             if(prodDesc.length  > 0){
                // req = req[0].nextElementSibling.textContene  
                   prodDesc.forEach(element => {
                      console.log('element:', element.textContent);
                      let descSplit = element.textContent.split('\n');
                      if( descSplit.length >1){
                          console.log('key :', descSplit[0]);
                          console.log('value :', descSplit[1]);
                          jsun[descSplit[0]] = descSplit[1];
                      }
                      prodDescArr.push(element.textContent.trim());   
                   });
             }
             prodImg =  documentD.querySelectorAll('._pdmimg'); // .__arModalBtn ._flx
             if(prodImg !==null && prodImg !== undefined  ){
                 // fetch the image url
                 if(prodImg.childNodes  !== null && prodImg.childNodes !== undefined  && prodImg.childNodes.length > 0) {
                   if(prodImg.childNodes [0] !==null && prodImg.childNodes[0] !== undefined  ){
                     prodImgHref = prodImg.childNodes[0];
                    if(prodImgHref.src !==null && prodImgHref.src !== undefined  ){
                       console.log('image href:', prodImgHref.src);
                       jsun.image = prodImgHref.src;
                    }
                 }
               }
                
             }
            // request prodect with image and detais descrip attributes
            let t =jsun?.title;
            let img = jsun?.imgsrc;
            reqProduct = { t , img, prodDescArr};

            console.log('reqProduct:', reqProduct);
            const fileDetailName = `${brand}PageDetail${page}.json`;
            const fileDetailPath =  path.resolve(dir,fileDetailName );
           
           
            // Example: Extract product title
            const title = documentD.querySelector('h1')?.textContent.trim();
            console.log('📱 Title:', title);
           // console.log(' req :',  req );
            // Example: Extract price
            const price = documentD.querySelector('.shop_now_section .price')?.textContent.trim();
            console.log('💰 Price:', price || 'Not found');
            reqProduct = { t , img, prodDescArr , price };

            //for( let kk=0; kk<dr.length; kk++){
            // 'store_'+Math.abs(Math.random()*10)
              const product  =  { _id :  id , user: userGold ,
                name: reqProduct.t,
                image: reqProduct.img ,
                brand: reqProduct.t,
                category: 'mobile',
            
                description:   prodDescArr.join('\n'),
                reviews:  [],
                rating:  1, 
                numReviews:  2,
                price:   reqProduct.price,
                countInStock: 3 ,
              } ;
             // productModels.push(product)
              //  products = productModels
           // }
          // 
             
           


            fs.writeFileSync(fileDetailPath, JSON.stringify(product, null, 2));
           


          });
        
        } catch (error) {
          console.error('❌ Fetch error:', error.message);
     }
     // const contText = await contResponse.text();
     // const contDom = new JSDOM(contText);
     

      async function fpInReq(fp) {
          const ty = fp.nextElementSibling;
          if (!ty) return;
          jsun[ty.textContent] = ty.nextElementSibling.textContent;
      }
      const limit = pLimit(10); // Set concurrency limit to 10
      /* const limit =    promiseLimit(2)*/
       const tasks =   Array.from(reqProduct).map(item => 
         limit(() => fpInReq(item))
       );
       await Promise.all(tasks);
       results.push(jsun);
       return results;
  }

  

  parentPort.postMessage(prodResults);
  return prodResults;





   
  } catch (err) {
    parentPort.postMessage({ success: false, error: err.message });
  }
})();

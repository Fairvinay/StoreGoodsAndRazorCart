// worker.js
import { Worker } from 'worker_threads';
import { parentPort, workerData } from 'worker_threads';
//const { parentPort, workerData } = require('worker_threads');
import fs from 'fs';
import { dirname, join } from 'path';
import { JSDOM } from 'jsdom';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
//import fetch from 'node-fetch';
import { tidy } from 'htmltidy2';
import pLimit from 'p-limit';
//const pLimit = require('p-limit');
//var promiseLimit = require('promise-limit')

(async () => {
  try {
    const { brand, page } = workerData;
    const query = `${brand}&pageNumber=${page}`;
    const url = `https://gadgets360.com/search?searchtext=${query}`;
    let results = [];
    /*if (!fs.existsSync('./data')) {
      fs.mkdirSync('./data');
    }*/
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      // Step 3: Move 2 directories up
       const twoLevelsUp = path.resolve(__dirname, '..');  
       const dir = path.join(twoLevelsUp, 'client', 'public/data'); 

      const fileName = `${brand}Page${page}.json`;
     /*const filePath =  path.resolve(dir,fileName );//path.join(__dirname, 'data', fileName);
      if (!fs.existsSync(filePath)) {
        
          fs.writeFileSync(filePath, ''); // or '{}' for empty JSON
          console.log(`🆕 Created: ${filePath}`);
        
        //fs.writeFileSync(filePath, JSON.stringify(data, null, 2)); // or '{}' for empty JSON
     
      }*/
      // Ensure the directory exists
     //  const dir = path.dirname(filePath);
     
     await axios.get(url).then(response => {
        if (!response.statusText && response.status !=200) {
          throw new Error(`HTTP error! status: ${response.status}  ${response.statusText}
            response.ok ${response.ok}`);
        }
    
       let fetHTML =   (async () => {
          const t = await   response.data; //response.text();
           let text =t
           let dom = new JSDOM(text);
           let document = dom.window.document;

           const items =  Array.from(document.querySelectorAll('div.rvw-imgbox'));
           // Log to verify the list is not empty
            console.log(`Found ${items.length} items`);

            await Promise.all( items.map(async (item) => {
               await extractResults(item)
               .then(data => { console.log(data); 
                
                const fileName = `${brand}Page${page}.json`;
                const filePath =  path.resolve(dir,fileName ); //path.join(__dirname, 'data', fileName);
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2));  
                
                return data;
        
                  }).catch(error => {
                    console.error('Fetch error:', error);
                    return { error: true, error_message: error.message };
                  });
        
             })


         

             );
             
           
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

         fetHTML().then(data => { console.log(data); 

          const fileName = `${brand}Page${page}.json`;
          parentPort.postMessage({ success: true, file: fileName });
           
         });
        


    })
    .then(data => { console.log(data); 
  
     } )
    .catch(error => {
      console.error('Fetch error:', error);
    });
     
    async function extractResults(item) {
      const title = await item.querySelector('img').title;
      const imgsrc  = await item.querySelector('img').src;
      let jsun = ''; let  prodDesc ='' , prodImg='';
      jsun  = { title , imgsrc };
      let prodDescArr =[]; let prodImgHref ='';
      let reqProduct = {}
      // read https://www.gadgets360.com/vivo-t4-5g-price-in-india-131722#pfrom=search
      try { //const contResponse = await fetch(item.querySelector('a').href);
         const url = item.querySelector('a').href
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
            // Example: Extract product title
            const title = documentD.querySelector('h1')?.textContent.trim();
            console.log('📱 Title:', title);
           // console.log(' req :',  req );
            // Example: Extract price
            const price = documentD.querySelector('.shop_now_section .price')?.textContent.trim();
            console.log('💰 Price:', price || 'Not found');

           


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

  








   
  } catch (err) {
    parentPort.postMessage({ success: false, error: err.message });
  }
})();

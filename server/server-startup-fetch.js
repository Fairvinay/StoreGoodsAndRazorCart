import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import path from 'path';
import dotenv from "dotenv";
import connectDB from "./config/dbworker.js";
import ProductModel from "./models/productModel.js";
import UserModel from "./models/userModel.js";
import fs from 'fs';
import axios from 'axios';
const brands = ['vivo', 'oppo', 'motorola', 'samsung'];
const pages = [1, 2, 3]; //[1];

dotenv.config();
let globalAdminUser = undefined;
let globalProductCount =0;

if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data');
}
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Step 3: Move 2 directories up
 const twoLevelsUp = path.resolve(__dirname, '..');  
 const dir = path.join(twoLevelsUp, 'client', 'public/data'); 
 if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}
function runWorker(brand, page , user) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, 'worker.js'), {
      workerData: { brand, page , user}
    });
    worker.on('message',async (data) => {
      // ✅ Received array from worker
      console.log('Length Data from worker:', Array.isArray(data) ? data.length : 0);
      if( Array.isArray(data) && data.length > 0){
        await waitForDBUser () ;
       await writeProductsToFileAndDB(data, brand, page);
       // writeProductsToFile(data, `./data/${brand}PageDetail${page}.json`);
      }
      resolve(data); // pass it up
    });
    worker.on('error', reject);
    worker.on('exit', code => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}
async function writeProductsToFileAndDB(data ,brand, page) {
  if (globalAdminUser) {
    const fileDetailName = `${brand}PageDetail${page}.json`;
    const fileDetailPath =  path.resolve(dir,fileDetailName );
   for(const reqProduct of data) {
    /*
       reqProduct  =  { _id :   id , user: userGold,
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
    */
        let priceValue = parseFloat(reqProduct.price);

        if (isNaN(priceValue)) {
          priceValue = Math.floor((Math.random()* 10 )* 1000); 
        }
    const productMong = await ProductModel.create({
      name: reqProduct.name,
      price: priceValue,
      user: globalAdminUser._id,
      image: reqProduct.image ,
      brand:  reqProduct.brand,
      category: reqProduct.category,
      countInStock: reqProduct.countInStock,
      numReviews: reqProduct.numReviews,
      description:  reqProduct.description,
    });
    const product  =  { _id :  productMong._id , user: globalAdminUser._id,
      name: productMong.name,
      image: productMong.image ,
      brand: productMong.brand,
      category: productMong.category,
  
      description:  productMong.description,
    //  reviews:  [],
     // rating:  1,   
      numReviews:productMong.numReviews,
      price:   productMong.price,
      countInStock:productMong.countInStock,
    } ; 
    
   fs.writeFileSync(fileDetailPath, JSON.stringify(product, null, 2));
}
}
}
async function waitForDBConnection( timeout = 12000) {
  return new Promise(async (resolve, reject) => {
    const interval =6000;
    let elapsed = 0;
   /* const c = await connectDB()
    if (c) {
    //  clearInterval(timer);
      resolve("Connected to DB");
    } else { //if ((elapsed += interval) >= timeout) 
      //clearInterval(timer);
      reject( 'Timeout: DB Connection Failed ');
    }*/ 
   const c = await connectDB();

   const timer = setInterval(async () => {
     
      if (c) {
        clearInterval(timer);
        resolve("Connected to DB");
      } else if ((elapsed += interval) >= timeout) {
        clearInterval(timer);
        if (!c) {
        reject(new Error('Timeout: DB Connection Failed '));
        }
      }
    }, interval); 
  });
}
async function waitForDBProducts( timeout = 5000) {
  return new Promise(async (resolve, reject) => {
    const interval = 4900;
    let elapsed = 0;

    const email = 'vvanvekar@gmail.com';
    const count = await ProductModel.countDocuments();//await UserModel.findOne({ email });  const admin = await 
    if (count) {
     // clearInterval(timer);
      globalProductCount = count;
    //  console.log(" globalAdminUser connected id ",globalAdminUser.id);
      resolve("Connected with Admin user DB");
     
    } else /*if ((elapsed += interval) >= timeout) */{
     //  clearInterval(timer);
      reject(new Error('Timeout: Admin User DB Connection Failed '));
    }
  });
};
async function waitForDBUser( timeout = 5000) {
  return new Promise(async (resolve, reject) => {
    const interval = 4900;
    let elapsed = 0;

    const email = 'vvanvekar@gmail.com';
    const present = await UserModel.findOne({ email: email }); //await UserModel.findOne({ email });  const admin = await 
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


(async () => {
  const jobs = [];
  await  connectDB();//waitForDBConnection () ;
  await waitForDBUser () ;
  await waitForDBProducts () ;
  if(globalProductCount ==0){
  for (const brand of brands) {
    for (const page of pages) {
      jobs.push(runWorker(brand, page ,globalAdminUser));
    }
  }
  }
  else {
    console.log('Products already in DB:',globalProductCount);
  }
  const results = await Promise.allSettled(jobs);
  results.forEach(res => {
    if (res.status === 'fulfilled') {
      console.log('✔ Success:', res.value);
    } else {
      console.error('❌ Failed:', res.reason);
    }
  });

  console.log('✅ All fetching completed. Server can now start.');

  try {
      
  
        // Graceful exit
        process.exit(0);
      } catch (error) {
        console.error("❌ Startup failed:", error.message);
        process.exit(1); // exit with error
      }
})();

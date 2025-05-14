import asyncHandler from "../middlewares/asyncHandler.js";
import ProductModel from "../models/productModel.js";
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import path from 'path';
import fs from 'fs';

const brands = ['vivo', 'oppo', 'motorola', 'samsung'];
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Step 3: Move 2 directories up
 const twoLevelsUp = path.resolve(__dirname, '..');  
 const dir = path.join(twoLevelsUp, 'client', 'public/data'); 

 function toPromise(fn, ...args) {
  return new Promise((resolve, reject) => {
    try {
      const result = fn(...args);

      // If it already returns a Promise, forward it
      if (result instanceof Promise) {
        result.then(resolve).catch(reject);
      } else {
        resolve(result); // wrap sync return into resolved Promise
      }
    } catch (err) {
      reject(err);
    }
  });
}
function isJsonString(str) {
  if (typeof str !== 'string') return false;

  try {
    const parsed = JSON.parse(str);
    // Ensure it's an object or array, not a primitive
    return parsed !== null && typeof parsed === 'object';
  } catch (e) {
    return false;
  }
}
function isJsonCompatible(obj) {
  if (typeof obj !== 'object' || obj === null) return false;

  try {
    JSON.stringify(obj);
    return true;
  } catch (e) {
    return false;
  }
}

// Wrap it in a Promise-based async function
function loadJsonAsync(filePath) {
  return new Promise((resolve, reject) => {
    try {
      const data = loadJsonSync(filePath);
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
}

const getStaticProducts = asyncHandler(async (brandIn) => {
  const brands = ['vivo', 'oppo', 'motorola', 'samsung'];
const pages = [1];//[1, 2, 3];

const promises = [];

for (const brand of brands) {
  for (const page of pages) {
      promises.push(loadJsonAsync(`${brand}PageDetail${page}.json`));
  }
}

  const results = await Promise.allSettled(promises);
  let successfulData = [];

  for (const result of results) {
    if (result.status === 'fulfilled') {
      const data = result.value;
      if (data && typeof data.brand === 'string') {
        successfulData.push(data);
      }
      else {
        console.warn('Failed to push:', result.reason);
      }
    } else {
      console.warn('Failed to load JSON file:', result.reason);
    }
  }
  if (successfulData.length === 0) {
    successfulData = sampleProductDataArray;
    console.warn('loaded embedded controller array data:' );
  } 
  const filteredProducts = successfulData.filter(product => {
    const brand = product?.brand;
    return typeof brand === 'string' && typeof brandIn === 'string'
      ? brand.toLowerCase().includes(brandIn.toLowerCase())
      : false;
  });
   // allData[brand] = allData[brand].forEach(console.log);
  return filteredProducts;
});

async function writeProductsToFile(products, filePath) {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const twoLevelsUp = path.resolve(__dirname, '..','..');  
    const dir = path.join(twoLevelsUp, 'client', 'public/data'); 
    let brand = checkBrand(product.name);
    const fileDetailName  = `${brand}PageDetail${page}.json`;
    const fileDetailPath =  path.resolve(dir,fileDetailName );

    await fs.writeFile(filePath, JSON.stringify(products, null, 2), 'utf-8');
    console.log('✅ products.json written successfully');
  } catch (err) {
    console.error('❌ Failed to write file:', err);
  }
}

//Check brand of proeduct
function  checkBrand  (productbrand)   {


  if(brands.includes(productbrand)   ){
    console.log(" array includes "+productbrand);
  }
  else { 
    console.log(" default found oppo " );
  }
  let rt =   brands.find((b) =>productbrand.indexOf(b.brand)  > -1);
  return rt ? rt.brand : "oppo";
};
// @desc - Fetch all Product
// @route - GET /api/products
// @access - Public
const getProducts = asyncHandler(async (req, res, next) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
   let products = []; let count = 0;let productModels  =  [];
  let query = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};
   let keyword = req.query.keyword !== 'undefined'? req.query.keyword : '';
  try {   //http://localhost:8080/gadgets360/vivo?pageNumber=1
    // https://bb6f6125-db9c-4152-b500-ee566806723b.e1-us-east-azure.choreoapps.dev
   let response  =undefined;
     try {  
      response =    await axios.get(process.env.PRODUCT_URL+'/'+req.query.keyword, {
            params: {
              pageNumber: 1
            }
          });
          let dr  = response.data
          console.log("  products not in MongoDB . got from server 8080 ...."); 
          if(Array.isArray(dr)){
           count = dr.length;
            products = dr;
          /* for( let kk=0; kk<dr.length; kk++){
             const product  =  { _id : 'store_'+Math.abs(Math.random()*10) , user: 'aidfe'+Math.abs(Math.random()*10) ,
               name: response.data[kk].title,
               image: response.data[kk].imgsrc ,
               brand: response.data[kk].title,
               category: 'mobile',
           
               description: '',
               reviews:  [],
               rating:  1, 
               numReviews:  2,
               price:  9293,
               countInStock: 3 ,
             } ;
             productModels.push(product)
               products = productModels
           }*/
          }
         res.json({products, page, pages: Math.ceil(count / pageSize) });
         // Great observation — in Node.js (especially with Express), calling res.json(...) does not automatically stop function execution.
         // If you want to stop function execution, you need to use return;
         return ; 
      }   
      catch (error) {
        console.error('PRODUCT_URL Fetch error:', error);
      }
      if ( response !== undefined && response.data !==undefined)  {
    console.log('Response:', response.data);
      }
    const brands = ['vivo', 'oppo', 'motorola', 'samsung'];
      let resultbData = [];
      for(let i = 0; i < brands.length; i++){
        let brand = brands[i] ;
        let mb = await getStaticProducts(brand) //localStorage.getItem(brand);
        let bData ={};
        if(mb !== undefined && mb !== null){
          console.log("no static data found from json file "+ brand); 
        }else {
          console.log("loads emeded controller static data "+ brand); 
          mb = sampleProductDataArray;
        }
        if(mb !== undefined && mb !== null){
          if( isJsonString(mb)) {
             bData = JSON.parse(mb);
            if(Array.isArray(bData)){
              let firstEl = bData[0];;
                  console.log(firstEl); 
              
            }
          }
          else if (isJsonCompatible(mb)){
            bData = mb;
            resultbData.push({ brand : brand , data : bData });
        }
      }
      }
      let keywordData =[];
      if(keyword !== ''){
        keywordData = resultbData.filter((item) =>  item.brand === keyword
      );
      }
      else {
        keywordData = resultbData;
      }
   
      if( resultbData.length === 0){
        keywordData =  [];
      }
      let pro = { products : sampleProductDataArray };
       if(keywordData.length > 0 && keywordData[0].data !==undefined ){
      console.log(keywordData[0].data); 
        pro = { products : keywordData[0].data };
       }
      
     
      console.log(pro.products); 
      if(response  === undefined){
        response = { data : pro.products };
        //response.data = pro.products;
        console.log("loading cache data for products ...."); 
      }

   
    

   products = await ProductModel.find({ ...query })  .limit(pageSize)
         .skip(pageSize * (page - 1));
        /* .then((res) => {





         })
       .catch((err) => {
        console.log(err);
       })*/
    
      if((products !== undefined && products.length === 0)  && response.data !==undefined ){  // || products.length === 0)
         let dr  = response.data
         console.log("  products not in MongoDB . got from server 8080 ...."); 
         if(Array.isArray(dr)){
          count = dr.length;
            products = dr;
         /* for( let kk=0; kk<dr.length; kk++){
            const product  =  { _id : 'store_'+Math.abs(Math.random()*10) , user: 'aidfe'+Math.abs(Math.random()*10) ,
              name: response.data[kk].title,
              image: response.data[kk].imgsrc ,
              brand: response.data[kk].title,
              category: 'mobile',
          
              description: '',
              reviews:  [],
              rating:  1, 
              numReviews:  2,
              price:  9293,
              countInStock: 3 ,
            } ;
            productModels.push(product)
              products = productModels
          }*/
         



        //  await ProductModel.insertMany(productModels);
        // productModels.forEach(async (product) => {
          // await ProductModel.create(product);
          /*  await ProductModel.create({
            name: product.name,
            price:product.price,
            // issue user is undefined 
            user: req.user._id,
            image:product.image,
            brand: product.brand,
            category: product.category,
            countInStock:product.countInStock,
            numReviews: product.numReviews,
            description: product.description,
          });*/

     
          // write to file to KEEP note of the ID generated for the PRODUCT.
        /*  
          writeProductsToFile(productModels, fileDetailPath);


         })
          */


          //}
        res.json({products, page, pages: Math.ceil(count / pageSize) });
        //throw new Error("No products Found");
      }else {
       products  = pro.products
       console.log("  products not in MongoDB . got from satitc file ...."); 

        res.json({ products, page, pages: Math.ceil(count / pageSize) });
      }
    
    }   // products === undefined  && response.data !==undefined
  }  
  catch (error) {
    console.log(error);
     /*
     const count = await ProductModel.countDocuments({ ...query });
     const products = await ProductModel.find({ ...query })
        .limit(pageSize)
        .skip(pageSize * (page - 1));
      res.json({ products, page, pages: Math.ceil(count / pageSize) });
     */

  }
  
});

const getFilteredProducts = asyncHandler(async (req, res) => {
  let { rating, price, brand, category } = req.query;
  let query = {
    brand: {
      $regex: brand,
      $options: "i",
    },
    category: {
      $regex: category,
      $options: "i",
    },
  };

  if (price) {
    query.price = {
      $lte: price,
    };
  }

  if (rating) {
    query.rating = {
      $gte: rating,
    };
  }

  const products = await ProductModel.find({ ...query });

  if (products.length === 0) {
    res.status(404);
    throw new Error("No products Found");
  }

  res.status(200).json(products);
});
function  loadJsonSync  (filePath) {

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  // Step 3: Move 2 directories up
   const twoLevelsUp = path.resolve(__dirname, '..','..');  
 
   const dir = path.join(twoLevelsUp, 'client', 'public/data'); 
   const absolutePath = path.resolve(dir, filePath);
   console.log('🔍 Attempting to load:', absolutePath);
  const fileContent = fs.readFileSync(absolutePath, 'utf-8');


  return JSON.parse(fileContent);
};
// @desc - Fetch Single Product with Id
// @route - GET /api/products/:id
// @access - Public
const getProductDetail = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  let brand = id;
  // read from previously fetched vivoPageDetail1.json.
  const data = loadJsonSync(`${brand}PageDetail1.json`);
  let reqProd  = undefined
   if(data !== undefined && Array.isArray(data)){
    reqProd =  data.find ( product => product.brand.indexOf(brand ) >-1)
   }
   else { 
    reqProd = data;
   }

   if(reqProd !== undefined && Array.isArray(reqProd)){
    return res.status(200).json(reqProd[0]);
   }
   else if ( reqProd !== undefined){
    return res.status(200).json(reqProd);
   }
   else { 
    res.status(404);
    throw new Error("Product Not Found");
   }
 /* const product = await ProductModel.findById(id);
  if (product) {
    return res.status(200).json(product);
  } else {
    res.status(404);
    throw new Error("Product Not Found");
  }*/
});

// Admin Roles
// @desc - Delete Product
// @route - DELETE /api/products/:id
// @access - Private/Admin
const deleteProduct = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const product = await ProductModel.findById(id);
  if (product) {
    await ProductModel.findByIdAndDelete(id);
    return res.status(200).json({ message: "product removed" });
  } else {
    res.status(404);
    throw new Error("Product Not Found");
  }
});

// @desc - Create Product
// @route - POST /api/products
// @access - Private/Admin
const createProduct = asyncHandler(async (req, res, next) => {
  const product = await ProductModel.create({
    name: "Sample Product",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample Brand",
    category: "Sample Category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });

  res.status(200).json(product);
});

// @desc - Update Product
// @route - PUT /api/products/:id
// @access - Private/Admin
const updateProduct = asyncHandler(async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id);
  const { name, price, description, countInStock, image, brand, category } =
    req.body;
  if (!product) {
    res.status(404);
    throw new Error("Product Not Found");
  } else {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        description,
        countInStock,
        image,
        brand,
        category,
      },
      { new: true, runValidators: true }
    );

    res.json(200).json(updatedProduct);
  }
});

// @desc - Create a new Review
// @route - POST /api/products/:id/review
// @access - Private
const reviewProduct = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;
  const product = await ProductModel.findById(req.params.id);
  if (!product) {
    res.status(400);
    throw new Error("Product Not Found");
  } else {
    const alreadyReviwed = product.reviews.find(r => {
      return r.user.toString() === req.user._id.toString();
    });
    if (alreadyReviwed) {
      res.status(403);
      throw new Error("Cannot review twice");
    } else {
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();

      res.status(201).json({ message: "Review Added" });
    }
  }
});

// @desc - Get top rated product
// @route -GET /api/products/toprated
// @access - PUBLIC
const getTopRatedProd = asyncHandler(async (req, res, next) => {
  const products = await ProductModel.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});

const sampleProductdata = {
  "_id": "store_1.234649430540653",
  "user": "aidfe3.2641056876348973",
  "name": "Motorola Edge 60 Fusion",
  "image": "https://i.gadgets360cdn.com/products/small/edge-60-fusion-motorola-db-240x180-1743575993.jpg?downsize=*:90",
  "brand": "Motorola Edge 60 Fusion",
  "category": "mobile",
  "description": "Display\n                            6.70-inch\n                            (1220x2712)\nProcessor\n                            MediaTek Dimensity\n                            7400\nFront Camera\n                            32MP\nRear Camera\n                            50MP + 13MP\nRAM\n                            8GB, 12GB\nStorage\n                            256GB\nBattery\n                            Capacity 5500mAh\nOS\n                            Android 15",
  "reviews": [],
  "rating": 1,
  "numReviews": 2,
  "price": "22,999",
  "countInStock": 3
};
const sampleProductDataArray = [
  {
    "_id": "store_1.234649430540653",
    "user": "aidfe3.2641056876348973",
    "name": "Motorola Edge 60 Fusion",
    "image": "https://i.gadgets360cdn.com/products/small/edge-60-fusion-motorola-db-240x180-1743575993.jpg?downsize=*:90",
    "brand": "Motorola",
    "category": "mobile",
    "description": "Display 6.70-inch (1220x2712), Processor MediaTek Dimensity 7400, Front Camera 32MP, Rear Camera 50MP + 13MP, RAM 8GB, 12GB, Storage 256GB, Battery 5500mAh, OS Android 15",
    "reviews": [],
    "rating": 1,
    "numReviews": 2,
    "price": "22,999",
    "countInStock": 3
  },
  {
    "_id": "store_2.893743298473",
    "user": "aidfe3.928374928374",
    "name": "Motorola G84",
    "image": "https://i.gadgets360cdn.com/products/small/edge-60-fusion-motorola-db-240x180-1743575993.jpg?downsize=*:90",
    "brand": "Motorola",
    "category": "mobile",
    "description": "Display 6.55-inch (1080x2400), Processor Snapdragon 695, Front Camera 16MP, Rear Camera 50MP + 8MP, RAM 8GB, Storage 128GB, Battery 5000mAh, OS Android 14",
    "reviews": [],
    "rating": 4,
    "numReviews": 5,
    "price": "18,499",
    "countInStock": 6
  },
  {
    "_id": "store_3.123987129873",
    "user": "aidfe3.555893893",
    "name": "Motorola Razr 40 Ultra",
    "image": "https://i.gadgets360cdn.com/products/small/edge-60-fusion-motorola-db-240x180-1743575993.jpg?downsize=*:90",
    "brand": "Motorola",
    "category": "mobile",
    "description": "Display 6.9-inch FHD+ AMOLED, Processor Snapdragon 8+ Gen 1, Front Camera 32MP, Rear Camera 12MP + 13MP, RAM 8GB, Storage 256GB, Battery 3800mAh, OS Android 13",
    "reviews": [],
    "rating": 5,
    "numReviews": 10,
    "price": "84,999",
    "countInStock": 2
  },
  {
    "_id": "store_4.219837123981",
    "user": "aidfe3.721983729183",
    "name": "Motorola Edge 40",
    "image": "https://i.gadgets360cdn.com/products/small/edge-60-fusion-motorola-db-240x180-1743575993.jpg?downsize=*:90",
    "brand": "Motorola",
    "category": "mobile",
    "description": "Display 6.55-inch OLED, Processor Dimensity 8020, Front Camera 32MP, Rear Camera 50MP + 13MP, RAM 8GB, Storage 256GB, Battery 4400mAh, OS Android 13",
    "reviews": [],
    "rating": 3,
    "numReviews": 4,
    "price": "29,999",
    "countInStock": 5
  },
  {
    "_id": "store_5.987129837192",
    "user": "aidfe3.112233445566",
    "name": "Motorola G73",
    "image": "https://i.gadgets360cdn.com/products/small/edge-60-fusion-motorola-db-240x180-1743575993.jpg?downsize=*:90",
    "brand": "Motorola",
    "category": "mobile",
    "description": "Display 6.5-inch FHD+ LCD, Processor Dimensity 930, Front Camera 16MP, Rear Camera 50MP + 8MP, RAM 8GB, Storage 128GB, Battery 5000mAh, OS Android 13",
    "reviews": [],
    "rating": 4,
    "numReviews": 8,
    "price": "16,999",
    "countInStock": 10
  },
  {
    "_id": "store_6.776655443322",
    "user": "aidfe3.334455667788",
    "name": "Motorola G13",
    "image": "https://i.gadgets360cdn.com/products/small/edge-60-fusion-motorola-db-240x180-1743575993.jpg?downsize=*:90",
    "brand": "Motorola",
    "category": "mobile",
    "description": "Display 6.5-inch HD+, Processor Helio G85, Front Camera 8MP, Rear Camera 50MP, RAM 4GB, Storage 128GB, Battery 5000mAh, OS Android 13",
    "reviews": [],
    "rating": 3,
    "numReviews": 3,
    "price": "9,499",
    "countInStock": 15
  },
  {
    "_id": "store_7.112358132134",
    "user": "aidfe3.999888777666",
    "name": "Motorola E13",
    "image": "https://i.gadgets360cdn.com/products/small/edge-60-fusion-motorola-db-240x180-1743575993.jpg?downsize=*:90",
    "brand": "Motorola",
    "category": "mobile",
    "description": "Display 6.5-inch HD+ LCD, Processor Unisoc T606, Front Camera 5MP, Rear Camera 13MP, RAM 2GB, Storage 64GB, Battery 5000mAh, OS Android Go",
    "reviews": [],
    "rating": 2,
    "numReviews": 1,
    "price": "6,499",
    "countInStock": 25
  },
  {
    "_id": "store_8.141421356237",
    "user": "aidfe3.123456789012",
    "name": "Motorola Edge 50 Pro",
    "image": "https://i.gadgets360cdn.com/products/small/edge-60-fusion-motorola-db-240x180-1743575993.jpg?downsize=*:90",
    "brand": "Motorola",
    "category": "mobile",
    "description": "Display 6.7-inch P-OLED, Processor Snapdragon 7 Gen 3, Front Camera 50MP, Rear Camera 50MP + 13MP + 10MP, RAM 12GB, Storage 256GB, Battery 4500mAh, OS Android 14",
    "reviews": [],
    "rating": 5,
    "numReviews": 12,
    "price": "31,999",
    "countInStock": 4
  },
  {
    "_id": "store_9.161803398875",
    "user": "aidfe3.333222111000",
    "name": "Motorola G32",
    "image": "https://i.gadgets360cdn.com/products/small/edge-60-fusion-motorola-db-240x180-1743575993.jpg?downsize=*:90",
    "brand": "Motorola",
    "category": "mobile",
    "description": "Display 6.5-inch FHD+ LCD, Processor Snapdragon 680, Front Camera 16MP, Rear Camera 50MP + 8MP + 2MP, RAM 4GB, Storage 128GB, Battery 5000mAh, OS Android 12",
    "reviews": [],
    "rating": 3,
    "numReviews": 7,
    "price": "10,499",
    "countInStock": 12
  },
  {
    "_id": "store_10.314159265359",
    "user": "aidfe3.101010101010",
    "name": "Motorola Edge 30",
    "image": "https://i.gadgets360cdn.com/products/small/edge-60-fusion-motorola-db-240x180-1743575993.jpg?downsize=*:90",
    "brand": "Motorola",
    "category": "mobile",
    "description": "Display 6.5-inch AMOLED, Processor Snapdragon 778G+, Front Camera 32MP, Rear Camera 50MP + 50MP, RAM 6GB, Storage 128GB, Battery 4020mAh, OS Android 12",
    "reviews": [],
    "rating": 4,
    "numReviews": 6,
    "price": "24,999",
    "countInStock": 8
  },
  {
    "_id": "store_8.466782465441424",
    "user": "aidfe1.0189769601158005",
    "name": "Vivo Y300 5G",
    "image": "https://i.gadgets360cdn.com/products/small/vivo-y300-5g-vivo-db-240x180-1732175847.jpg?downsize=*:90",
    "brand": "Vivo Y300 5G",
    "category": "mobile",
    "description": "Display\n                            6.67-inch\n                            (1080x2400)\nProcessor\n                            Qualcomm\n                            Snapdragon 4 Gen 2\nFront Camera\n                            32MP\nRear Camera\n                            50MP + 2MP\nRAM\n                            8GB\nStorage\n                            128GB,\n                            256GB\nBattery\n                            Capacity 5000mAh\nOS\n                            Android 14",
    "reviews": [],
    "rating": 1,
    "numReviews": 2,
    "price": "19,799",
    "countInStock": 3
  },
  {
    "_id": "store_4.654001524993909",
    "user": "aidfe2.2111401146501275",
    "name": "Samsung Galaxy S25 Ultra",
    "image": "https://i.gadgets360cdn.com/products/small/samsung-galaxy-s25-ultra-240x180-1738321285.jpg?downsize=*:90",
    "brand": "Samsung Galaxy S25 Ultra",
    "category": "mobile",
    "description": "Display\n                            6.90-inch\n                            (1400x3120)\nProcessor\n                            Snapdragon 8\n                            Elite\nFront Camera\n                            12MP\nRear Camera\n                            200MP + 50MP +\n                            50MP + 10MP\nRAM\n                            12GB\nStorage\n                            256GB, 512GB,\n                            1TB\nBattery\n                            Capacity 5000mAh\nOS\n                            Android 15",
    "reviews": [],
    "rating": 1,
    "numReviews": 2,
    "price": "1,07,999",
    "countInStock": 3
  },
  {
    "_id": "store_5.070531792318455",
    "user": "aidfe3.932039455926244",
    "name": "Oppo Reno 8 Pro",
    "image": "https://i.gadgets360cdn.com/products/small/Oppo-reno-8-pro-DB-240x180-1653372156.jpg?downsize=*:90",
    "brand": "Oppo Reno 8 Pro",
    "category": "mobile",
    "description": "Display\n                            6.70-inch\n                            (2412x1080)\nProcessor\n                            MediaTek Dimensity\n                            8100 5G\nFront Camera\n                            32MP\nRear Camera\n                            50MP + 8MP +\n                            2MP\nRAM\n                            12GB\nStorage\n                            256GB\nBattery\n                            Capacity 4500mAh\nOS\n                            Android 12",
    "reviews": [],
    "rating": 1,
    "numReviews": 2,
    "price": "26,999",
    "countInStock": 3
  }
];

export {
  getProducts,
  getProductDetail,
  deleteProduct,
  createProduct,
  updateProduct,
  reviewProduct,
  getTopRatedProd,
  getFilteredProducts,
};

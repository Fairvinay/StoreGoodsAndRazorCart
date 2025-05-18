import asyncHandler from "../middlewares/asyncHandler.js";
import ProductModel from "../models/productModel.js";
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import path from 'path';
import fs from 'fs';

const brands = ['vivo', 'oppo', 'motorola', 'samsung'];
let globalFilteredProducts = [];
let staticFetched = true;
let default_keyword = "vivo";
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
   globalFilteredProducts = filteredProducts;
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
   let keyword = req.query.keyword !== 'undefined'? req.query.keyword : default_keyword;
  try {   //http://localhost:8080/gadgets360/vivo?pageNumber=1
    // https://bb6f6125-db9c-4152-b500-ee566806723b.e1-us-east-azure.choreoapps.dev
   let response  =undefined;
     try {  
      response =    await axios.get(process.env.PRODUCT_URL+'/'+keyword, {
            params: {
              pageNumber: 1
            }
          });
          let dr  = response.data
          console.log("  products not in MongoDB . got from server 8080 ...."); 
          if(Array.isArray(dr)){
           count = dr.length;
            products = dr;
            if (dr.length === 0) {
              console.log("  products not in MongoDB . static file ...."); 
              products = sampleProductDataArray;
            }
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
        console.log('  keywordData[0].data   --> ' , keywordData[0].data); 
        pro = { products : keywordData[0].data };
       }
      
     
    
      if(response  === undefined){
        response = { data : pro.products };
        //response.data = pro.products;
        staticFetched   =true;
        //response.data = pro.products;
        console.log("loading cache data for products ...."); 
        console.log(' staticFetched ',response.data.length); 
      }

      if( !staticFetched ){
          try {
            products = await ProductModel.find({ ...query })
              .limit(pageSize)
              .skip(pageSize * (page - 1))
              .maxTimeMS(9000);
          } catch (error) {
            if (error.code === 50) {
   
              console.error('Query timed out.');
    
            } else {
              console.error('Query failed:', error);
            }
          }
      }

       //  .skip(pageSize * (page - 1));  
        /* .then((res) => {





         })
       .catch((err) => {
        console.log(err);
       })*/
    
      if((products !== undefined && products.length === 0)  && response.data !==undefined ){  // || products.length === 0)
         let dr  = response.data
         console.log("  products not in MongoDB . got from server 8080 ...." + JSON.stringify(dr)); 
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
       products  = pro.products;
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
  let brand = id; let findByBrand = false;
  if(isNaN(Number(id))){
    findByBrand = true;
    if (brands.includes(id)) {
      brand = id;
    }
    else { 
      brand = "oppo";   // deafult
    } brands.forEach((b) => {
      if (b === id) {
        brand = b;
      }
    })
    console.log("user searching using brand is :" + brand);
  }
  else {
    console.log("user searching using product id is :" + id);
  }

  // read from previously fetched vivoPageDetail1.json.
    // Since id is in the format store_3.123987129873
  // find in the already fetched 
  let requestData =undefined;
  if (globalFilteredProducts.length > 0) {
  	 requestData =   globalFilteredProducts .filter(product => {
		    const internal_id = product?._id;
		    return typeof internal_id === 'string' && typeof id === 'string'
		      ? internal_id.toLowerCase().includes(id.toLowerCase())
		      : false;
		  });
    //successfulData = sampleProductDataArray;
     console.warn('found the usr reuested product :' );
  } 
  else {
    requestData =	 sampleProductDataArray.filter(product => {
		    const internal_id = product?._id;
		    return typeof internal_id === 'string' && typeof id === 'string'
		      ? internal_id.toLowerCase().includes(id.toLowerCase())
		      : false;
			  }); 
	 console.warn('found the   reuested product from emededed array :' );	
  }
  let keywordData=undefined;
 /* for(let i = 0; i < brands.length; i++){
        let brand = brands[i] ;*/
  if(findByBrand && brand !== undefined && brand !== null){
        let mb = await getStaticProducts(brand);

    if(mb !== undefined && mb !== null){
      console.log("no static data found from json file "+ brand); 
    }else {
      console.log("loads emeded controller static data "+ brand); 
      mb = sampleProductDataArray;
    }
       keywordData = mb.filter(product => {
		    const internal_id = product?._id;
		    return typeof internal_id === 'string' && typeof id === 'string'
		      ? internal_id.toLowerCase().includes(id.toLowerCase())
		      : false;
		  });   
  }
      
  /*     if(  keywordData !== undefined){
       	   break;
       }
  }*/
  let  data =   (keywordData !== undefined) ? keywordData :undefined;   //loadJsonSync(`${brand}PageDetail1.json`);
  let reqProd  = undefined;
   if(data !== undefined && Array.isArray(data)){
    reqProd =  data.find ( product => product.brand.indexOf(brand ) >-1)
   }
   else { 
    reqProd = data;
   }
   const escapeRegex = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

   const safeBrand = escapeRegex(brand);

   const product = findByBrand ? await ProductModel.find({   brand: { $regex: safeBrand, $options: 'i' }}) : await ProductModel.findById(id);
    if (product) {
   // return res.status(200).json(product);
       console.warn('found the   reuested product in DB :' );	
      reqProd = product;
     } else {
   // res.status(404);
     console.warn('no  product in DB :' );	
    //throw new Error("Product Not Found");
  }


   if(reqProd !== undefined && Array.isArray(reqProd)){
    console.log("found the  multiple products from emededed array :" );
    console.log("reqProd[0] : ",JSON.stringify(reqProd[0])  );
    console.log("reqProd[0] length: ",JSON.stringify(reqProd.length)  );
    console.log("reqProd  : ",JSON.stringify(reqProd )  );
    return res.status(200).json(reqProd);
   }
   else if ( reqProd !== undefined){
    console.log("found the product from emededed array :" );
    return res.status(200).json(reqProd);
   }
   else { 
    console.log("not found the product from emededed array :" );
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
    "_id": "682964718522a610f4f63da1",
    "user": "6819f3bd808190ec8f62a953",
    "name": "Motorola Edge 60 Fusion",
    "image": "https://i.gadgets360cdn.com/products/small/edge-60-fusion-motorola-db-240x180-1743575993.jpg?downsize=*:90",
    "brand": "Motorola Edge 60 Fusion",
    "category": "mobile",
    "description": "Display\n                            6.70-inch\n                            (1220x2712)\nProcessor\n                            MediaTek Dimensity\n                            7400\nFront Camera\n                            32MP\nRear Camera\n                            50MP + 13MP\nRAM\n                            8GB, 12GB\nStorage\n                            256GB\nBattery\n                            Capacity 5500mAh\nOS\n                            Android 15",
    "numReviews": 0,
    "price": 1998,
    "countInStock": 0
  },
  {
    "_id": "682964718522a610f4f63d99",
    "user": "6819f3bd808190ec8f62a953",
    "name": "Motorola Edge 60 Stylus",
    "image": "https://i.gadgets360cdn.com/products/small/edge-60-fusion-motorola-db-240x180-1743575993.jpg?downsize=*:90",
    "brand": "Motorola Edge 60 Stylus",
    "category": "mobile",
    "description": "Display\n                            6.67-inch\n                            (1220x2712)\nProcessor\n                            Qualcomm\n                            Snapdragon 7s Gen 2\nFront Camera\n                            32MP\nRear Camera\n                            50MP + 13MP\nRAM\n                            8GB\nStorage\n                            256GB\nBattery\n                            Capacity 5000mAh\nOS\n                            Android 15",
    "numReviews": 0,
    "price": 7102,
    "countInStock": 0
  },
  {
    "_id": "682964718522a610f4f63d75",
    "user": "6819f3bd808190ec8f62a953",
    "name": "Motorola Moto X (Gen 2)",
    "image": "https://i.gadgets360cdn.com/products/small/edge-60-fusion-motorola-db-240x180-1743575993.jpg?downsize=*:90",
    "brand": "Motorola Moto X (Gen 2)",
    "category": "mobile",
    "description": "Display\n                            5.20-inch\n                            (1080x1920)\nProcessor\n                            Qualcomm\n                            Snapdragon 801\nFront Camera\n                            2MP\nRear Camera\n                            13MP\nRAM\n                            2GB\nStorage\n                            16GB\nBattery\n                            Capacity 2300mAh\nOS\n                            Android\n                            4.4.4",
    "numReviews": 0,
    "price": 6709,
    "countInStock": 0
  },
  {
    "_id": "682964718522a610f4f63d93",
    "user": "6819f3bd808190ec8f62a953",
    "name": "Vivo T2 Pro 5G",
    "image": "https://i.gadgets360cdn.com/products/small/edge-60-fusion-motorola-db-240x180-1743575993.jpg?downsize=*:90",
    "brand": "Vivo T2 Pro 5G",
    "category": "mobile",
    "description": "Display\n                            6.78-inch\n                            (1080x2400)\nProcessor\n                            MediaTek Dimensity\n                            7200\nFront Camera\n                            16MP\nRear Camera\n                            64MP + 2MP\nRAM\n                            8GB\nStorage\n                            128GB,\n                            256GB\nBattery\n                            Capacity 4600mAh\nOS\n                            Android 13",
    "numReviews": 0,
    "price": 2009,
    "countInStock": 0
  },
  {
    "_id": "store_6.187127687774543",
    "user": "aidfe7.466418311221174",
    "name": "Vivo Y29 5G",
    "image": "https://i.gadgets360cdn.com/products/small/edge-60-fusion-motorola-db-240x180-1743575993.jpg?downsize=*:90",
    "brand": "Vivo Y29 5G",
    "category": "mobile",
    "description": "Display\n                            6.68-inch\n                            (720x1608)\nProcessor\n                            MediaTek Dimensity\n                            6300\nFront Camera\n                            8MP\nRear Camera\n                            50MP +\n                            0.08MP\nRAM\n                            4GB, 6GB,\n                            8GB\nStorage\n                            128GB,\n                            256GB\nBattery\n                            Capacity 5500mAh\nOS\n                            Android 14",
    "reviews": [],
    "rating": 1,
    "numReviews": 2,
    "price": "13,999",
    "countInStock": 3
  },
  {
    "_id": "682964718522a610f4f63dad",
    "user": "6819f3bd808190ec8f62a953",
    "name": "Vivo V25 5G",
    "image": "https://i.gadgets360cdn.com/products/small/edge-60-fusion-motorola-db-240x180-1743575993.jpg?downsize=*:90",
    "brand": "Vivo V25 5G",
    "category": "mobile",
    "description": "Display\n                            6.44-inch\n                            (1080x2404)\nProcessor\n                            MediaTek Dimensity\n                            900\nFront Camera\n                            50MP\nRear Camera\n                            64MP + 8MP +\n                            2MP\nRAM\n                            8GB, 12GB\nStorage\n                            128GB,\n                            256GB\nBattery\n                            Capacity 4,500mAh\nOS\n                            Android 12",
    "numReviews": 0,
    "price": 7267,
    "countInStock": 0
  },
  {
    "_id": "682964718522a610f4f63da3",
    "user": "6819f3bd808190ec8f62a953",
    "name": "Vivo T4x 5G",
    "image": "https://i.gadgets360cdn.com/products/small/edge-60-fusion-motorola-db-240x180-1743575993.jpg?downsize=*:90",
    "brand": "Vivo T4x 5G",
    "category": "mobile",
    "description": "Display\n                            6.72-inch\n                            (1080x2408)\nProcessor\n                            MediaTek Dimensity\n                            7300\nFront Camera\n                            8MP\nRear Camera\n                            50MP + 2MP\nRAM\n                            6GB, 8GB\nStorage\n                            128GB,\n                            256GB\nBattery\n                            Capacity 6500mAh\nOS\n                            Android 15",
    "numReviews": 0,
    "price": 6674,
    "countInStock": 0
  },{
    "_id": "682964718522a610f4f63db3",
    "user": "6819f3bd808190ec8f62a953",
    "name": "Samsung Galaxy Tab S10 FE+",
    "image": "https://i.gadgets360cdn.com/products/small/edge-60-fusion-motorola-db-240x180-1743575993.jpg?downsize=*:90",
    "brand": "Samsung Galaxy Tab S10 FE+",
    "category": "mobile",
    "description": "Display\n                            13.10-inch\n                            (1440x2304)\nFront Camera\n                            12MP\nRAM\n                            8GB\nOS\n                            Android 15\nStorage\n                            128GB\nRear Camera\n                            13MP\nBattery\n                            Capacity 10090mAh",
    "numReviews": 0,
    "price": 151,
    "countInStock": 0
  },
  {
    "_id": "682964718522a610f4f63d9d",
    "user": "6819f3bd808190ec8f62a953",
    "name": "Samsung Galaxy M53 5G",
    "image": "https://i.gadgets360cdn.com/products/small/edge-60-fusion-motorola-db-240x180-1743575993.jpg?downsize=*:90",
    "brand": "Samsung Galaxy M53 5G",
    "category": "mobile",
    "description": "Display\n                            6.70-inch\n                            (1080x2400)\nProcessor\n                            MediaTek Dimensity\n                            900\nFront Camera\n                            32MP\nRear Camera\n                            108MP + 8MP + 2MP\n                            + 2MP\nRAM\n                            6GB, 8GB\nStorage\n                            128GB\nBattery\n                            Capacity 5000mAh\nOS\n                            Android 12",
    "numReviews": 0,
    "price": 8676,
    "countInStock": 0
  },
  {
    "_id": "682964718522a610f4f63daf",
    "user": "6819f3bd808190ec8f62a953",
    "name": "Samsung Galaxy A14 5G",
    "image": "https://i.gadgets360cdn.com/products/small/edge-60-fusion-motorola-db-240x180-1743575993.jpg?downsize=*:90",
    "brand": "Samsung Galaxy A14 5G",
    "category": "mobile",
    "description": "Display\n                            6.60-inch\n                            (1080x2408)\nProcessor\n                            2.2Ghz MHz\n                            octa-core\nFront Camera\n                            13MP\nRear Camera\n                            50MP + 2MP +\n                            2MP\nRAM\n                            4GB, 6GB,\n                            8GB\nStorage\n                            64GB, 128GB\nBattery\n                            Capacity 5000mAh\nOS\n                            Android 13",
    "numReviews": 0,
    "price": 4956,
    "countInStock": 0
  },
  {
    "_id": "682964718522a610f4f63dab",
    "user": "6819f3bd808190ec8f62a953",
    "name": "Oppo A3X 5G",
    "image": "https://i.gadgets360cdn.com/products/small/vivo-y300-5g-vivo-db-240x180-1732175847.jpg?downsize=*:90",
    "brand": "Oppo A3X 5G",
    "category": "mobile",
    "description": "Display\n                            6.67-inch\n                            (720x1604)\nProcessor\n                            MediaTek Dimensity\n                            6300\nFront Camera\n                            5MP\nRear Camera\n                            8MP\nRAM\n                            4GB\nStorage\n                            64GB, 128GB\nBattery\n                            Capacity 5100mAh\nOS\n                            Android 14",
    "numReviews": 0,
    "price": 6117,
    "countInStock": 0
  },
  {
    "_id": "682964718522a610f4f63db5",
    "user": "6819f3bd808190ec8f62a953",
    "name": "Oppo A5 Pro 5G (2025)",
    "image": "https://i.gadgets360cdn.com/products/small/samsung-galaxy-s25-ultra-240x180-1738321285.jpg?downsize=*:90",
    "brand": "Oppo A5 Pro 5G (2025)",
    "category": "mobile",
    "description": "Display\n                            6.67-inch\n                            (720x1604)\nProcessor\n                            MediaTek Dimensity\n                            6300\nFront Camera\n                            8MP\nRear Camera\n                            50MP + 2MP\nRAM\n                            8GB\nStorage\n                            128GB,\n                            256GB\nBattery\n                            Capacity 5800mAh\nOS\n                            Android 15",
    "numReviews": 0,
    "price": 9021,
    "countInStock": 0
  },
  {
    "_id": "682964718522a610f4f63db1",
    "user": "6819f3bd808190ec8f62a953",
    "name": "Oppo A5 Pro 5G (2025)",
    "image": "https://i.gadgets360cdn.com/products/small/Oppo-reno-8-pro-DB-240x180-1653372156.jpg?downsize=*:90",
    "brand": "Oppo A5 Pro 5G (2025)",
    "category": "mobile",
    "description": "Display\n                            6.67-inch\n                            (720x1604)\nProcessor\n                            MediaTek Dimensity\n                            6300\nFront Camera\n                            8MP\nRear Camera\n                            50MP + 2MP\nRAM\n                            8GB\nStorage\n                            128GB,\n                            256GB\nBattery\n                            Capacity 5800mAh\nOS\n                            Android 15",
    "numReviews": 0,
    "price": 9200,
    "countInStock": 0
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

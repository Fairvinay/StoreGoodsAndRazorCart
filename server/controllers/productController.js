import asyncHandler from "../middlewares/asyncHandler.js";
import ProductModel from "../models/productModel.js";
import axios from 'axios';


const getStaticProducts = asyncHandler(async (brandIn) => {
  const brands = ['vivo', 'oppo', 'motorola', 'samsung'];
const pages = [1];//[1, 2, 3];

const promises = [];

for (const brand of brands) {
  for (const page of pages) {
    const url =process.env.STATIC_PRODUCT_URL+`/data/${brand}Page${page}.json`; // relative path
    promises.push(
      axios.get(url).then(res => ({
        brand,
        data: res.data,
      })).catch(err => {
        console.error(`❌ Failed to load ${url}`, err.message);
        return { brand, data: [] };
      })
    );
  }
}

const results = await Promise.all(promises);

const allData = {};
brands.forEach(brand => {
  allData[brand] = results
    .filter(r => r.brand === brand)
    .flatMap(r => r.data);
   // allData[brand] = allData[brand].forEach(console.log);
   console.log(allData[brand][0]);
   // localStorage.setItem(brand, JSON.stringify(allData[brand] ));
});

return brands.find(brand => brand === brandIn);// allData[brandIn ] !== undefined


})
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
       
           for( let kk=0; kk<dr.length; kk++){
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
           }
          }
         res.json({products, page, pages: Math.ceil(count / pageSize) });
         // Great observation — in Node.js (especially with Express), calling res.json(...) does not automatically stop function execution.
         // If you want to stop function execution, you need to use return;
         return ; 
      }   
      catch (error) {
        console.error('PRODUCT_URL Fetch error:', error);
      }
    console.log('Response:', response.data);
    const brands = ['vivo', 'oppo', 'motorola', 'samsung'];
      let resultbData = [];
      for(let i = 0; i < brands.length; i++){
        let brand = brands[i] ;
        let mb = getStaticProducts(brand) //localStorage.getItem(brand);
        if(mb !== undefined && mb !== null){
            
            let bData = JSON.parse(mb);
            if(Array.isArray(bData)){
              let firstEl = bData[0];;
                  console.log(firstEl); 
              
            }
            resultbData.push({ brand : brand , data : bData });
        }
      }
    let keywordData = resultbData.filter((item) =>  item.brand === keyword
      );
      console.log(keywordData[0].data); 
      let pro = { products : keywordData[0].data };
      console.log(pro.products); 
      if(response  === undefined){
        response.data = pro.products;
        console.log("loading cache data for products ...."); 
      }

   
    

   products = await ProductModel.find({ ...query })
        /* .then((res) => {





         })
       .catch((err) => {
        console.log(err);
       })*/
      .limit(pageSize)
      .skip(pageSize * (page - 1));
      if(products === undefined  && response.data !==undefined ){  // || products.length === 0)
         let dr  = response.data
         console.log("  products not in MongoDB . got from server 8080 ...."); 
         if(Array.isArray(dr)){
          count = dr.length;
      
          for( let kk=0; kk<dr.length; kk++){
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
          }
         



         }
        res.json({products, page, pages: Math.ceil(count / pageSize) });
        //throw new Error("No products Found");
      }else {
       products  = pro.products
       console.log("  products not in MongoDB . got from satitc file ...."); 

        res.json({ products, page, pages: Math.ceil(count / pageSize) });
      }
    
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

// @desc - Fetch Single Product with Id
// @route - GET /api/products/:id
// @access - Public
const getProductDetail = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const product = await ProductModel.findById(id);
  if (product) {
    return res.status(200).json(product);
  } else {
    res.status(404);
    throw new Error("Product Not Found");
  }
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

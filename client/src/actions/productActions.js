import {
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_REQUEST,
  PRODUCT_DETAIL_REQUEST,
  PRODUCT_DETAIL_SUCCESS,
  PRODUCT_DETAIL_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_REVIEW_REQUEST,
  PRODUCT_REVIEW_SUCCESS,
  PRODUCT_REVIEW_FAIL,
  PRODUCT_TOP_RATED_REQUEST,
  PRODUCT_TOP_RATED_SUCCESS,
  PRODUCT_TOP_RATED_FAIL,
  PRODUCT_FILTER_REQUEST,
  PRODUCT_FILTER_SUCCESS,
} from "../constants/productConstants";
import axios from "axios";

let default_keyword = "vivo";

function isJsonString(str) {
  try {
    const obj = JSON.parse(str);
    return obj && typeof obj === "object";
  } catch (e) {
    return false;
  }
}
function isJsonCompatible(obj) {
  try {
    JSON.stringify(obj);
    console.log(JSON.stringify(obj));
    return true;
  } catch (e) {
    return false;
  }
}
const getStaticProducts = async (brandIn) => {
  const brands = ['vivo', 'oppo', 'motorola', 'samsung'];
const pages = [1];//[1, 2, 3];

const promises = [];

for (const brand of brands) {
  for (const page of pages) {
    const url =process.env.REACT_APP_SERVER_URL+`/data/${brand}PageDetail${page}.json`; // relative path
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


}


const listProducts =
  (keyword = "", pageNumber = 1) =>
  async dispatch => {
    try {
      dispatch({ type: PRODUCT_LIST_REQUEST });
      default_keyword = keyword;
      const { data } = await axios.get(
        process.env.REACT_APP_SERVER_URL+`/api/products?keyword=${keyword}&pageNumber=${pageNumber}`
      );

      dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
      const brands = ['vivo', 'oppo', 'motorola', 'samsung'];
      let resultbData = [];
      for(let i = 0; i < brands.length; i++){
        let brand = brands[i] ;
         let mb =  await  getStaticProducts(brand);//localStorage.getItem(brand);
         if(mb !== undefined && mb !== null){
            if( isJsonString(mb)) {
             console.log(mb); 
             let bData = JSON.parse(mb);
             resultbData.push(bData);
         }
            else if (isJsonCompatible(mb)){
              resultbData.push(mb);
            } 
             
             
         }
      }


      dispatch({ type: PRODUCT_LIST_SUCCESS, payload: resultbData[keyword] });
      
    } catch (error) {

      const brands = ['vivo', 'oppo', 'motorola', 'samsung'];
      let resultbData = [];
      for(let i = 0; i < brands.length; i++){
        let brand = brands[i] ;
         let mb = await getStaticProducts(brand);//localStorage.getItem(brand);
         if(mb !== undefined && mb !== null){
          let bData ="";
          if( isJsonString(mb)) {
              bData = JSON.parse(mb);
             if(Array.isArray(bData)){
               let firstEl = bData[0];;
                   console.log(firstEl); 
              
             }
          }
          else if (isJsonCompatible(mb)){
            bData =  mb;
            console.log("static cached products loaded "); 
          }
          if(Array.isArray(bData)){
             resultbData.push({ brand : brand , data : bData });
         }
      }
      }
      keyword = default_keyword;
      let keywordData =[];
      if(keyword !== ''){
        keywordData = resultbData.filter((item) =>  item.brand === keyword
      );
      }
      else {
        keywordData = resultbData;
      }
      let pro = { products : sampleProductDataArray , pages :0 , page:1};
      if(keywordData.length > 0 && keywordData[0].data !==undefined ){
      console.log(keywordData[0].data); 
        pro = { products : keywordData[0].data };
       }
      //let pro = { products : keywordData[0].data  , pages :1 , page:1};
      console.log(pro.products); 
      //dispatch({ type: PRODUCT_LIST_SUCCESS, payload: pro });
      console.log(pro.products); 
      dispatch({ type: PRODUCT_LIST_SUCCESS, payload: pro });

      if( pro == undefined && pro == null){
        if (keywordData.length === 0) {
          
        }else {
          dispatch({
            type: PRODUCT_LIST_FAIL,
            payload:
              error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
          });  
        }
      
      }

     
    }
  };

const topRatedProducts = () => async dispatch => {
  let keyword =  '';
  try {
    dispatch({ type: PRODUCT_TOP_RATED_REQUEST });

    const { data } = await axios.get(process.env.REACT_APP_SERVER_URL+`/api/products/toprated`);

    dispatch({ type: PRODUCT_TOP_RATED_SUCCESS, payload: data });
  } catch (error) {
    const brands = ['vivo', 'oppo', 'motorola', 'samsung'];
    let resultbData = [];
    for(let i = 0; i < brands.length; i++){
      let brand = brands[i] ;
       let mb =  await  getStaticProducts(brand);//localStorage.getItem(brand);
       if(mb !== undefined && mb !== null){
        let bData ="";
        if( isJsonString(mb)) {
           let bData = JSON.parse(mb);
           if(Array.isArray(bData)){
             let firstEl = bData[0];;
                 console.log(firstEl); 
            
           }
          }
          else if (isJsonCompatible(mb)){
            bData =  mb;
            console.log("static cached products loaded "); 
          }
          if(Array.isArray(bData)){
           resultbData.push({ brand : brand , data : bData });
       }
    }
    }
      
    default_keyword = (default_keyword !== null && default_keyword !== undefined) ? default_keyword : 'oppo';
    keyword = default_keyword;
    let keywordData =[];
    if(keyword !== ''){
      keywordData = resultbData.filter((item) =>  item.brand === keyword
    );
    }
    else {
      keywordData = resultbData;
    }
    let pro = { products : [] , pages :0 , page:1};
    if(keywordData.length > 0 && keywordData[0].data !==undefined ){
    console.log(keywordData[0].data); 
      pro = { products : keywordData[0].data };
     }
   


    
    console.log("TOP RATED   "+ pro.products); 
    //dispatch({ type: PRODUCT_TOP_RATED_SUCCESS, payload: pro });

    if( pro == undefined && pro == null){
      if (keywordData.length === 0) {
        
      }else {
        dispatch({
          type: PRODUCT_LIST_FAIL,
          payload:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        });  
      }
    
    }



   /* dispatch({
      type: PRODUCT_TOP_RATED_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });*/
  }
};

const filterProduct =
  (rating = "", price = "", brand = "", category = "") =>
  async dispatch => {
    try {
      dispatch({
        type: PRODUCT_FILTER_REQUEST,
      });

      const { data } = await axios.get(
        process.env.REACT_APP_SERVER_URL+`/api/products/filter?rating=${rating}&price=${price}&brand=${brand}&category=${category}`
      );

      dispatch({
        type: PRODUCT_FILTER_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: PRODUCT_DETAIL_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

const listProductDetail = id => async dispatch => {
  try {
    dispatch({ type: PRODUCT_DETAIL_REQUEST });

    const { data } = await axios.get(process.env.REACT_APP_SERVER_URL+`/api/products/${id}`);
    dispatch({ type: PRODUCT_DETAIL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAIL_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Admin Roles

const createProduct = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_CREATE_REQUEST,
    });
    const { userInfo } = getState().userLogin;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: userInfo.token,
      },
    };
    const { data } = await axios.post(process.env.REACT_APP_SERVER_URL+`/api/products`, {}, config);

    dispatch({
      type: PRODUCT_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

const updateProduct = (product, id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_UPDATE_REQUEST,
    });
    const { userInfo } = getState().userLogin;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: userInfo.token,
      },
    };

    const { data } = await axios.put(process.env.REACT_APP_SERVER_URL+`/api/products/${id}`, product, config);

    dispatch({
      type: PRODUCT_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

const deleteProduct = id => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_DELETE_REQUEST,
    });
    const { userInfo } = getState().userLogin;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: userInfo.token,
      },
    };
    await axios.delete(process.env.REACT_APP_SERVER_URL+`/api/products/${id}`, config);

    dispatch({
      type: PRODUCT_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

const createReview = (review, id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_REVIEW_REQUEST,
    });

    const userInfo = getState().userLogin.userInfo;
    const config = {
      headers: {
        "Content-Type": "Application/json",
        Authorization: userInfo.token,
      },
    };

    const { data } = await axios.post(
      process.env.REACT_APP_SERVER_URL+`/api/products/${id}/review`,
      {
        rating: review.rating,
        comment: review.comment,
      },
      config
    );

    dispatch({
      type: PRODUCT_REVIEW_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_REVIEW_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
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
  listProducts,
  listProductDetail,
  deleteProduct,
  createProduct,
  updateProduct,
  createReview,
  topRatedProducts,
  filterProduct,
};

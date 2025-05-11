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


const getStaticProducts = asyncHandler(async (brandIn) => {
  const brands = ['vivo', 'oppo', 'motorola', 'samsung'];
const pages = [1];//[1, 2, 3];

const promises = [];

for (const brand of brands) {
  for (const page of pages) {
    const url =process.env.REACT_APP_SERVER_URL+`/data/${brand}Page${page}.json`; // relative path
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
         let mb = getStaticProducts(brand);//localStorage.getItem(brand);
         if(mb !== undefined && mb !== null){
             console.log(mb); 
             let bData = JSON.parse(mb);
             resultbData.push(bData);
         }
      }


      dispatch({ type: PRODUCT_LIST_SUCCESS, payload: resultbData[keyword] });
      
    } catch (error) {

      const brands = ['vivo', 'oppo', 'motorola', 'samsung'];
      let resultbData = [];
      for(let i = 0; i < brands.length; i++){
        let brand = brands[i] ;
         let mb = getStaticProducts(brand);//localStorage.getItem(brand);
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
      let pro = { products : keywordData[0].data  , pages :1 , page:1};
      console.log(pro.products); 
      //dispatch({ type: PRODUCT_LIST_SUCCESS, payload: pro });

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
  try {
    dispatch({ type: PRODUCT_TOP_RATED_REQUEST });

    const { data } = await axios.get(process.env.REACT_APP_SERVER_URL+`/api/products/toprated`);

    dispatch({ type: PRODUCT_TOP_RATED_SUCCESS, payload: data });
  } catch (error) {
    const brands = ['vivo', 'oppo', 'motorola', 'samsung'];
    let resultbData = [];
    for(let i = 0; i < brands.length; i++){
      let brand = brands[i] ;
       let mb = getStaticProducts(brand);//localStorage.getItem(brand);
       if(mb !== undefined && mb !== null){
          
           let bData = JSON.parse(mb);
           if(Array.isArray(bData)){
             let firstEl = bData[0];;
                 console.log(firstEl); 
            
           }
           resultbData.push({ brand : brand , data : bData });
       }
    }
      
    default_keyword = (default_keyword !== null && default_keyword !== undefined) ? default_keyword : 'oppo';

    let keywordData = resultbData.filter((item) =>  item.brand ===default_keyword
    );
    console.log(keywordData[0].data); 
    let pro = { products : keywordData[0].data , pages :1 , page:1};
    console.log("TOP RATED   "+ pro.products); 
    dispatch({ type: PRODUCT_TOP_RATED_SUCCESS, payload: pro });

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

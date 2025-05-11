// redux/actions/loadStaticModels.js
import axios from 'axios';
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
  } from "../../constants/productConstants";
export const LOAD_MODELS_SUCCESS = 'LOAD_MODELS_SUCCESS';

const brands = ['vivo', 'oppo', 'motorola', 'samsung'];
const pages = [1];//[1, 2, 3];

export const loadStaticModels = () => async dispatch => {
  const promises = [];

  for (const brand of brands) {
    for (const page of pages) {
      const url = `/data/${brand}Page${page}.json`; // relative path
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
      localStorage.setItem(brand, JSON.stringify(allData[brand] ));
  });

  dispatch({
    type: LOAD_MODELS_SUCCESS,
    payload: allData,
  });
  dispatch({ type: PRODUCT_LIST_SUCCESS, payload: allData });
};

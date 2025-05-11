import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import Product from "../components/Product";
import { __STORENOTIFY_USERINFO } from "../constants/localStrorageConstant";
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
import { listProducts } from "../actions/productActions";
import Paginate from "../components/Paginate";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useParams } from "react-router-dom";
import Slider from "../components/Slider";
import Title from "../components/Title";
import Filter from "../components/Filter";

const Home = () => {
  const dispatch = useDispatch();

  const { keywords, pageNumber } = useParams();
  const [isAllowed , setAllowed] = useState(true);
  const productList = useSelector(state => state.productList);
  const { loading, error, products, page, pages } = productList;

  useEffect(() => {
      // re-chekc if the user object and token is presnet
      let u  = localStorage.getItem(__STORENOTIFY_USERINFO);
      /*
      {"_id":"6819f27a808190ec8f62a952","name":"Shaik","email":"shaikh.abbas2609@gmail.com",
      "isAdmin":false,
      "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTlmMjdhODA4MTkwZWM4ZjYyYTk1MiIsImlhdCI6MTc0NjUzNTE5MCwiZXhwIjoxNzQ2NTM4NzkwfQ.ErL1gT5_dhmoI5-yrtIpa-2VTrc-hTYLhHtZcGDPIwk"}
      
      */
      if (u  !== null && u !== undefined) {
        u = JSON.parse(u);
        if (u.token !== null && u.token !== undefined) {
         //  alert("Please login to access this page.");
          //history.push("/requestlogin");
          setAllowed(true);
        }
        else {
          setAllowed(true);
        }
      }  
    if(keywords !== undefined && pageNumber !== undefined){
      dispatch(listProducts(keywords, pageNumber));
    }
    else { // DEFAULT OPPO products 
    /*    const brands = ['vivo', 'oppo', 'motorola', 'samsung'];
      let resultbData = [];
      for(let i = 0; i < brands.length; i++){
        let brand = brands[i] ;
        let mb = localStorage.getItem(brand);
        if(mb !== undefined && mb !== null){
            
            let bData = JSON.parse(mb);
            if(Array.isArray(bData)){
              let firstEl = bData[0];;
                  console.log(firstEl); 
              
            }
            resultbData.push({ brand : brand , data : bData });
        }
      }
    let keywordData = resultbData.filter((item) =>  item.brand === 'oppo'
      );
      console.log(keywordData[0].data); 
      let pro = { products : keywordData[0].data };
      console.log(pro.products); */
      let ley = localStorage.getItem("keywords");
      let default_keyword =   ley !== null && ley !== undefined ? ley : 'oppo';
    dispatch(listProducts(default_keyword, pageNumber)  );
    }
  }, [dispatch, keywords, pageNumber]);

  return (
    <>
      <Title title="Store Notify | Home" />
      {products && (
        <>
          {!keywords && <Slider />}
          <h1>Latest Products</h1>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <>
              <Filter products={products} />
              <Row>
                {products.map(product => (
                  <Col key={product._id} sm={12} md={6} lg={6} xl={3}>
                    <Product product={product} isAllowed={isAllowed}/>
                  </Col>
                ))}
              </Row>
              <Paginate
                page={page}
                pages={pages}
                keywords={keywords ? keywords : ""}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default Home;

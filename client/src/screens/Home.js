import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import Product from "../components/Product";
import { __STORENOTIFY_USERINFO } from "../constants/localStrorageConstant";
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
  const [isAllowed , setAllowed] = useState(false);
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
          setAllowed(false);
        }
      }  

    dispatch(listProducts(keywords, pageNumber));
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

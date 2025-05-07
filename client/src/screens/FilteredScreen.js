import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Title from "../components/Title";

const FilteredScreen = () => {
  const productList = useSelector(state => state.filterProduct);
  const { products, error, loading } = productList;
  return (
    <>
      <Title title="Store Notify | Filtered Proucts" />
      <Link className="btn btn-light my-2" to="/">
        Go Back
      </Link>
      {products && (
        <>
          <h1>Filtered Products</h1>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <>
              <Row>
                {products.map(product => (
                  <Col key={product._id} sm={12} md={6} lg={6} xl={3}>
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
            </>
          )}
        </>
      )}
    </>
  );
};

export default FilteredScreen;

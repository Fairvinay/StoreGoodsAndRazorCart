import { Carousel, Image } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import Loader from "./Loader";
import Message from "./Message";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { topRatedProducts } from "../actions/productActions";

const Slider = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(topRatedProducts());
  }, [dispatch]);

  const topProd = useSelector(state => state.productTopRated);
  const { loading, error, products } = topProd;
  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <Carousel className="bg-dark">
      {products &&
        products.map(product => (
          <Carousel.Item key={product._id} interval={5000}>
            <Link to={`/product/${product._id}`}>
              <Image src={product.image} alt={product.name} fluid />
              <Carousel.Caption className="carousel-caption">
                <h2>
                  {product.name} ({product.brand})
                </h2>
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
        ))}
    </Carousel>
  );
};

export default Slider;

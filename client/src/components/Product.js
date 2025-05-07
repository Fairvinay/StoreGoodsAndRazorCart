import { Card } from "react-bootstrap";
import Rating from "./Rating";
import { Link } from "react-router-dom";
import   ProtectedLink   from "./ProtectedLink";

const Product = ({ product , isAllowed}) => {
  // to={`/product/${product._id}`}
  return (
    <Card className="my-3 p-3 rounded">
      <ProtectedLink urlToProtect={`/product/${product._id}`} isAllowed={isAllowed}   >
        <Card.Img src={product.image} variant="top" />
      </ProtectedLink>
      <Card.Body>
        <ProtectedLink urlToProtect={`/product/${product._id}`} isAllowed={isAllowed}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </ProtectedLink>
        <Card.Text as="div">
          <Rating value={product.rating} text={product.numReviews} />
        </Card.Text>
        <Card.Text as="h3">Rs {product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;

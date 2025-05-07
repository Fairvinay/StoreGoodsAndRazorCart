import { Card } from "react-bootstrap";
import Rating from "./Rating";
import { Link } from "react-router-dom";

const RequestLogin = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded">
       <h2> Please login to see the products</h2>
      <Card.Body>
        <Link to={`/login`}>
          <Card.Title as="div">
            <strong>Welcome Guest User</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <h3>`Visited the Site {new Date().toUTCString()}`</h3>
        </Card.Text>
          <button> LOGIN </button>
      </Card.Body>
    </Card>
  );
};

export default RequestLogin;

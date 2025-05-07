import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useLocation } from "react-router-dom";
import {
  Row,
  Col,
  Button,
  ListGroup,
  Image,
  Form,
  Card,
} from "react-bootstrap";
import Message from "../components/Message";
import { addToCart, removeFromCart } from "../actions/cartActions";
import Title from "../components/Title";

const Cart = ({ history }) => {
  const { id } = useParams();
  const location = useLocation();
  const qty = location.search ? +location.search.split("=")[1] : 1;
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.cartItems);
  useEffect(() => {
    if (id) {
      dispatch(addToCart(id, qty));
    }
  }, [dispatch, id, qty]);

  const removeCartItem = id => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    history.push("/login?redirect=shipping");
  };
  return (
    <>
      <Title title="Gadgets360 | Cart" />
      <Row>
        <Col md={8}>
          <h2>Your Cart</h2>
          {cartItems.length === 0 ? (
            <Message>
              Your Cart is Empty <Link to="/">GO BACK</Link>
            </Message>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map(item => (
                <ListGroup.Item key={item.product}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={3}>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={2}>Rs {item.price}</Col>
                    {/* <Col md={1}>{item.qty}</Col> */}
                    <Col md={3}>
                      <Form.Control
                        as="select"
                        value={item.qty}
                        onChange={e =>
                          dispatch(addToCart(item.product, +e.target.value))
                        }
                      >
                        {[...Array(item.countInStock).keys()].map(x => {
                          return (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          );
                        })}
                      </Form.Control>
                    </Col>
                    <Col md={2}>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => removeCartItem(item.product)}
                      >
                        <i
                          style={{ fontSize: "15px" }}
                          className="fas fa-trash"
                        ></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>
                  Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  ) items
                </h2>
                Rs
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed to checkout
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Cart;

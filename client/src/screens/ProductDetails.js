import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { Link, useHistory, useParams } from "react-router-dom";
import Rating from "../components/Rating";
import Title from "../components/Title";
import { useDispatch, useSelector } from "react-redux";
import { listProductDetail, createReview } from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { PRODUCT_REVIEW_RESET } from "../constants/productConstants";
//import { useNavigate } from "react-router-dom"; 
//import { useHistory  } from "react-router-dom"; 

const ProductDetails = () => {
  const { id } = useParams();
  const history = useHistory();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();
  const productDetail = useSelector(state => state.productDetail);
  const { loading, error, product } = productDetail;

  const productReview = useSelector(state => state.productReview);
  const {
    success,
    error: errorProductReview,
    loading: loadingProductReview,
  } = productReview;

  const userInfo = useSelector(state => state.userLogin.userInfo);

  useEffect(() => {
    if(id !==null && id !==undefined){
      dispatch(listProductDetail(id));
    }
    else{
     
     history.push("/requestlogin"); 
    }
    if (success) {
      setRating(0);
      setComment("");
      dispatch({
        type: PRODUCT_REVIEW_RESET,
      });
    }
  
  }, [id, dispatch, success]);
  const [qty, setQty] = useState(1);

  const addCartHandler = () => {
    history.push(`/cart/${id}?qty=${qty}`);
  };

  const submitHandler = e => {
    e.preventDefault();
    let rev = {
      rating,
      comment,
    };
    dispatch(createReview(rev, id));
  };

  return (
    <>
      <Title title={product && product.name} />
      <Link className="btn btn-light my-2" to="/">
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            <Col md={6}>
              <Image fluid src={product.image} alt={product.image} />
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating value={product.rating} text={product.numReviews} />
                </ListGroup.Item>
                <ListGroup.Item>Price: Rs {product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price</Col>
                      <Col>
                        <strong>Rs {product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Brand</Col>
                      <Col>{product.brand}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status</Col>
                      <Col>
                        {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={e => setQty(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(x => {
                              return (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              );
                            })}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Button
                      disabled={product.countInStock === 0}
                      onClick={addCartHandler}
                      className="btn-block btn-dark"
                    >
                      Add to Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h2>Reviews</h2>
              {product.review && product.reviews.length === 0 && (
                <Message>No Reviews</Message>
              )}
              <ListGroup variant="flush">
                {product.reviews &&
                  product.reviews.map(review => (
                    <ListGroup.Item key={review._id}>
                      <strong>{review.name}</strong>
                      <Rating value={review.rating} />
                      <p>{review.createdAt.substring(0, 10)}</p>
                      <p>{review.comment}</p>
                    </ListGroup.Item>
                  ))}
                <ListGroup.Item>
                  <h2>Write a Customer Review</h2>
                  {success && (
                    <Message variant="success">
                      Review submitted successfully
                    </Message>
                  )}
                  {loadingProductReview && <Loader />}
                  {errorProductReview && (
                    <Message variant="danger">{errorProductReview}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={e => setRating(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          value={comment}
                          onChange={e => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={loadingProductReview}
                        type="submit"
                        variant="primary"
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      <Link to="/login">Please sign in to write a review</Link>
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductDetails;

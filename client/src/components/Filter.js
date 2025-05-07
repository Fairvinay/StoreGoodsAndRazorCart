import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { filterProduct } from "../actions/productActions";

const Filter = ({ products }) => {
  let categoryArr = [];
  let brandArr = [];

  products.forEach(({ category, brand }) => {
    categoryArr.push(category.toLowerCase());
    brandArr.push(brand.toLowerCase());
  });

  function uniqueArr(arr) {
    return Array.from(new Set(arr));
  }

  const [show, setShow] = useState(false);
  const [rating, setRating] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");

  const history = useHistory();

  const dispatch = useDispatch();

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  const submitHandler = e => {
    e.preventDefault();
    dispatch(filterProduct(rating, price, brand, category));
    history.push("/filter");
  };

  return (
    <>
      <Button onClick={handleShow} variant="dark">
        Filter products
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>Filter By</Modal.Header>
        <Modal.Body>
          {products && (
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="rating">
                <Form.Label>Rating (Minimum)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Filter by rating"
                  value={rating}
                  onChange={e => setRating(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="price">
                <Form.Label>Price (Maximum)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Filter by Price"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {uniqueArr(categoryArr).map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="brand">
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  as="select"
                  value={brand}
                  onChange={e => setBrand(e.target.value)}
                >
                  <option value="">Select Brand</option>
                  {uniqueArr(brandArr).map((brand, index) => (
                    <option key={index} value={brand}>
                      {brand}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Button variant="dark" type="submit">
                Filter
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Filter;

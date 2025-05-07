import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Form, Button } from "react-bootstrap";
import {
  getUserDetailAdmin,
  updateUserDetailAdmin,
} from "../actions/userActions";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";

const UserEditScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState(false);

  const { id } = useParams();

  const dispatch = useDispatch();
  const getUser = useSelector(state => state.getUserFromId);
  const { loading, error, user } = getUser;
  useEffect(() => {
    if (!user || !user.name || user._id !== id) {
      dispatch(getUserDetailAdmin(id));
    } else {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [dispatch, id, user]);

  const submitHandler = e => {
    e.preventDefault();
    let userDet = {
      name,
      email,
      isAdmin,
    };
    dispatch(updateUserDetailAdmin(userDet, id));
    setMessage(true);
  };
  return (
    <>
      <Link to="/admin/userlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Update User Profile</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            {message && (
              <Message variant="info">User Updated Successfully</Message>
            )}
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="email">
                <Form.Label>Enter your email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="isAdmin">
                <Form.Check
                  type="checkbox"
                  label="Is Admin"
                  checked={isAdmin}
                  onChange={e => setIsAdmin(e.target.checked)}
                ></Form.Check>
              </Form.Group>
              <Button type="submit" variant="primary">
                Update
              </Button>
            </Form>
          </>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;

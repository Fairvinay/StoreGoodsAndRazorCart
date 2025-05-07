import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import Title from "../components/Title";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useSelector, useDispatch } from "react-redux";
import { forgotPassword } from "../actions/userActions";

const ForgotPasswordScreen = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");

  const { message, loading, error } = useSelector(
    state => state.userForgotPassword
  );

  const submitHandler = async e => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };
  return (
    <>
      <Title title="Gadgets360 | Forgot Password" />
      <FormContainer>
        <h1>Forgot Password</h1>
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        {message && <Message variant="info">{message}</Message>}
        <Form onSubmit={submitHandler}>
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
          <Button type="submit" variant="primary">
            Send Reset Link
          </Button>
        </Form>
        <p className="my-3">
          Have an Account ? <Link to="/login">Login</Link>{" "}
        </p>
      </FormContainer>
    </>
  );
};

export default ForgotPasswordScreen;

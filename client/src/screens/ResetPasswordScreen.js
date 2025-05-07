import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import Title from "../components/Title";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useSelector, useDispatch } from "react-redux";
import { resetPassword } from "../actions/userActions";

const ResetPasswordScreen = () => {
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errPass, setErrPass] = useState("");

  const { resetToken } = useParams();
  const history = useHistory();
  const { error, loading, userInfo } = useSelector(
    state => state.userPasswordReset
  );

  useEffect(() => {
    if (userInfo) {
      history.push("/");
    }
  }, [userInfo, history]);

  const submitHandler = async e => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrPass("Password does not match");
    } else {
      dispatch(resetPassword(resetToken, password));
    }
  };
  return (
    <>
      <Title title="Gadgets360 | Reset Password" />
      <FormContainer>
        <h1>Reset Password</h1>
        {errPass && <Message variant="danger">{errPass}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="password">
            <Form.Label>Enter your password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <Button type="submit" variant="primary">
            Reset Password
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ResetPasswordScreen;

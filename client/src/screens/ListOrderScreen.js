import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { listOrders } from "../actions/orderAction";
import Title from "../components/Title";

const OrderListScreen = () => {
  const dispatch = useDispatch();

  const listOrder = useSelector(state => state.listOrder);
  const { error, loading, orders } = listOrder;
  const userInfo = useSelector(state => state.userLogin.userInfo);

  const history = useHistory();
  useEffect(() => {
    if (!(userInfo && userInfo.isAdmin)) {
      history.push("/login");
    } else {
      dispatch(listOrders());
    }
  }, [dispatch, history, userInfo]);

  return (
    <>
      <Title title="Gadgets360 | Orders List" />
      <h1>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped responsive hover className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER-NAME</th>
              <th>POSTAl CODE</th>
              <th>TOTAL</th>
              <th>DATE</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user.name}</td>
                <td>{order.shippingAddress.postalCode}</td>
                <td>Rs {order.totalPrice}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>
                  {order.isPaid ? (
                    <i className="fas fa-check" style={{ color: "green" }}></i>
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    <i className="fas fa-check" style={{ color: "green" }}></i>
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button className="btn-sm" variant="light">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;

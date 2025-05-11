import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";
import { useHistory } from "react-router-dom";
import SearchBox from "./SearchBox";
import '../styles/header.css';
const Header = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userInfo = useSelector(state => state.userLogin.userInfo);
  const logoutHandler = () => {
    dispatch(logout());
    history.push("/login");
  };
//bg="dark" variant="dark"
  return (
    <header>
      <Navbar style={{ backgroundColor: "#cfecfc", color: "#343a40" }}
  variant="light"  expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand style={{ color: '#a5fffc' }} ><span  style={{ color: '#0831ff' , fontWeight: '800' ,fontFamily: 'Nunito, sans-serif' } }>Store Notify</span></Navbar.Brand>
          </LinkContainer>
          <SearchBox />
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
            <Nav  className="ml-auto">
              <LinkContainer to="/cart">
                <Nav.Link >
                  <i style={{ color: '#0831ff' } } className="fas fa-shopping-cart"></i><span  style={{ color: '#0831ff' } }>Cart</span>
                </Nav.Link> 
              </LinkContainer>
              {userInfo ? (
                <NavDropdown style={{ color: '#0831ff' }} title={userInfo.name} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item><span  style={{ color: '#0831ff' } }>Profile</span></NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                  <span  style={{ color: '#0831ff' } }>Logout</span>
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link id="signin">
                    <i style={{ color: '#0831ff' } } className="fas fa-user" ></i><span  style={{ color: '#0831ff' } }>Sign In</span>
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="admin" id="admin">
                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>Users List</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;

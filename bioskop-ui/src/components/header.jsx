import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
  // NavbarText
} from "reactstrap";
// import { Link } from "react-router-dom";
import { LogoutAction } from "./../redux/actions/AuthAction";
import { connect } from "react-redux";
import { Icon } from "semantic-ui-react";
// import "./../App.css";

const btnLogout = () => {
  localStorage.removeItem("dino");
  this.props.LogoutAction();
  // return <Redirect to={"/"} />;
};

const Header = props => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar className="header" dark expand="md">
        <NavbarBrand href="/" style={{ fontSize: "20px", fontWeight: "600" }}>
          <Icon name="film" className="mr-2" />
          XIT ID
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {props.user === "" ? (
              <Nav>
                <NavItem>
                  <NavLink href="/login">Login</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/register">Register</NavLink>
                </NavItem>
              </Nav>
            ) : null}

            {props.user === "" ? null : props.role === "admin" ? (
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  <Icon name="user secret" size="large" className="mr-2" />
                  {props.user}
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem href="/manageadmin">Manage Movies</DropdownItem>
                  <DropdownItem href="/">Manage Studio</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem href="/" onClick={btnLogout}>
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            ) : props.role === "user" ? (
              <Nav>
                <NavItem>
                  <NavLink href="/cart">
                    <Icon name="cart" size="large" className="mr-2" />
                  </NavLink>
                </NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    <Icon name="user" size="large" className="mr-2" />
                    {props.user}
                  </DropdownToggle>

                  <DropdownMenu right>
                    <DropdownItem href="/">Change Password</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem href="/" onClick={btnLogout}>
                      Logout
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            ) : null}

            {/* <NavItem>
              <NavLink href="/login">Login</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/register">Register</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/" onClick={btnLogout}>
                Logout
              </NavLink>
            </NavItem> */}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

const MapstateToprops = state => {
  // console.log(state);
  return {
    AuthLog: state.AuthLogin.login,
    user: state.AuthLogin.username,
    role: state.AuthLogin.role
  };
};

export default connect(MapstateToprops, { LogoutAction })(Header);

import React, { Component } from "react";
import Axios from "axios";
import { Link, Redirect } from "react-router-dom";
import { APIURL } from "../support/ApiUrl";
import { connect } from "react-redux";
import { LoginSuccessAction } from "./../redux/actions";
// import { Loader } from "react-loader-spinner";
import { Button, Form } from "semantic-ui-react";
import Swal from "sweetalert2";

class Login extends Component {
  state = {
    error: "",
    loading: false
  };

  onLoginClick = () => {
    var username = this.refs.username.value;
    var password = this.refs.password.value;
    this.setState({ loading: true });
    Axios.get(`${APIURL}users?username=${username}&password=${password}`)
      .then(res => {
        // console.log(res.data);
        if (res.data.length) {
          localStorage.setItem("dino", res.data[0].id);
          this.props.LoginSuccessAction(res.data[0]);
          Swal.fire({
            icon: "success",
            title: "Login Success!",
            text: `Welcome, ${username}`
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Whoops!",
            text: `Wrong Username/Password`
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ loading: false });
      });
  };

  render() {
    if (this.props.AuthLog) {
      return <Redirect to={"/"} />;
    }
    return (
      <div>
        <div className="mx-auto my-5" style={{ width: "30%" }}>
          <div className="text-center">
            <h1>LOGIN</h1>
          </div>
          <Form className="mt-5">
            <Form.Field>
              <label>Username</label>
              <input placeholder="Username" ref="username" />
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <input placeholder="Password" type="password" ref="password" />
            </Form.Field>
            <Button type="submit" onClick={this.onLoginClick}>
              Login
            </Button>
            <div className="mt-3">
              Don't have an Account?<Link to={"/register"}> Register</Link>{" "}
              Here!
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

const MapstateToprops = state => {
  return {
    AuthLog: state.AuthLogin.login
  };
};

export default connect(MapstateToprops, { LoginSuccessAction })(Login);

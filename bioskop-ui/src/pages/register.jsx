import React, { Component } from "react";
import { Button, Checkbox, Form } from "semantic-ui-react";
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";
import Swal from "sweetalert2";

class Register extends Component {
  state = {};

  btnRegister = () => {
    var username = this.refs.user.value;
    var password = this.refs.pass.value;
    var confpassword = this.refs.confPass.value;
    var role = "user";
    var newUser = { username, password, role };
    if (username === "" || password === "" || confpassword === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Data Gaboleh Ada Yang Kosong!"
      });
    } else {
      Axios.get(`${APIURL}users?username=${username}`)
        .then(res1 => {
          console.log(res1);
          if (res1.data.length === 0) {
            if (password !== confpassword) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Password must match"
              });
            } else {
              Axios.post(`${APIURL}users`, newUser)
                .then(res => {
                  // Swal.fire({
                  //   position: "top-end",
                  //   icon: "success",
                  //   title: "Your User has been Added!",
                  //   showConfirmButton: false,
                  //   timer: 1500
                  // });
                  Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Your are Registered! Please Login"
                  });
                  this.props.history.push("login");
                })
                .catch(err1 => {
                  console.log(err1);
                });
            }
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: `"${username}" is not Available, Try Using Another Username :)`
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  render() {
    return (
      <div className="mx-auto mt-5" style={{ width: "30%" }}>
        <div className="text-center">
          <h1>REGISTER</h1>
        </div>
        <Form className="mt-5">
          <Form.Field>
            <label>Username</label>
            <input placeholder="" ref="user" />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <input placeholder="" type="password" ref="pass" />
          </Form.Field>
          <Form.Field>
            <label>Re-enter Password</label>
            <input placeholder="" type="password" ref="confPass" />
          </Form.Field>
          <Form.Field>
            <Checkbox label="I agree to the Terms and Conditions" />
          </Form.Field>
          <Button type="submit" onClick={this.btnRegister}>
            Register
          </Button>
        </Form>
      </div>
    );
  }
}

export default Register;

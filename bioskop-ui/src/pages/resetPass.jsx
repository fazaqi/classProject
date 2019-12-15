import React, { Component } from "react";
import { Button, Form } from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import Slide from "react-reveal/Slide";
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import { ResetpassAction } from "./../redux/actions";

class Resetpass extends Component {
  state = {
    toHome: false
  };

  componentDidMount() {
    console.log(this.props.usernamelog);
  }

  handleChangePassClick = () => {
    var oldPass = this.refs.oldpass.value;
    var newPass = this.refs.newpass.value;
    var password = this.refs.confpass.value;
    var updatePass = {
      password,
      username: this.props.usernamelog,
      role: this.props.role
    };
    console.log(updatePass);
    if (oldPass === "" || newPass === "" || password === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password Gaboleh Kosong!"
      });
    } else if (oldPass === newPass) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password Baru tidak boleh sama dgn password lama"
      });
    } else if (oldPass !== this.props.passuser) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password yang anda masukkan salah"
      });
    } else if (newPass !== password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "New Password dan konfirmasi password harus sama"
      });
    } else {
      Axios.put(`${APIURL}users/${this.props.userid}`, updatePass)
        .then(res => {
          // console.log(res.data);
          Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "No",
            confirmButtonText: "Yes"
          }).then(result => {
            if (result.value) {
              this.props.ResetpassAction(res.data);
              this.setState({ toHome: true });
              Swal.fire({
                icon: "success",
                title: "Your password has been Updated!",
                showConfirmButton: false,
                timer: 1500
              });
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  render() {
    if (this.state.toHome || this.props.userlog === false) {
      return <Redirect to="/" />;
    }
    return (
      <Slide bottom cascade>
        <div className="mx-auto mt-5" style={{ width: "30%" }}>
          <div className="text-center">
            <h1>Reset Password</h1>
          </div>
          <Form className="mt-5">
            <Form.Field>
              <label>Username</label>
              <input disabled placeholder={this.props.usernamelog} ref="user" />
            </Form.Field>
            <Form.Field>
              <label>Old Password</label>
              <input placeholder="" type="password" ref="oldpass" />
            </Form.Field>
            <Form.Field>
              <label>New Password</label>
              <input placeholder="" type="password" ref="newpass" />
            </Form.Field>
            <Form.Field>
              <label>Re-enter New Password</label>
              <input placeholder="" type="password" ref="confpass" />
            </Form.Field>
            <br />
            <Button fluid type="submit" onClick={this.handleChangePassClick}>
              Change Password
            </Button>
          </Form>
        </div>
      </Slide>
    );
  }
}

const MapstateToprops = state => {
  return {
    usernamelog: state.AuthLogin.username,
    userlog: state.AuthLogin.login,
    userid: state.AuthLogin.id,
    passuser: state.AuthLogin.password,
    role: state.AuthLogin.role
  };
};

export default connect(MapstateToprops, { ResetpassAction })(Resetpass);

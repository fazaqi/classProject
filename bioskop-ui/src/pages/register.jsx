import React, { Component } from "react";
import { Button, Checkbox, Form } from "semantic-ui-react";

class Register extends Component {
  state = {};
  render() {
    return (
      <div className="mx-auto mt-5" style={{ width: "50%" }}>
        <div className="text-center">
          <h1>REGISTER</h1>
        </div>
        <Form className="mt-5">
          <Form.Field>
            <label>Username</label>
            <input placeholder="" />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <input placeholder="" type="password" />
          </Form.Field>
          <Form.Field>
            <Checkbox label="I agree to the Terms and Conditions" />
          </Form.Field>
          <Button type="submit">Register</Button>
        </Form>
      </div>
    );
  }
}

export default Register;

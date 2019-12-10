import React, { Component } from "react";
import { connect } from "react-redux";
import Notfound from "./notfound";

class BeliTiket extends Component {
  state = {};
  render() {
    if (this.props.location.state && this.props.AuthLog) {
      return (
        <div>
          <p>Halaman Beli Tiket</p>
        </div>
      );
    }
    return <Notfound />;
  }
}

const MapstateToprops = state => {
  return {
    AuthLog: state.Auth.login
  };
};

export default connect(MapstateToprops)(BeliTiket);

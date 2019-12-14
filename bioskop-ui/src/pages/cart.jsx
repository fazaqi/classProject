import React, { Component } from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { Table } from "reactstrap";
import { APIURL } from "./../support/ApiUrl";
import Notfound from "./notfound";
// import { Redirect } from "react-router-dom";

class Cart extends Component {
  state = {
    datacart: null
  };

  componentDidMount() {
    Axios.get(
      `${APIURL}orders?_expand=movie&userId=${this.props.UserId}&bayar=false`
    )
      .then(res => {
        var datacart = res.data;
        // this.setState({ datacart: res.data });

        var qtyarr = [];
        res.data.forEach(element => {
          qtyarr.push(
            Axios.get(`${APIURL}ordersDetails?orderId=${element.id}`)
          );
        });
        var qtyfinal = [];
        Axios.all(qtyarr)
          .then(res1 => {
            res1.forEach(val => {
              qtyfinal.push(val.data);
            });
            var datafinal = [];
            datacart.forEach((val, index) => {
              datafinal.push({ ...val, qty: qtyfinal[index] });
            });
            this.setState({ datacart: datafinal });
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  }

  renderCart = () => {
    if (this.state.datacart !== null) {
      if (this.state.datacart.length === 0) {
        return <tr>Cart Empty</tr>;
      }
      return this.state.datacart.map((val, index) => {
        return (
          <tr key={index}>
            <td style={{ width: 100 }}>{index + 1}</td>
            <td style={{ width: 300 }}>{val.movie}</td>
            <td style={{ width: 100 }}>{val.jadwal}</td>
            <td style={{ width: 100 }}>{val.qty.length}</td>
            <td style={{ width: 100 }}>Details</td>
          </tr>
        );
      });
    }
  };

  render() {
    if (this.props.AuthLog === false) {
      return <Notfound />;
    }
    return (
      <div>
        <center>
          <Table style={{ width: 600 }}>
            <thead>
              <tr>
                <th style={{ width: 100 }}>No</th>
                <th style={{ width: 300 }}>Title</th>
                <th style={{ width: 100 }}>Jadwal</th>
                <th style={{ width: 100 }}>Qty</th>
                <th style={{ width: 100 }}>Detail</th>
              </tr>
            </thead>
            <tbody>{this.renderCart()}</tbody>
            <tfoot>
              <button>Checkout</button>
            </tfoot>
          </Table>
        </center>
      </div>
    );
  }
}

const MapstateToprops = state => {
  return {
    UserId: state.AuthLogin.id,
    AuthLog: state.AuthLogin.login
  };
};

export default connect(MapstateToprops)(Cart);

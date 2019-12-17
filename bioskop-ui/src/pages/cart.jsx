import React, { Component } from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { Table, Modal, ModalBody } from "reactstrap";
import { APIURL } from "./../support/ApiUrl";
import Notfound from "./notfound";
// import { Redirect } from "react-router-dom";
import { Button, Icon } from "semantic-ui-react";

class Cart extends Component {
  state = {
    datacart: null,
    detailseat: null,
    totalharga: 0,
    modalDetail: false
  };

  componentDidMount() {
    Axios.get(
      `${APIURL}orders?_expand=movie&userId=${this.props.UserId}&bayar=false`
    )
      .then(res => {
        var datacart = res.data;
        // this.setState({ datacart: res.data });
        console.log(res.data);

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
    console.log(this.state.datacart);
    if (this.state.datacart !== null) {
      if (this.state.datacart.length === 0) {
        return (
          <tr>
            <td> Cart Empty</td>
          </tr>
        );
      }
      return this.state.datacart.map((val, index) => {
        return (
          <tr key={index}>
            <td style={{ width: 100 }}>{index + 1}</td>
            <td style={{ width: 300 }}>{val.movie.title}</td>
            <td style={{ width: 100 }}>{val.jadwal}.00</td>
            <td style={{ width: 100 }}>{val.qty.length}</td>
            <td style={{ width: 100 }}>Rp {val.totalHarga}</td>
            <td style={{ width: 100 }}>
              <Button
                animated="vertical"
                color="blue"
                onClick={() => this.btnDetail(index)}
              >
                <Button.Content hidden>Details</Button.Content>
                <Button.Content visible>
                  <Icon name="question" />
                </Button.Content>
              </Button>
            </td>
          </tr>
        );
      });
    }
  };

  btnDetail = index => {
    this.setState({ modalDetail: true });
    var id = this.state.datacart[index].id;
    Axios.get(`${APIURL}ordersDetails?orderId=${id}`)
      .then(res => {
        var detailfilm = res.data;
        var seat = [];
        var row = [];
        detailfilm.map((val, index) => {
          seat.push(val.seat);
          row.push(val.row);
        });
        var alfabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var posisi = [];
        for (let i = 0; i < seat.length; i++) {
          for (let j = 0; j < alfabet.length; j++) {
            if (row[i] === j) {
              posisi.push(alfabet[j] + (seat[i] + 1));
            }
          }
        }
        this.setState({ detailseat: posisi });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    console.log(this.state.detailseat);
    if (this.props.UserId && this.props.userRole === "user") {
      return (
        <div>
          <Modal
            isOpen={this.state.modalDetail}
            toggle={() => this.setState({ modalDetail: false })}
          >
            <ModalBody className="text-center">
              <Table>
                <thead>
                  <tr>
                    <th>Total</th>
                    <th>Seat</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.detailseat ? (
                    <tr>
                      <th> {this.state.detailseat.length} </th>
                      <th>
                        {this.state.detailseat.map(val => {
                          return val + " ";
                        })}
                      </th>
                    </tr>
                  ) : null}
                </tbody>
              </Table>
              <br />
              <br />
              <br />
              <Button
                color="green"
                onClick={() => this.setState({ modalDetail: false })}
              >
                Close
              </Button>
            </ModalBody>
          </Modal>
          <center>
            <h1>Cart</h1>
            <br />
            <Table style={{ width: "50%" }}>
              <thead>
                <tr>
                  <th style={{ width: 100 }}>No</th>
                  <th style={{ width: 300 }}>Title</th>
                  <th style={{ width: 100 }}>Jadwal</th>
                  <th style={{ width: 100 }}>Qty</th>
                  <th style={{ width: 100 }}>Harga</th>
                  <th style={{ width: 100 }}>Detail</th>
                </tr>
              </thead>
              <tbody>{this.renderCart()}</tbody>
            </Table>
            <Button color="green">Checkout</Button>
          </center>
        </div>
      );
    }
    return <Notfound />;
  }
}

const MapstateToprops = state => {
  return {
    UserId: state.AuthLogin.id,
    AuthLog: state.AuthLogin.login,
    userRole: state.AuthLogin.role
  };
};

export default connect(MapstateToprops)(Cart);

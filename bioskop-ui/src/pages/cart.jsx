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
    modalDetail: false,
    totalHarga: 0,
    sudahbayar: false,
    tanggal: ""
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
        console.log(qtyarr);
        var qtyfinal = [];
        Axios.all(qtyarr)
          .then(res1 => {
            res1.forEach(val => {
              qtyfinal.push(val.data);
            });
            console.log(qtyfinal);
            var datafinal = [];
            datacart.forEach((val, index) => {
              datafinal.push({ ...val, qty: qtyfinal[index] });
            });
            console.log(datafinal);
            this.setState({ datacart: datafinal });
            // console.log(this.state.datacart);
            var totHrg = 0;
            this.state.datacart.map(val => {
              totHrg += val.totalHarga;
            });
            console.log(totHrg);
            this.setState({ totalHarga: totHrg });
            console.log(this.state.totalHarga);
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
    // console.log("masuk rendercart");
    console.log(this.state.datacart);
    if (this.state.datacart !== null) {
      if (this.state.datacart.length === 0) {
        return (
          <tr>
            <td> Cart Empty</td>
          </tr>
        );
      }
      // console.log(this.state.datacart[0].bayar);
      if (this.state.datacart[0].bayar === false) {
        console.log("masuk nih");
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
        detailfilm.map(val => {
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

  btnCheckout = () => {
    var x = new Date();
    var tanggalh =
      x.getDate() + "-" + (x.getMonth() + 1) + "-" + x.getFullYear();
    this.setState({ tanggal: tanggalh });
    // console.log(this.state.datacart);

    // console.log(typeof tanggal);

    if (this.state.datacart.length) {
      // console.log("masuk ubah bayar");
      //   //Untuk ubah bayar jadi true
      Axios.get(`${APIURL}orders?userId=${this.props.UserId}`)
        .then(res => {
          var aray = [];
          res.data.forEach((val, index) => {
            aray.push(
              Axios.patch(`${APIURL}orders/${val.id}`, {
                bayar: true
              })
            );
          });
          console.log(aray);
          Axios.all(aray)
            .then(res1 => {
              console.log(res1);
              this.setState({ sudahbayar: true });
              this.postTrans();
              // window.location.reload();
            })
            .catch(err1 => {
              console.log(err1);
            });
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  postTrans = () => {
    //Untuk Post ke Table Transaction
    if (this.state.sudahbayar === true) {
      var date = this.state.tanggal;
      var jumlahHarga = this.state.totalHarga;
      var userId = this.props.UserId;
      var datatrans = {
        date,
        jumlahHarga,
        userId
      };
      // console.log("masuksudahbayar");
      Axios.get(
        `${APIURL}orders?_expand=movie&userId=${this.props.UserId}&bayar=true`
      )
        .then(res => {
          var numpang = res.data;
          console.log(res.data);
          var arrr = [];
          res.data.forEach((val, index) => {
            arrr.push(Axios.post(`${APIURL}transactions`, datatrans));
          });
          console.log(arrr);
          // console.log(res.data[0]);
          //Axios All Post ke Transaction
          Axios.all(arrr)
            .then(res => {
              console.log("berhasil post ke transaction");
            })
            .catch(err5 => {
              console.log(err5);
            });
          ///////////////////////////////

          //Axios All Post ke TransDetail
          var qtytrans = [];
          res.data.forEach(element => {
            qtytrans.push(
              Axios.get(`${APIURL}ordersDetails?orderId=${element.id}`)
            );
          });
          console.log(qtytrans);
          var qtytransfinal = [];
          Axios.all(qtytrans)
            .then(res1 => {
              res1.forEach(val => {
                qtytransfinal.push(val.data);
              });
              console.log(qtytransfinal);
              var dataqtytrans = [];
              numpang.forEach((val, index) => {
                dataqtytrans.push({
                  ...val,
                  qty: qtytransfinal[index],
                  transactionsId: numpang[index].id
                });
              });
              console.log(dataqtytrans);

              var axidetail = [];
              dataqtytrans.forEach((val, index) => {
                axidetail.push(
                  Axios.post(
                    `${APIURL}transactionsDetails`,
                    dataqtytrans[index]
                  )
                );
              });

              Axios.all(axidetail)
                .then(res => {
                  console.log("berhasil post transdetail");
                  this.setState({ sudahbayar: false });
                  //masukin Action disini
                })
                .catch(err3 => {
                  console.log(err3);
                });
            })
            .catch(err1 => {
              console.log(err1);
            });
          //////////////////////////////////////////////////////
        })
        .catch(err => {});
    }
  };

  render() {
    console.log(this.state.tanggal);
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
            {/* <Button onClick={this.btnCheckout} color="green">
              Checkout
            </Button> */}

            <Button
              animated="vertical"
              color="green"
              onClick={this.btnCheckout}
            >
              <Button.Content hidden>Checkout</Button.Content>
              <Button.Content visible>
                Total Harga = Rp {this.state.totalHarga}
              </Button.Content>
            </Button>
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

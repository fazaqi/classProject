import React, { Component } from "react";
import { connect } from "react-redux";
import Notfound from "./notfound";
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";
import Numeral from "numeral";
import { Redirect } from "react-router-dom";
import Swal from "sweetalert2";
// import { Button } from "semantic-ui-react";

class BeliTiket extends Component {
  state = {
    datamovie: {},
    seats: 260,
    baris: 0,
    booked: [],
    loading: true,
    jam: 12,
    pilihan: [],
    harga: 0,
    jumlahtiket: 0,
    redirecthome: false
  };

  componentDidMount() {
    console.log(this.props.userRole);
    if (
      this.props.userRole === "admin" ||
      this.props.location.state === undefined ||
      this.props.AuthLog === false
    ) {
      return <Notfound />;
    }
    this.onJamChange();
  }

  onJamChange = () => {
    var studioId = this.props.location.state.studioId;
    var movieId = this.props.location.state.id;
    Axios.get(`${APIURL}studios/${studioId}`)
      .then(res1 => {
        Axios.get(`${APIURL}orders?movieId=${movieId}&jadwal=${this.state.jam}`)
          .then(res2 => {
            var arrAxios = [];
            res2.data.forEach(val => {
              arrAxios.push(
                Axios.get(`${APIURL}ordersDetails?orderId=${val.id}`)
              );
            });
            var arrAxios2 = [];
            Axios.all(arrAxios)
              .then(res3 => {
                console.log(res3);
                res3.forEach(val => {
                  arrAxios2.push(...val.data);
                });
                console.log(arrAxios2);
                this.setState({
                  datamovie: this.props.location.state,
                  seats: res1.data.jumlahKursi,
                  baris: res1.data.jumlahKursi / 20,
                  booked: arrAxios2,
                  loading: false
                });
              })
              .catch(err3 => {
                console.log(err3);
              });
          })
          .catch(err2 => {
            console.log(err2);
          });
      })
      .catch(err1 => {
        console.log(err1);
      });

    // console.log(studioId);
  };

  onBtnjamClick = val => {
    this.setState({ jam: val, pilihan: [] });
    this.onJamChange();
  };

  onPilihSeatClick = (row, seat) => {
    var seatSelected = this.state.pilihan;
    seatSelected.push({ row: row, seat });
    this.setState({ pilihan: seatSelected });
  };

  onCancelSeatClick = (row, seat) => {
    var seatPilihan = this.state.pilihan;
    var arr = [];
    for (let i = 0; i < seatPilihan.length; i++) {
      if (seatPilihan[i].row !== row || seatPilihan[i].seat !== seat) {
        arr.push(seatPilihan[i]);
      }
    }
    this.setState({ pilihan: arr });
  };

  renderSeat = () => {
    var arr = [];
    for (let i = 0; i < this.state.baris; i++) {
      arr.push([]);
      for (let j = 0; j < this.state.seats / this.state.baris; j++) {
        arr[i].push(1); //angka 1 berarti seat available
      }
    }
    console.log(this.state.booked);
    for (let j = 0; j < this.state.booked.length; j++) {
      arr[this.state.booked[j].row][this.state.booked[j].seat] = 3; //angka 3 berarti seat sudah booked
    }

    for (let a = 0; a < this.state.pilihan.length; a++) {
      arr[this.state.pilihan[a].row][this.state.pilihan[a].seat] = 2; //angka 2 berarti seat di klik oleh user
    }

    var alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase();
    var jsx = arr.map((val, index) => {
      return (
        <div key={index}>
          {val.map((val1, i) => {
            if (val1 === 3) {
              return (
                <button
                  key={i}
                  disabled
                  className="rounded btn-disble mr-2 mt-2 bg-danger text-center"
                >
                  {/* ini seat yang sudah booked*/}
                  {alphabet[index] + (i + 1)}
                </button>
              );
            } else if (val1 === 2) {
              return (
                <button
                  key={i}
                  className="rounded btn-order mr-2 mt-2 btn-pilih text-center"
                  onClick={() => this.onCancelSeatClick(index, i)}
                >
                  {/* ini seat yang di klik user*/}
                  {alphabet[index] + (i + 1)}
                </button>
              );
            }
            return (
              <button
                key={i}
                className="rounded btn-order mr-2 mt-2 text-center"
                onClick={() => this.onPilihSeatClick(index, i)}
              >
                {/* ini seat yang available*/}
                {alphabet[index] + (i + 1)}
              </button>
            );
          })}
        </div>
      );
    });
    return jsx;
  };

  renderButton = () => {
    return this.state.datamovie.jadwal.map((val, index) => {
      if (this.state.jam === val) {
        return (
          <button key={index} className="mx-2 btn btn-outline-primary" disabled>
            {val}.00
          </button>
        );
      }
      return (
        <button
          key={index}
          className="mx-2 btn btn-outline-primary"
          onClick={() => this.onBtnjamClick(val)}
        >
          {val}.00
        </button>
      );
    });
  };

  renderHargaQty = () => {
    var qty = this.state.pilihan.length;
    var harga = qty * 25000;
    return (
      <div>
        {qty} Ticket X {"Rp" + Numeral(25000).format("0.0")} =
        {"Rp" + Numeral(harga).format("0.0")}
      </div>
    );
  };

  onOrderClick = () => {
    var userId = this.props.userId;
    var movieId = this.state.datamovie.id;
    var pilihan = this.state.pilihan;
    var jadwal = this.state.jam;
    var totalHarga = this.state.pilihan.length * 25000;
    var bayar = false;
    var dataorders = {
      userId,
      movieId,
      totalHarga,
      jadwal,
      bayar
    };
    console.log(dataorders);
    Axios.post(`${APIURL}orders`, dataorders)
      .then(res => {
        var dataOrderDetail = [];
        pilihan.forEach(val => {
          dataOrderDetail.push({
            orderId: res.data.id,
            seat: val.seat,
            row: val.row
          });
        });
        var dataOrderDetail2 = [];
        dataOrderDetail.forEach(val => {
          dataOrderDetail2.push(Axios.post(`${APIURL}ordersDetails`, val));
        });
        Axios.all(dataOrderDetail2)
          .then(res1 => {
            console.log(res1);
            Swal.fire({
              title: "Are you sure you want to book this ticket?",
              icon: "question",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              cancelButtonText: "No",
              confirmButtonText: "Yes"
            }).then(result => {
              if (result.value) {
                Swal.fire({
                  icon: "success",
                  title: "Tickets Booked!",
                  showConfirmButton: false,
                  timer: 1500,
                  timerProgressBar: true
                });
                this.setState({ redirecthome: true });
              }
            });
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    // console.log(this.props.location.state);
    if (
      this.props.location.state &&
      this.props.AuthLog &&
      this.props.userRole === "user"
    ) {
      if (this.state.redirecthome) {
        return <Redirect to="/" />;
      }
      return (
        <div>
          <center className="mt-1">
            {this.state.loading ? null : this.renderButton()}
            <br />
            {/* <div>
              {this.state.pilihan.length ? (
                <button className="btn btn-primary"> Order </button>
              ) : null}
            </div>
            <br />

            {this.state.pilihan.length ? this.renderHargaQty() : null} */}
          </center>
          <hr />

          <div className="d-flex justify-content-center mt-4">
            <div>{this.state.loading ? null : this.renderSeat()}</div>
          </div>
          <hr />
          <center>
            <div>
              {this.state.pilihan.length ? (
                <button onClick={this.onOrderClick} className="btn btn-primary">
                  {" "}
                  Order{" "}
                </button>
              ) : null}
            </div>
            <br />

            {this.state.pilihan.length ? this.renderHargaQty() : null}
          </center>
        </div>
      );
    }
    return <Notfound />;
  }
}

const MapstateToprops = state => {
  return {
    AuthLog: state.AuthLogin.login,
    userId: state.AuthLogin.id,
    userRole: state.AuthLogin.role
  };
};

export default connect(MapstateToprops)(BeliTiket);

///belum ada proteksi ke notfound
// belum bisa munculin yg booked
// axios post belum work

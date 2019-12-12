import React, { Component } from "react";
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

class MovieDetail extends Component {
  state = {
    datadetailfilm: {},
    notlogin: false,
    buyTicket: false
  };

  componentDidMount() {
    console.log(this.props.match);
    Axios.get(`${APIURL}movies/${this.props.match.params.id}`)
      .then(res => {
        // console.log(res.data);
        this.setState({ datadetailfilm: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  btnBuy = () => {
    if (this.props.AuthLog) {
      this.setState({ buyTicket: true });
    } else {
      this.setState({ notlogin: true });
    }
  };

  render() {
    if (this.state.notlogin) {
      return <Redirect to="/login" />;
    }

    if (this.state.buyTicket) {
      return (
        <Redirect
          to={{ pathname: "/belitiket", state: this.state.datadetailfilm }}
        />
      );
    }
    return (
      <div>
        <div
          className="row p-3 mx-3 my-3"
          style={{ border: "1px solid black" }}
        >
          <div
            className="p-3 m-0"
            style={{
              fontSize: "20px",
              fontWeight: "500",
              width: "100%"
              //   border: "1px solid black"
            }}
          >
            <p>NOW PLAYING</p>
          </div>
          <div className="col-md-3">
            <img
              src={this.state.datadetailfilm.image}
              height="450px"
              alt="film"
            />
          </div>
          <div //kontainer kanan
            className="row"
            style={{ border: "1px solid black", width: "70%" }}
          >
            <div //div title
              className="row"
              style={{ border: "1px solid yellow", width: "100%" }}
            >
              {this.state.datadetailfilm.title}
            </div>
            <div
              className="col-2"
              style={{ border: "1px solid black", width: "10%" }}
            >
              {/*div kiri*/}
              <p>
                Genre Film <span style={{ textAlign: "right" }}>:</span>
              </p>
              <p>Sutradara</p>
              <p>Produksi</p>
              <p>Sinopsis</p>
            </div>
            <div className="col">
              {/*div kanan*/}
              <div>
                <p>{this.state.datadetailfilm.genre}</p>
              </div>
              <div>
                <p>{this.state.datadetailfilm.sutradara}</p>
              </div>
              <div>
                <p>{this.state.datadetailfilm.produksi}</p>
              </div>
              <div>
                <p>{this.state.datadetailfilm.sinopsis}</p>
              </div>
              <div>
                <button onClick={this.btnBuy}>BELI</button>
              </div>
            </div>
          </div>
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

export default connect(MapstateToprops)(MovieDetail);

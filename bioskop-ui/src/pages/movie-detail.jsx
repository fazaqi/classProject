import React, { Component } from "react";
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Modal, ModalBody } from "reactstrap";
import { Button, Icon } from "semantic-ui-react";

class MovieDetail extends Component {
  state = {
    datadetailfilm: {},
    notlogin: false,
    buyTicket: false,
    toLogin: false,
    modaltrailer: false
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
      this.setState({ toLogin: true });
    }
    console.log(this.state.toLogin);
  };

  render() {
    console.log(this.state.datadetailfilm);
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
        <Modal
          isOpen={this.state.toLogin}
          toggle={() => this.setState({ toLogin: false })}
        >
          <ModalBody className="text-center">
            You Must Login to Continue <br />
            <br />
            <br />
            <Button
              color="green"
              onClick={() => this.setState({ notlogin: true })}
            >
              Login
            </Button>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={this.state.modaltrailer}
          toggle={() => this.setState({ modaltrailer: false })}
          size="xl"
          centered
          external={
            <button
              className="close"
              style={{ position: "absolute", top: "15px", right: "15px" }}
              onClick={() => this.setState({ modaltrailer: false })}
            >
              &times;
            </button>
          }
        >
          <div></div>
          <iframe
            title="trailer"
            width="100%"
            height="590px"
            src={this.state.datadetailfilm.trailer}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen="allowfullscreen"
          ></iframe>
        </Modal>

        <div className="p-3">
          <h2>NOW PLAYING</h2>
        </div>
        <div className="row">
          <div className="col-md-4">
            <img
              src={this.state.datadetailfilm.image}
              alt="poster"
              height="500px"
            />
          </div>
          <div className="col-md-8">
            <h3>{this.state.datadetailfilm.title}</h3>

            <br />
            <hr />
            <div>
              <ul>
                <li>
                  <span>Genre Film </span>: {this.state.datadetailfilm.genre}
                </li>
                <li>
                  <span>Sutradata </span>: {this.state.datadetailfilm.sutradara}
                </li>
                <li>
                  <span>Produksi </span>: {this.state.datadetailfilm.produksi}
                </li>
              </ul>
            </div>
            <hr />
            <div>
              <h3>Sinopsis :</h3>
              <p>{this.state.datadetailfilm.sinopsis}</p>
            </div>
            <br />
            <div>
              <Button
                animated="vertical"
                size="medium"
                style={{ width: "150px" }}
                className="mr-3"
                color="yellow"
                onClick={() => this.setState({ modaltrailer: true })}
              >
                <Button.Content hidden>Play Trailer</Button.Content>
                <Button.Content visible>
                  <Icon name="film" />
                </Button.Content>
              </Button>
              <Button
                animated="vertical"
                size="medium"
                style={{ width: "150px" }}
                color="blue"
                onClick={this.btnBuy}
              >
                <Button.Content hidden>Buy Ticket</Button.Content>
                <Button.Content visible>
                  <Icon name="ticket" />
                </Button.Content>
              </Button>
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

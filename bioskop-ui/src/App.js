import React, { Component } from "react";
import "./App.css";
import Header from "./components/header";
import Home from "./pages/home";
import ManageAdmin from "./pages/manageAdmin";
import Login from "./pages/login";
import MovieDetail from "./pages/movie-detail";
import BeliTiket from "./pages/belitiket";
import Register from "./pages/register";
import Cart from "./pages/cart";
import Notfound from "./pages/notfound";
import Axios from "axios";
import { Switch, Route } from "react-router-dom";
import { APIURL } from "./support/ApiUrl";
import { LoginSuccessAction } from "./redux/actions";
import { connect } from "react-redux";
import Resetpass from "./pages/resetPass";
import Managestudio from "./pages/manageStudio";
import { Jumlahcart } from "./redux/actions";
import History from "./pages/history";

class App extends Component {
  state = {
    loading: true
  };

  componentDidMount() {
    var id = localStorage.getItem("dino");
    console.log(id);
    Axios.get(`${APIURL}users/${id}`)
      .then(res => {
        this.props.LoginSuccessAction(res.data);
        // console.log("masuk app js");
        /////////////////////////////////////////
        Axios.get(`${APIURL}orders?userId=${res.data.id}`)
          .then(res1 => {
            // console.log(res1.data.length);
            this.props.Jumlahcart(res1.data.length);
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        this.setState({ loading: false });
      });

    // Axios.get(`${APIURL}orders?userId=`);
  }

  render() {
    if (this.state.loading) {
      return <div>Loading...</div>;
    }

    if (this.props.user) {
      Axios.get(`${APIURL}orders?userId=${this.props.user}`)
        .then(res1 => {
          // console.log(res1.data.length);
          this.props.Jumlahcart(res1.data.length);
        })
        .catch(err => {
          console.log(err);
        });
    }
    return (
      <div>
        <Header />
        <Switch>
          <Route path={"/"} exact component={Home} />
          <Route path={"/manageadmin"} exact component={ManageAdmin} />
          <Route path={"/login"} exact component={Login} />
          <Route path={"/moviedetail/:id"} exact component={MovieDetail} />
          <Route path="/belitiket" exact component={BeliTiket} />
          <Route path="/register" exact component={Register} />
          <Route path="/cart" exact component={Cart} />
          <Route path="/resetpass" exact component={Resetpass} />
          <Route path="/managestudio" exact component={Managestudio} />
          <Route path="/history" exact component={History} />
          <Route path={"/*"} component={Notfound} />
        </Switch>
      </div>
    );
  }
}

const MapstateToprops = state => {
  return {
    AuthLog: state.AuthLogin.login,
    user: state.AuthLogin.id
  };
};

export default connect(MapstateToprops, { LoginSuccessAction, Jumlahcart })(
  App
);

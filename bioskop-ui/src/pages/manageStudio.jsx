import React, { Component } from "react";
import { Table, Button, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import Notfound from "./notfound";
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";

class Managestudio extends Component {
  state = {
    datastudio: []
  };

  componentDidMount() {
    Axios.get(`${APIURL}studios`)
      .then(res => {
        // console.log(res.data);
        this.setState({ datastudio: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  renderTable = () => {
    return this.state.datastudio.map((val, index) => {
      return (
        <Table.Row key={index}>
          <Table.Cell>{index + 1}</Table.Cell>
          <Table.Cell>{val.nama}</Table.Cell>
          <Table.Cell>{val.jumlahKursi}</Table.Cell>
          <Table.Cell>
            <Button animated="vertical" color="teal" size="tiny">
              <Button.Content hidden>Edit</Button.Content>
              <Button.Content visible>
                <Icon name="cog" />
              </Button.Content>
            </Button>
          </Table.Cell>
        </Table.Row>
      );
    });
  };

  render() {
    if (this.props.Auth && this.props.AuthRole === "admin") {
      return (
        <div>
          <center>
            <h1 className="my-4">Manage Studio</h1>

            {/* <br /> */}
            <Table celled style={{ width: "50%" }}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>No.</Table.HeaderCell>
                  <Table.HeaderCell>Nama Studio</Table.HeaderCell>
                  <Table.HeaderCell>Jumlah Seat</Table.HeaderCell>
                  <Table.HeaderCell>Action</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>{this.renderTable()}</Table.Body>
            </Table>
          </center>
        </div>
      );
    }
    return <Notfound />;
  }
}

const MapstateToprops = state => {
  return {
    Auth: state.AuthLogin.login,
    AuthRole: state.AuthLogin.role
  };
};

export default connect(MapstateToprops)(Managestudio);

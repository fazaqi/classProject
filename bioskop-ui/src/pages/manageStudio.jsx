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
            <Button animated="vertical" color="teal">
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
          </center>
          {/* <br /> */}
          <Table celled className="tabel">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>No.</Table.HeaderCell>
                <Table.HeaderCell>Nama Studio</Table.HeaderCell>
                <Table.HeaderCell>Jumlah Seat</Table.HeaderCell>
                <Table.HeaderCell>Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>{this.renderTable()}</Table.Body>

            {/* <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan="3">
                <Menu floated="right" pagination>
                  <Menu.Item as="a" icon>
                    <Icon name="chevron left" />
                  </Menu.Item>
                  <Menu.Item as="a">1</Menu.Item>
                  <Menu.Item as="a">2</Menu.Item>
                  <Menu.Item as="a">3</Menu.Item>
                  <Menu.Item as="a">4</Menu.Item>
                  <Menu.Item as="a" icon>
                    <Icon name="chevron right" />
                  </Menu.Item>
                </Menu>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer> */}
          </Table>
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

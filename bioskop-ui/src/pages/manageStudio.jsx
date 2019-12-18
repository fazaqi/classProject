import React, { Component } from "react";
import { Table, Button, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import Notfound from "./notfound";
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

class Managestudio extends Component {
  state = {
    datastudio: [],
    modaledit: false,
    indexedit: 0
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
            <Button
              animated="vertical"
              color="teal"
              size="tiny"
              onClick={() =>
                this.setState({ modaledit: true, indexedit: index })
              }
            >
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
    const { datastudio, indexedit } = this.state;
    const { length } = datastudio;
    if (length === 0) {
      return <div>loading</div>;
    }
    if (this.props.Auth && this.props.AuthRole === "admin") {
      return (
        <div>
          <Modal
            isOpen={this.state.modaledit}
            toggle={() => this.setState({ modaledit: false })}
          >
            <ModalHeader>Edit Data {datastudio[indexedit].nama}</ModalHeader>
            <ModalBody>
              <input
                type="text"
                defaultValue={this.state.datastudio[indexedit].nama}
                ref="editnama"
                placeholder="nama studio"
                className="form-control mt-2"
              />
              <input
                type="text"
                defaultValue={datastudio[indexedit].jumlahKursi}
                ref="editkursi"
                placeholder="jumlah Seat"
                className="form-control mt-2"
              />
            </ModalBody>
            <ModalFooter>
              <Button color="green">Save</Button>
              <Button
                color="yellow"
                onClick={() => this.setState({ modaledit: false })}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
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
            <Button
              animated="vertical"
              color="green"
              size="large"
              style={{ width: "250px" }}
            >
              <Button.Content hidden>Add Studio</Button.Content>
              <Button.Content visible>
                <Icon name="add" />
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
    Auth: state.AuthLogin.login,
    AuthRole: state.AuthLogin.role
  };
};

export default connect(MapstateToprops)(Managestudio);

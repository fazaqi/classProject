import React, { Component } from "react";
import { Icon, Label, Menu, Table } from "semantic-ui-react";
import { connect } from "react-redux";

class History extends Component {
  state = {
    datahistory: []
  };

  componentDidMount() {
    console.log(this.props.role);
  }

  renderHistory = () => {
    if (this.state.datahistory !== null) {
      if (this.state.datahistory.length === 0) {
        return (
          <Table.Row>
            <Table.Cell colspan="5" className="text-center">
              Data History Kosong
            </Table.Cell>
          </Table.Row>
        );
      }
      /////masukin program render dibawah sini
    }
  };

  render() {
    return (
      <div>
        <center>
          <h1 className="mt-4 mb-4">Transaction History</h1>
          <Table celled structured style={{ width: "60%" }}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>No</Table.HeaderCell>
                <Table.HeaderCell>Nama Film</Table.HeaderCell>
                <Table.HeaderCell>Tanggal</Table.HeaderCell>
                <Table.HeaderCell>Qty</Table.HeaderCell>
                <Table.HeaderCell>Details</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>{this.renderHistory()}</Table.Body>
          </Table>
        </center>
      </div>
    );
  }
}

const MapstateToprops = state => {
  return {
    role: state.AuthLogin.role
  };
};

export default connect(MapstateToprops)(History);

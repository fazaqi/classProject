import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import Notfound from "./notfound";
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";
import { Modal, ModalBody } from "reactstrap";

class History extends Component {
  state = {
    datahistory: [],
    datadetailhistory: [],
    modalDetail: false,
    indexdetail: 0
  };

  componentDidMount() {
    console.log(this.props.role);
    Axios.get(`${APIURL}transactions?userId=${this.props.userid}`)
      .then(res => {
        // console.log(res.data);
        this.setState({ datahistory: res.data });
        // console.log(this.state.datahistory[0].id);
        Axios.get(
          `${APIURL}transactionsDetails?transactionsId=${this.state.datahistory[0].id}`
        )
          .then(res => {
            // console.log(res.data);
            this.setState({ datadetailhistory: res.data });
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  }

  renderHistory = () => {
    if (this.state.datahistory !== null) {
      if (this.state.datahistory.length === 0) {
        return (
          <Table.Row>
            <Table.Cell colSpan="4" className="text-center">
              Data History Kosong
            </Table.Cell>
          </Table.Row>
        );
      }
      /////masukin program render dibawah sini
      return this.state.datahistory.map((val, index) => {
        return (
          <Table.Row key={index}>
            <Table.Cell>{index + 1}</Table.Cell>
            <Table.Cell>{val.date}</Table.Cell>
            <Table.Cell>{val.jumlahHarga}</Table.Cell>
            <Table.Cell>
              <Button onClick={() => this.setState({ modalDetail: true })}>
                Details
              </Button>
            </Table.Cell>
          </Table.Row>
        );
      });
    }
  };

  renderDetail = () => {
    return this.state.datadetailhistory.map((val, index) => {
      return (
        <Table.Row key={index}>
          <Table.Cell>{index + 1}</Table.Cell>
          <Table.Cell>{val.movie.title}</Table.Cell>
          <Table.Cell>{val.qty.length}</Table.Cell>
          <Table.Cell>Rp {val.totalHarga}</Table.Cell>
        </Table.Row>
      );
    });
  };

  render() {
    if (this.props.role !== "user") {
      return <Notfound />;
    }
    return (
      <div>
        <Modal
          isOpen={this.state.modalDetail}
          toggle={() => this.setState({ modalDetail: false })}
        >
          <ModalBody className="text-center">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>No</Table.HeaderCell>
                  <Table.HeaderCell>Judul Film</Table.HeaderCell>
                  <Table.HeaderCell>Jumlah Tiket</Table.HeaderCell>
                  <Table.HeaderCell>Harga</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>{this.renderDetail()}</Table.Body>
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
          <h1 className="mt-4 mb-4">Transaction History</h1>
          <Table celled structured style={{ width: "80%" }}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>No</Table.HeaderCell>
                <Table.HeaderCell>Tanggal</Table.HeaderCell>
                <Table.HeaderCell>Total Harga</Table.HeaderCell>
                <Table.HeaderCell>Rincian</Table.HeaderCell>
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
    role: state.AuthLogin.role,
    userid: state.AuthLogin.id
  };
};

export default connect(MapstateToprops)(History);

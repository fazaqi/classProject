import React, { Component } from "react";
import { Table, Button, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import Notfound from "./notfound";
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Swal from "sweetalert2";

class Managestudio extends Component {
  state = {
    datastudio: [],
    modaledit: false,
    modaldel: false,
    modaladd: false,
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
              className="mr-3"
              onClick={() =>
                this.setState({ modaledit: true, indexedit: index })
              }
            >
              <Button.Content hidden>Edit</Button.Content>
              <Button.Content visible>
                <Icon name="cog" />
              </Button.Content>
            </Button>
            <Button
              animated="vertical"
              color="red"
              size="tiny"
              onClick={() => this.btnDel(index)}
            >
              <Button.Content hidden>Delete</Button.Content>
              <Button.Content visible>
                <Icon name="trash" />
              </Button.Content>
            </Button>
          </Table.Cell>
        </Table.Row>
      );
    });
  };

  btnDel = index => {
    var iddel = this.state.datastudio[index].id;
    // console.log(iddel);
    Swal.fire({
      title: "Do you want delete " + this.state.datastudio[index].nama + " ?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yessssss!"
    }).then(result => {
      if (result.value) {
        Swal.fire("Deleted!", "Your studio has been deleted.", "success");
        Axios.delete(`${APIURL}studios/${iddel}`)
          .then(() => {
            Axios.get(`${APIURL}studios/`)
              .then(res => {
                this.setState({ datastudio: res.data });
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  };

  onSaveAddData = () => {
    var nama = this.refs.namastudio.value;
    var jumlahKursi = parseInt(this.refs.seat.value);
    var data = {
      nama,
      jumlahKursi
    };
    // console.log(data);
    if (nama === "" || jumlahKursi === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Data Gaboleh Ada Yang Kosong!"
      });
    } else {
      Axios.post(`${APIURL}studios`, data)
        .then(() => {
          Axios.get(`${APIURL}studios`)
            .then(res => {
              this.setState({ datastudio: res.data, modaladd: false });
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Your Studio has been Added!",
                showConfirmButton: false,
                timer: 1500
              });
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  onSaveEdit = () => {
    var nama = this.refs.editnama.value;
    var jumlahKursi = parseInt(this.refs.editkursi.value);
    var id = this.state.datastudio[this.state.indexedit].id;
    var data = {
      nama,
      jumlahKursi
    };
    // console.log(typeof jumlahKursi);
    // console.log(data, id);
    Axios.put(`${APIURL}studios/${id}`, data)
      .then(() => {
        Axios.get(`${APIURL}studios`)
          .then(res => {
            this.setState({ datastudio: res.data, modaledit: false });
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Your Studio has been Updated!",
              showConfirmButton: false,
              timer: 1500
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
    const { datastudio, indexedit } = this.state;
    const { length } = datastudio;
    if (length === 0) {
      return <div>loading</div>;
    }
    if (this.props.Auth && this.props.AuthRole === "admin") {
      return (
        <div>
          {/* Modal Edit */}
          <Modal
            isOpen={this.state.modaledit}
            toggle={() => this.setState({ modaledit: false })}
          >
            <ModalHeader>Edit Data {datastudio[indexedit].nama}</ModalHeader>
            <ModalBody>
              <input
                type="text"
                defaultValue={datastudio[indexedit].nama}
                ref="editnama"
                placeholder="nama studio"
                className="form-control mt-2"
              />
              <input
                type="number"
                defaultValue={datastudio[indexedit].jumlahKursi}
                ref="editkursi"
                placeholder="jumlah Seat"
                className="form-control mt-2"
              />
            </ModalBody>
            <ModalFooter>
              <Button color="green" onClick={this.onSaveEdit}>
                Save
              </Button>
              <Button
                color="yellow"
                onClick={() => this.setState({ modaledit: false })}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
          {/* Modal Add */}
          <Modal
            isOpen={this.state.modaladd}
            toggle={() => this.setState({ modaladd: false })}
          >
            <ModalHeader>Add Studio</ModalHeader>
            <ModalBody>
              <input
                type="text"
                ref="namastudio"
                placeholder="Nama Studio"
                className="form-control mt-2"
              />
              <input
                type="number"
                ref="seat"
                placeholder="Jumlah Kursi"
                className="form-control mt-2"
              />
            </ModalBody>
            <ModalFooter className="align-items-center">
              <Button color="green" onClick={this.onSaveAddData}>
                Save
              </Button>
              <Button
                color="yellow"
                onClick={() => this.setState({ modaladd: false })}
              >
                Cancel
              </Button>
              {/* <button onClick={this.onSaveAddDataClick}>Save</button>
            <button onClick={() => this.setState({ modaladd: false })}>
              Cancel
            </button> */}
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
                  <Table.HeaderCell style={{ width: "180px" }}>
                    Action
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>{this.renderTable()}</Table.Body>
            </Table>
            <Button
              animated="vertical"
              color="green"
              size="large"
              style={{ width: "250px" }}
              onClick={() => this.setState({ modaladd: true })}
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

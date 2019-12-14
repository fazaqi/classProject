import React, { Component } from "react";
import Axios from "axios";
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow
} from "@material-ui/core";
import { APIURL } from "../support/ApiUrl";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Fade from "react-reveal/Fade";
import Swal from "sweetalert2";
import { Button } from "semantic-ui-react";
import { connect } from "react-redux";
import Notfound from "./notfound";

class ManageAdmin extends Component {
  state = {
    datafilm: [],
    readmoreselected: -1,
    modaladd: false,
    modaledit: false,
    indexedit: 0,
    indexdel: 0,
    jadwal: [12, 14, 16, 18, 20, 22]
  };

  componentDidMount() {
    Axios.get(`${APIURL}movies`)
      .then(res => {
        // console.log(res.data)
        this.setState({ datafilm: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  onUpdateDataclick = () => {
    var jadwaltemplate = this.state.jadwal;
    var jadwal = [];
    var id = this.state.datafilm[this.state.indexedit].id;
    for (var i = 0; i < jadwaltemplate.length; i++) {
      if (this.refs[`editjadwal${i}`].checked) {
        jadwal.push(jadwaltemplate[i]);
      }
    }
    var iniref = this.refs;
    var title = iniref.edittitle.value;
    var image = iniref.editimage.value;
    var sinopsis = iniref.editsinopsis.value;
    var sutradara = iniref.editsutradara.value;
    var genre = iniref.editgenre.value;
    var durasi = iniref.editdurasi.value;
    var trailer = iniref.edittrailer.value;
    var studioId = iniref.editstudio.value;
    var produksi = iniref.editproduksi.value;
    var data = {
      title,
      image,
      sinopsis,
      sutradara,
      genre,
      durasi,
      produksi,
      jadwal,
      trailer,
      studioId
    };
    console.log(id);
    Axios.put(`${APIURL}movies/${id}`, data)
      .then(() => {
        Axios.get(`${APIURL}movies/`)
          .then(res => {
            this.setState({ datafilm: res.data, modaledit: false });
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Your movie has been Updated!",
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

  renderEditCheckbox = indexedit => {
    var indexarr = [];
    var datafilmedit = this.state.datafilm[indexedit].jadwal;
    // console.log(datafilmedit);
    // console.log(this.state.jadwal)
    // console.log(this.state.jadwal.indexOf(datafilmedit[1]))
    // datafilmedit.forEach((val)=>{
    //     indexarr.push(this.state.jadwal.indexOf(val))
    // })
    for (var i = 0; i < datafilmedit.length; i++) {
      for (var j = 0; j < this.state.jadwal.length; j++) {
        if (datafilmedit[i] === this.state.jadwal[j]) {
          indexarr.push(j);
        }
      }
    }
    var checkbox = this.state.jadwal;
    var checkboxnew = [];
    checkbox.forEach(val => {
      checkboxnew.push({ jam: val, tampiledit: false });
    });
    indexarr.forEach(val => {
      checkboxnew[val].tampiledit = true;
    });
    return checkboxnew.map((val, index) => {
      if (val.tampiledit) {
        return (
          <div key={index}>
            <input
              type="checkbox"
              defaultChecked
              ref={`editjadwal${index}`}
              value={val.jam}
            />
            <span className="mr-2">{val.jam}.00</span>
          </div>
        );
      } else {
        return (
          <div key={index}>
            <input type="checkbox" ref={`editjadwal${index}`} value={val.jam} />
            <span className="mr-2">{val.jam}.00</span>
          </div>
        );
      }
    });
  };

  renderAddCheckbox = () => {
    return this.state.jadwal.map((val, index) => {
      return (
        <div key={index}>
          <input type="checkbox" ref={`jadwal${index}`} />
          <span className="mr-2">{val}.00</span>
        </div>
      );
    });
  };

  delClick = index => {
    // console.log(index);
    // this.setState({ indexdel: index });
    var iddel = this.state.datafilm[index].id;
    // var coba = this.state.datafilm[index].title
    // console.log(coba);
    Swal.fire({
      title: "Do you want delete " + this.state.datafilm[index].title + " ?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yessssss!"
    }).then(result => {
      if (result.value) {
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
        Axios.delete(`${APIURL}movies/${iddel}`)
          .then(() => {
            Axios.get(`${APIURL}movies/`)
              .then(res => {
                this.setState({ datafilm: res.data });
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
  //////////////////////////////////////

  onSaveAddDataClick = () => {
    var jadwaltemplate = [12, 14, 16, 18, 20, 22];
    var jadwal = [];
    for (var i = 0; i < jadwaltemplate.length; i++) {
      if (this.refs[`jadwal${i}`].checked) {
        jadwal.push(jadwaltemplate[i]);
      }
    }
    var iniref = this.refs;
    var title = iniref.title.value;
    var image = iniref.image.value;
    var sinopsis = iniref.sinopsis.value;
    var sutradara = iniref.sutradara.value;
    var genre = iniref.genre.value;
    var durasi = iniref.durasi.value;
    var produksi = iniref.produksi.value;
    var trailer = iniref.trailer.value;
    var data = {
      title: title,
      image,
      sinopsis,
      sutradara,
      genre,
      durasi,
      produksi,
      jadwal,
      trailer
    };
    if (
      title === "" ||
      image === "" ||
      sinopsis === "" ||
      sutradara === "" ||
      genre === "" ||
      durasi === "" ||
      produksi === "" ||
      jadwal === "" ||
      trailer === ""
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Data Gaboleh Ada Yang Kosong!"
      });
    } else {
      Axios.post(`${APIURL}movies`, data)
        .then(() => {
          Axios.get(`${APIURL}movies`)
            .then(res => {
              this.setState({ datafilm: res.data, modaladd: false });
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Your movie has been Added!",
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

  renderMovies = () => {
    return this.state.datafilm.map((val, index) => {
      return (
        <TableRow key={index}>
          <TableCell>{index + 1}</TableCell>
          <TableCell>{val.title}</TableCell>
          <TableCell>
            <img src={val.image} alt={"gambar"} height="200px" />
          </TableCell>
          {this.state.readmoreselected === index ? (
            <TableCell style={{ width: "300px" }}>
              {val.sinopsis}
              <span
                className="readmore"
                onClick={() => this.setState({ readmoreselected: -1 })}
              >
                Read less
              </span>
            </TableCell>
          ) : (
            <TableCell style={{ width: "300px" }}>
              {val.sinopsis.split("").filter((val, index) => index <= 50)}
              <span
                className="readmore"
                onClick={() => this.setState({ readmoreselected: index })}
              >
                Read More
              </span>
            </TableCell>
          )}
          <TableCell>{val.jadwal}</TableCell>
          <TableCell>{val.sutradara}</TableCell>
          <TableCell>{val.genre}</TableCell>
          <TableCell>{val.durasi} Minutes</TableCell>
          <TableCell>
            <button
              className="btn btn-outline-primary mr-3"
              onClick={() =>
                this.setState({ modaledit: true, indexedit: index })
              }
            >
              Edit
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => this.delClick(index)}
            >
              Delete
            </button>
          </TableCell>
        </TableRow>
      );
    });
  };

  render() {
    const { datafilm, indexedit } = this.state;
    const { length } = datafilm;
    if (this.props.auth !== "admin") {
      return <Notfound />;
    }
    if (length === 0) {
      return <div>loading</div>;
    }
    return (
      <div className="mx-3">
        <Modal
          isOpen={this.state.modaledit}
          toggle={() => this.setState({ modaledit: false })}
        >
          <ModalHeader>Edit Data Film {datafilm[indexedit].title}</ModalHeader>
          <ModalBody>
            <input
              type="text"
              defaultValue={datafilm[indexedit].title}
              ref="edittitle"
              placeholder="title"
              className="form-control mt-2"
            />
            <input
              type="text"
              defaultValue={datafilm[indexedit].image}
              ref="editimage"
              placeholder="image"
              className="form-control mt-2"
            />
            <input
              type="text"
              defaultValue={datafilm[indexedit].produksi}
              ref="editproduksi"
              placeholder="produksi"
              className="form-control mt-2"
            />
            <textarea
              rows="5"
              ref="editsinopsis"
              defaultValue={datafilm[indexedit].sinopsis}
              placeholder="sinopsis"
              className="form-control mt-2 mb-2"
            />
            Jadwal:
            <div className="d-flex">{this.renderEditCheckbox(indexedit)}</div>
            <input
              type="text"
              defaultValue={datafilm[indexedit].trailer}
              ref="edittrailer"
              placeholder="trailer"
              className="form-control mt-2"
            />
            <select ref="editstudio" className="form-control mt-2">
              <option value="1">Studio 1</option>
              <option value="2">Studio 2</option>
              <option value="3">Studio 3</option>
            </select>
            <input
              type="text"
              defaultValue={datafilm[indexedit].sutradara}
              ref="editsutradara"
              placeholder="sutradara"
              className="form-control mt-2"
            />
            <input
              type="number"
              defaultValue={datafilm[indexedit].durasi}
              ref="editdurasi"
              placeholder="durasi"
              className="form-control mt-2"
            />
            <input
              type="text"
              defaultValue={datafilm[indexedit].genre}
              ref="editgenre"
              placeholder="genre"
              className="form-control mt-2"
            />
          </ModalBody>
          <ModalFooter>
            {/* <button onClick={this.onUpdateDataclick}>Save</button>
            <button onClick={() => this.setState({ modaledit: false })}>
              Cancel
            </button> */}
            <Button color="green" onClick={this.onUpdateDataclick}>
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

        <Modal
          isOpen={this.state.modaladd}
          toggle={() => this.setState({ modaladd: false })}
        >
          <ModalHeader>Add Movie</ModalHeader>
          <ModalBody>
            <input
              type="text"
              ref="title"
              placeholder="Movie Title"
              className="form-control mt-2"
            />
            <input
              type="text"
              ref="image"
              placeholder="Image Url"
              className="form-control mt-2"
            />
            {/* <input
              type="text"
              ref="sinopsis"
              placeholder="Synopsis"
              className="form-control mt-2 mb-2"
            /> */}
            <textarea
              rows="5"
              ref="sinopsis"
              placeholder="Synopsis"
              className="form-control mt-2 mb-2"
            />
            <input
              type="text"
              ref="produksi"
              placeholder="House Production"
              className="form-control mt-2 mb-2"
            />
            Jadwal: &nbsp;
            <input type="checkbox" ref="jadwal0" />{" "}
            <span className="mr-2">12.00</span>
            <input type="checkbox" ref="jadwal1" />
            <span className="mr-2">14.00</span>
            <input type="checkbox" ref="jadwal2" />
            <span className="mr-2">16.00</span>
            <input type="checkbox" ref="jadwal3" />
            <span className="mr-2">18.00</span>
            <input type="checkbox" ref="jadwal4" />
            <span className="mr-2">20.00</span>
            <input type="checkbox" ref="jadwal5" />
            <span className="mr-2">22.00</span>
            <input
              type="text"
              ref="sutradara"
              placeholder="Sutradara"
              className="form-control mt-2"
            />
            <input
              type="number"
              ref="durasi"
              placeholder="Durasi Film"
              className="form-control mt-2"
            />
            <input
              type="text"
              ref="genre"
              placeholder="Genre"
              className="form-control mt-2"
            />
            <input
              type="text"
              ref="trailer"
              placeholder="Trailer Url"
              className="form-control mt-2"
            />
          </ModalBody>
          <ModalFooter className="align-items-center">
            <Button color="green" onClick={this.onSaveAddDataClick}>
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
        <Fade>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Judul</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Sinopsis</TableCell>
                <TableCell>Jadwal</TableCell>
                <TableCell>Sutradara</TableCell>
                <TableCell>Genre</TableCell>
                <TableCell>Durasi</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{this.renderMovies()}</TableBody>
          </Table>
          <div className="text-center mt-5">
            <Button
              color="blue"
              size="huge"
              onClick={() => this.setState({ modaladd: true })}
            >
              Add Movie
            </Button>
          </div>
          {/* <button
            className="btn btn-success center-block"
            onClick={() => this.setState({ modaladd: true })}
          >
            Add Movie
          </button> */}
        </Fade>
      </div>
    );
  }
}

const MapstateToprops = state => {
  return {
    auth: state.AuthLogin.role
  };
};

export default connect(MapstateToprops)(ManageAdmin);

// React
import React, { Component } from "react";

// services
import FileService from "../service/FileService";
import { showAlert, notificationAlert } from "../utils/notifications";
import { AppContext } from "../context/AppContext";

// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";

// reactstrap components
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  FormGroup,
  Row,
  Spinner,
  // Spinner,
} from "reactstrap";

const fileService = new FileService();

const Loading = (props) => {
  return (
    <div
      className="container"
      style={{
        display: "flex",
        alignContent: "baseline",
        justifyContent: "center",
      }}
    >
      <Spinner size="sm" color="info" />
      <p className="text-info"> &nbsp;&nbsp;Uploading...</p>
    </div>
  );
};

class UploadModalButton extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      selectedFile: [],
      disabled: true,
      isUpload: false,
    };
  }

  componentDidMount() {}

  handleClick = async () => {
    const data = new FormData();
    try {
      data.append("file", this.state.selectedFile[0]);
      data.append("title", this.state.selectedFile[0].name);
      data.append("task", this.props.task);
    } catch (error) {
      return showAlert(
        400,
        "Debe seleccionar un archivo con la extensión .tgz, por ejemplo: 'submissions.tgz' 🙄"
      );
    }

    this.setState({
      loaded: true,
      disabled: true,
    });

    try {
      const response = await fileService.sendFile(data);

      if (response.status === 201) {
        this.setState({
          selectedFile: [],
          loaded: false,
          disabled: true,
        });
        showAlert(201, "Actividades cargadas exitosamente 😈");
        this.props.update();
      }
    } catch (error) {
      try {
        this.setState({
          selectedFile: [],
          loaded: false,
          disabled: true,
        });
        if (error.response.status === 401) {
          showAlert(500, "Su sesión ha expirado.");
          setTimeout(() => {
            this.context.setUser({ logged: false });
          }, 3000);
        } else {
          return showAlert(error.response.status, error.response.data.data);
        }
      } catch (err) {
        console.log(err);
        showAlert(
          500,
          "El servicio no está disponible en este momento, por favor intente más tarde 🤦 "
        );
      }
    }
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  fileHandleChange = (e) => {
    let files = e.target.files;
    if (this.checkMimeType(e) && this.checkFileSize(e)) {
      this.setState({
        selectedFile: files,
        disabled: false,
      });
    } else {
      this.setState({
        selectedFile: [],
        loaded: false,
        disabled: true,
      });
    }
  };

  checkMimeType = (e) => {
    let flag = true;
    //getting file object
    let files = e.target.files;
    //define message container
    let err = [];
    // list allow mime type
    const types = [
      "application/x-compressed-tar",
      "application/x-compressed",
      "application/gzip",
    ];
    // loop access array
    for (var x = 0; x < files.length; x++) {
      // compare file type find doesn't matach
      // eslint-disable-next-line
      if (types.every((type) => files[x].type !== type)) {
        // create error message and assign to container
        err[x] = files[x].type + " is not a supported format 	🤭\n";
        flag = false;
      }
    }
    for (var z = 0; z < err.length; z++) {
      // if message not same old that mean has error
      // discard selected file
      console.log(err[z]);
      showAlert(400, err[z]);
      e.target.value = null;
    }
    return flag;
  };

  checkFileSize = (e) => {
    let flag = true;
    let files = e.target.files;
    let size = 1000000;
    let err = [];
    for (var x = 0; x < files.length; x++) {
      if (files[x].size > size) {
        err[x] =
          files[x].name +
          " is too large" +
          `(${files[x].size / 1000}kB) , the heaviest file allowed is ${
            size / 1000
          }kB.\n`;
        flag = false;
      }
    }
    for (var z = 0; z < err.length; z++) {
      // if message not same old that mean has error
      // discard selected file
      showAlert(400, err[z]);
      e.target.value = null;
    }
    return flag;
  };

  render() {
    return (
      <>
        <NotificationAlert ref={notificationAlert} />
        <Card>
          <CardHeader>
            <div className="text-center text-dark">Subir Actividad</div>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md="12">
                <FormGroup>
                  <input
                    type="file"
                    accept=".tgz"
                    className="form-control"
                    name={this.state.selectedFile}
                    onChange={this.fileHandleChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>{this.state.loaded ? <Loading /> : false}</Row>
          </CardBody>
          <CardFooter>
            <Row>
              <Col md="12">
                <Button
                  disabled={this.state.disabled}
                  color="primary"
                  block
                  className="btn-round"
                  onClick={this.handleClick}
                >
                  Subir
                </Button>
              </Col>
            </Row>
          </CardFooter>
        </Card>
      </>
    );
  }
}

export default UploadModalButton;

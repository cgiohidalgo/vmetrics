// React
import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  FormGroup,
  Form,
  Input,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
} from "reactstrap";

// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";

// utils and services
import { showAlert, notificationAlert } from "../utils/notifications";
import ProfessorService from "../service/ProfessorService";

import { AppContext } from "../context/AppContext";

const professorService = new ProfessorService();
class Usuario extends React.Component {
  static contextType = AppContext;
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      professor: null,
      username: "",
      email: "",
      city: "",
    };
  }

  updateInitialState() {
    professorService
      .getProfessor(this.context.user.id)
      .then((response) => {
        this.setState({
          professor: response.data,
          username: response.data.user.username,
          email: response.data.user.email,
          city: response.data.city,
        });
      })
      .catch((error) => {
        try {
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
      });
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.updateInitialState();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.setState = (state, callback) => {
      return;
    };
  }

  dataChecker = () => {
    if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        this.state.email
      )
    ) {
      showAlert(400, "Ingrese un email valido.");
      showAlert(0, "Se recomienda guardar el correo institucional.");
      return false;
    }

    if (
      !/^(?=[a-zA-Z0-9._@]{6,20}$)(?!.*[_.]{2})/.test(this.state.username) ||
      /\s/.test(this.state.username)
    ) {
      showAlert(
        400,
        "Username solo debe contener: letras, números y los siguientes simbolos: @ . + - _(Sin espacios)(6-20 caracteres)",
        "tr",
        12
      );
      return false;
    }

    if (!/[\dA-Za-z]{3,15}/.test(this.state.city)) {
      showAlert(400, "La ciudad debe contener entre 3 y 15 caracteres.");
      return false;
    }
    return true;
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleClick = (e) => {
    e.preventDefault();
    let data = {
      username: this.state.username,
      email: this.state.email,
      city: this.state.city,
    };
    if (this.dataChecker()) {
      console.log(data);
      console.log(this.context.user.id);
      professorService
        .updateProfessor(data, this.context.user.id)
        .then((response) => {
          showAlert(response.status, "Perfil actualizado exitosamente");
        })
        .catch((error) => {
          try {
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
        });
    }
  };

  render() {
    return (
      <>
        <div className="content">
          <NotificationAlert ref={notificationAlert} />
          <Row>
            <Col md="6">
              <Card className="card-user">
                <CardHeader>
                  <CardTitle tag="h5">Editar Perfil</CardTitle>
                </CardHeader>
                <CardBody>
                  <Form>
                    <Row>
                      <Col className="pr-1" md="5">
                        <FormGroup>
                          <label>Universidad</label>
                          <Input
                            defaultValue="Univalle del Valle"
                            disabled
                            placeholder="Company"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col className="px-1" md="4">
                        <FormGroup>
                          <label>Username</label>
                          <Input
                            defaultValue={
                              this.state.username === ""
                                ? ""
                                : this.state.username
                            }
                            placeholder="Username"
                            name="username"
                            type="text"
                            onChange={this.handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pr-1" md="8">
                        <FormGroup>
                          <label htmlFor="exampleInputEmail1">Email</label>
                          <Input
                            placeholder="Email"
                            defaultValue={
                              this.state.email === "" ? "" : this.state.email
                            }
                            type="email"
                            name="email"
                            onChange={this.handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col className="pl-1" md="4">
                        <FormGroup>
                          <label>Código</label>
                          <Input
                            disabled
                            placeholder=""
                            defaultValue={
                              this.state.professor === null
                                ? ""
                                : this.state.professor.code
                            }
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pr-1" md="6">
                        <FormGroup>
                          <label>Nombre</label>
                          <Input
                            disabled
                            defaultValue={
                              this.state.professor === null
                                ? null
                                : this.state.professor.user.first_name
                            }
                            placeholder=""
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col className="pl-1" md="6">
                        <FormGroup>
                          <label>Apellido</label>
                          <Input
                            disabled
                            defaultValue={
                              this.state.professor === null
                                ? ""
                                : this.state.professor.user.last_name
                            }
                            placeholder=""
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    {/* <Row>
                      <Col md="12">
                        <FormGroup>
                          <label>Address</label>
                          <Input
                            defaultValue="El lago"
                            placeholder="Address"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row> */}
                    <Row>
                      <Col className="pr-1" md="4">
                        <FormGroup>
                          <label>Ciudad</label>
                          <Input
                            placeholder="City"
                            defaultValue={
                              this.state.city === "" ? "" : this.state.city
                            }
                            type="text"
                            name="city"
                            onChange={this.handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col className="px-1" md="4">
                        <FormGroup>
                          <label>País</label>
                          <Input
                            disabled
                            defaultValue="Colombia"
                            placeholder="Country"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    {/* <Row>
                      <Col md="12">
                        <FormGroup>
                          <label>About Me</label>
                          <Input
                            type="textarea"
                            defaultValue="something"
                          />
                        </FormGroup>
                      </Col>
                    </Row> */}
                    <Row>
                      <div className="update ml-auto mr-auto">
                        <Button
                          className="btn-round"
                          color="primary"
                          type="submit"
                          onClick={this.handleClick}
                        >
                          Actualizar Perfil
                        </Button>
                      </div>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col md="6">
              <Card
                className="card-user"
                style={{ backgroundColor: "#f9f3f3" }}
              >
                <div className="image">
                  <img
                    alt="..."
                    src={require("assets/img/damir-bosnjak.jpg")}
                  />
                </div>
                <CardBody>
                  <div className="author">
                    <a href="/" onClick={(e) => e.preventDefault()}>
                      <img
                        alt="..."
                        className="avatar border-gray"
                        src={require("assets/img/default-avatar.png")}
                      />
                      <h5 className="title">{}</h5>
                    </a>
                    <p className="font-weight-lighter text-decoration-none">
                      @{this.state.username === "" ? "" : this.state.username}
                    </p>
                  </div>
                  <ListGroup>
                    <ListGroupItem>
                      <span className="text-muted">
                        <span className="text-dark">Email: </span>
                        {this.state.email === "" ? "" : this.state.email}
                      </span>
                    </ListGroupItem>
                    <ListGroupItem>
                      <span className="text-muted">
                        <span className="text-dark">Ciudad: </span>
                        {this.state.city === "" ? "" : this.state.city}
                      </span>
                    </ListGroupItem>
                  </ListGroup>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Usuario;

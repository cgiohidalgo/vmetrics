// React
import React, { Component } from "react";
import { Link } from "react-router-dom";

// reactstrap
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Modal,
  Row,
} from "reactstrap";

// assets and utils
import background from "../assets/img/code.png";
import { showAlert, notificationAlert } from "../utils/notifications";

// Skeleton
import Skeleton from "react-loading-skeleton";

// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";

// Services
import ResourceService from "../service/ResourceService";
import TaskService from "../service/TaskService";

const resourceService = new ResourceService();
const taskService = new TaskService();

class CourseCard extends Component {
  _isMounted = true;
  constructor(props) {
    super(props);
    this.state = {
      course: this.props.data,
      totalTask: 0,
      loading: true,
      modal: false,
      dropCourse: "",
      disabled: true,
    };
  }

  updateInitialState = async () => {
    try {
      const response = await taskService.getTaskByResource(
        this.state.course.id
      );
      this.setState({
        totalTask: response.data.length,
        // loading: false,
      });

      setTimeout(() => {
        this.setState({ loading: false });
      }, 500);
    } catch (error) {
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
    }
  };

  componentDidMount = () => {
    this._isMounted = true;
    if (this._isMounted) {
      this.updateInitialState();
    }
  };

  componentWillUnmount = () => {
    this._isMounted = false;
    this.setState = (state, callback) => {
      return;
    };
  };

  handleClickTrashModal = () => {
    this.toggle();
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleClickConfirm = (e) => {
    e.preventDefault();

    resourceService
      .deleteResource(this.state.course.id)
      .then((response) => {
        if (response.status === 204) {
          this.props.update();
        }
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
    this.toggle();
    showAlert(1, "Eliminando recurso...", "tr", 5);
  };

  handleClickCancel = (e) => {
    e.preventDefault();
    this.setState({
      disabled: true,
    });
    this.toggle();
  };

  handleChange = (e) => {
    if (e.target.value === this.state.course.resource_name) {
      this.setState({
        disabled: false,
      });
    } else {
      this.setState({
        disabled: true,
      });
    }
  };

  skeleton = () => {
    return (
      <Col lg="4" md="4" sm="6" xs="6">
        <Card className="card-stats">
          <CardBody>
            <div>
              <p className="text-capitalize  text-dark text-center small">
                <Skeleton duration={1} width="60%" />
              </p>
            </div>
            <hr />
            <Row>
              <Col md="12">
                <p className="text-primary" title="courseID">
                  <Skeleton duration={1} />
                </p>
              </Col>
            </Row>

            <Skeleton duration={1} width="100%" height={130} />
          </CardBody>
          <hr />

          <CardFooter>
            <div
              className="container"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Skeleton height={20} width={60} />
              <Skeleton circle={true} width={20} height={20} />
            </div>
          </CardFooter>
        </Card>
      </Col>
    );
  };

  render() {
    if (!this.state.loading) {
      return (
        <>
          <NotificationAlert ref={notificationAlert} />

          <Col lg="4" md="4" sm="6" xs="6">
            <Card className="card-stats">
              <CardBody>
                <div>
                  <p className="text-capitalize  text-dark text-center small">
                    {this.state.course.course.name}
                  </p>
                </div>
                <hr />
                <Row>
                  <div
                    className="container"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Col md="10">
                      <p className="text-primary" title="courseID">
                        {this.state.course.resource_name}
                      </p>
                    </Col>
                    <Col md="1" className="text-right">
                      <i title="Diurno" className="nc-icon nc-sun-fog-29" />
                      <i className="nc-icon"></i>
                    </Col>
                  </div>
                </Row>

                <Row>
                  <Col md="12" xs="12">
                    <Link to="/admin/actividades" onClick={this.handleClick}>
                      <img
                        style={{ borderRadius: "15px" }}
                        src={background}
                        alt=""
                      />
                    </Link>
                  </Col>
                </Row>
              </CardBody>
              <hr />

              <CardFooter>
                <div
                  className="container"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="stats text-right">
                    <i className="nc-icon nc-chart-bar-32" /> Tasks:{" "}
                    <span className="text-info">{this.state.totalTask}</span>
                  </div>
                  <Button
                    color="danger"
                    className="btn btn-sm"
                    onClick={this.handleClickTrashModal}
                  >
                    <i className="fa fa-trash text-white"></i>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </Col>

          {/* modal to drop course */}
          <Modal isOpen={this.state.modal} toggle={this.toggle}>
            <Card>
              <CardHeader>
                <b>¿Está usted seguro?</b>
              </CardHeader>
              <CardBody>
                <blockquote className="blockquote">
                  <p className="text-black-50" style={{ lineHeight: "20px" }}>
                    Está a punto de eliminar el recurso "
                    <span className="text-danger">
                      {this.state.course.resource_name}
                    </span>
                    " perteneciente a la asignatura{" "}
                    <b>{this.state.course.course.name}</b>, esto retirará
                    permanentemente el recurso y todas las actividades que este
                    contenga en la plataforma.
                    <br />
                  </p>
                  <span className="text-black-50">
                    Por favor escriba <b>{this.state.course.resource_name}</b>{" "}
                    para confirmar.
                  </span>{" "}
                  <Form>
                    <Row className="pb-0">
                      <Col>
                        <FormGroup>
                          <Input
                            type="text"
                            name="dropCourse"
                            onChange={this.handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pr-1">
                        <FormGroup>
                          <Button
                            block
                            color="info"
                            onClick={this.handleClickCancel}
                          >
                            Sácame de aquí!
                          </Button>
                        </FormGroup>
                      </Col>
                      <Col className="pl-1">
                        <FormGroup>
                          <Button
                            block
                            disabled={this.state.disabled}
                            color="danger"
                            onClick={this.handleClickConfirm}
                          >
                            Eliminar recurso
                          </Button>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </blockquote>
              </CardBody>
            </Card>
          </Modal>
        </>
      );
    } else {
      return this.skeleton();
    }
  }
}

export default CourseCard;

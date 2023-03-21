// React
import React from "react";

// assets
import background from "../assets/img/code.png";

// reactstrap
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  Form,
  FormGroup,
  Input,
  Row,
} from "reactstrap";

// Components
import CourseCard from "./CourseCard";

// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";

// Services
import CourseService from "../service/CourseService";
import ResourceService from "../service/ResourceService";
import { AppContext } from "../context/AppContext";
import { showAlert, notificationAlert } from "../utils/notifications";

const courseService = new CourseService();
const resourceService = new ResourceService();

class Cursos extends React.Component {
  static contextType = AppContext;

  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      courseid: "",
      resources: [],
      courses: [],
      isOpen: false,
      deleteFlag: false,
    };
  }

  updateInitialState = () => {
    courseService
      .getCourses()
      .then((response) => {
        this.setState({
          courses: response.data,
        });
      })
      .catch((error) => {
        this.errorHandler(error);
      });

    resourceService
      .getResourcesByProfessor(this.context.user.id)
      .then((response) => {
        this.setState({
          resources: response.data,
        });
      })
      .catch((error) => {
        this.errorHandler(error);
      });
  };

  errorHandler = (error) => {
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
  };

  updateResources = () => {
    this.setState({
      deleteFlag: !this.state.deleteFlag,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.deleteFlag !== prevState.deleteFlag) {
      this.updateInitialState();
    }
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

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  dataChecker = () => {
    if (this.state.name === "") {
      showAlert(400, "Por favor, seleccione un curso.");
      return false;
    }
    if (
      /\s/.test(this.state.courseid) ||
      this.state.courseid.length < 3 ||
      this.state.courseid.length > 21
    ) {
      showAlert(
        400,
        "CursoID debe contener entre 3 y 21 caracteres(sin espacios)."
      );
      showAlert(1, "TIP:\tCursoID debe ser igual al courseid de INGInious.");
      return false;
    }
    return true;
  };

  handleClickAccept = (e) => {
    e.preventDefault();
    let data = {
      professor: this.context.user.id,
      course: this.state.name,
      resource_name: this.state.courseid,
    };

    if (this.dataChecker()) {
      resourceService
        .createResource(data)
        .then((response) => {
          if (response.status === 201) {
            let newResource = this.state.resources;
            newResource.push(response.data);
            this.setState({
              resources: newResource,
              name: "",
              courseid: "",
            });
            showAlert(response.status, `El curso ha sido creado.`);
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
    }
  };

  handleClickCancel = (e) => {
    e.preventDefault();
    this.setState({
      name: "",
      courseid: "",
    });
    this.toggle();
  };

  handleChange = (e) => {
    if (e.target.name === "name") {
      this.setState({
        id: e.target,
        [e.target.name]: e.target.value,
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
  };

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Row>
                <Col md="6">
                  <Button
                    color="info"
                    size="sm"
                    title="Crear"
                    onClick={this.toggle}
                    outline
                  >
                    <i className="nc-icon nc-simple-add px-2"></i>
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col lg="6" md="6" sm="6" xs="6">
                  <Collapse isOpen={this.state.isOpen}>
                    <Card className="card-stats">
                      <CardHeader>
                        <div
                          className="container"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div lg="10" md="10" sm="10" xs="10">
                            <h5 className="h5 text-black-50">
                              Crear un recurso nuevo
                            </h5>
                          </div>
                          <div lg="2" md="2" sm="2" xs="2">
                            <i className="nc-icon nc-paper" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardBody>
                        <Form>
                          <Row>
                            <Col className="px-2" md="12">
                              <FormGroup>
                                <label htmlFor="">Nombre del Curso</label>
                                <select
                                  className="form-control"
                                  name="name"
                                  onChange={this.handleChange}
                                  defaultValue="Seleccione un curso..."
                                >
                                  <option disabled>
                                    Seleccione un curso...
                                  </option>
                                  {this.state.courses.map((course) => {
                                    return (
                                      <option
                                        key={course.id}
                                        className="select-item"
                                        value={course.id}
                                      >
                                        {course.name}
                                      </option>
                                    );
                                  })}
                                </select>{" "}
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col className="pl-2" md="7">
                              <FormGroup>
                                <label>CursoID</label>
                                <Input
                                  name="courseid"
                                  placeholder="INGInious ID"
                                  type="text"
                                  value={this.state.courseid}
                                  onChange={this.handleChange}
                                />
                              </FormGroup>
                            </Col>
                            <Col className="pr-2 pl-0" md="5">
                              <FormGroup>
                                <label htmlFor="">Profesor</label>
                                <Input
                                  name="professor"
                                  defaultValue={`${this.context.user.username}`}
                                  type="text"
                                  disabled
                                  onChange={this.handleChange}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <br />
                          <CardFooter>
                            <Row>
                              <Col className="px-1" md="6">
                                <FormGroup>
                                  <Button
                                    className="btn-round"
                                    color="default"
                                    block
                                    onClick={this.handleClickCancel}
                                    style={{
                                      boxShadow:
                                        "0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)",
                                    }}
                                  >
                                    <i className="nc-icon nc-simple-remove pr-2"></i>
                                    Cancelar
                                  </Button>
                                </FormGroup>
                              </Col>
                              <Col className="px-1" md="6">
                                <FormGroup>
                                  <Button
                                    className="btn-round"
                                    color="success"
                                    block
                                    style={{
                                      boxShadow:
                                        "0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)",
                                    }}
                                    onClick={this.handleClickAccept}
                                  >
                                    <i className="nc-icon nc-check-2 pr-2"></i>
                                    Crear
                                  </Button>
                                </FormGroup>
                              </Col>
                            </Row>
                          </CardFooter>
                        </Form>
                      </CardBody>
                    </Card>
                  </Collapse>
                </Col>
                <Col lg="4" md="4" sm="6" xs="6">
                  <Collapse isOpen={this.state.isOpen}>
                    <Preview
                      name={this.state.name}
                      courseid={this.state.courseid}
                    />
                  </Collapse>
                </Col>
              </Row>
            </Col>
          </Row>
          <hr />
          <Row md="12">
            <NotificationAlert ref={notificationAlert} />

            {this.state.resources.map((resource) => {
              return (
                <CourseCard
                  data={resource}
                  update={() => {
                    this.updateResources();
                  }}
                  key={resource.id}
                />
              );
            })}
          </Row>
        </div>
      </>
    );
  }
}

export default Cursos;

const Preview = (props) => (
  <Card className="card-stats">
    <CardBody>
      {/* <div>
        <p className="text-capitalize  text-dark text-center small">
          {props.name}
        </p>
      </div>
      <hr /> */}
      <Row>
        <Col md="10">
          <p className="text-primary" title="courseID">
            {props.courseid}
          </p>
        </Col>
        <Col md="1" className="text-right">
          <i title="Diurno" className="nc-icon nc-sun-fog-29" />
        </Col>
      </Row>

      <Row>
        <Col md="12" xs="12">
          <img src={background} alt="" />
        </Col>
      </Row>
    </CardBody>
    <hr />

    <CardFooter>
      <div className="stats text-right">
        <i className="nc-icon nc-chart-bar-32" /> Taks:{" "}
        <span className="text-info">5</span>
      </div>
    </CardFooter>
  </Card>
);

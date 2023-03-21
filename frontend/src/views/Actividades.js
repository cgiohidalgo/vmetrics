// React
import React from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button,
  Collapse,
  Form,
  FormGroup,
  Input,
  CardFooter,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
} from "reactstrap";

// skeleton
import Skeleton from "react-loading-skeleton";

// notificationAlert
import NotificationAlert from "react-notification-alert";
import { showAlert, notificationAlert } from "../utils/notifications";

// components
import UploadModalButton from "./UploadButton";
import TaskService from "../service/TaskService";
import ResourceService from "../service/ResourceService";
import { AppContext } from "../context/AppContext";

// utils
import { TASK_COLUMNS } from "../utils/general";
import BasicFiltering from "../utils/table";

const taskService = new TaskService();
const resourceService = new ResourceService();

class Actividades extends React.Component {
  static contextType = AppContext;

  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      tasks: [],
      loading: true,
      isOpen: false,
      name: "",
      taskid: "",
      courseSelected: "Seleccione un Curso",
      courseid: 0,
      description: "",
      rows: [],
    };
    this.baseState = {
      name: "",
      taskid: "",
      courseSelected: "Seleccione un Curso",
      courseid: 0,
      description: "",
    };
  }

  updateInitialState = async () => {
    try {
      const resourceResponse = await resourceService.getResourcesByProfessor(
        this.context.user.id
      );
      const taskResponse = await taskService.getTasksByProfessor(
        this.context.user.id
      );
      this.setState({
        courses: resourceResponse.data,
        tasks: taskResponse.data,
        rows: this.createRows(taskResponse.data),
      });
      this.createRows(taskResponse.data);
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

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.updateInitialState();
    }
    this.createRows(this.state.tasks);
  }

  createRows = (taskList) => {
    let rows = [];
    taskList.forEach((value) => {
      let obj = {};
      obj["course"] = value.resource.course.name;
      obj["resource"] = value.resource.resource_name;
      obj["name"] = value.name;
      obj["taskid"] = value.taskid;
      obj["description"] = value.description;
      rows.push(obj);
    });

    return rows;
  };

  componentWillUnmount() {
    this._isMounted = false;
    this.setState = (state, callback) => {
      return;
    };
  }

  dataChecker = () => {
    if (
      /^\s/.test(this.state.name) ||
      !/^[0-9\-_\sa-zA-Z]{5,}$/.test(this.state.name)
    ) {
      showAlert(
        500,
        "El nombre de la actividad debe ser alfanumérico y de mínimo 5 caracteres."
      );
      return false;
    }
    if (!/^[a-zA-Z0-9\-_]{5,15}$/.test(this.state.taskid)) {
      showAlert(
        500,
        "Actividad ID debe contener entre 5 y 21 caracteres(sin espacios)."
      );
      showAlert(1, "TIP:Actividad ID debe ser igual al taskid de INGInious.");
      return false;
    }
    if (this.state.courseid === 0) {
      showAlert(500, "Debe seleccionar un curso");
      return false;
    }
    return true;
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  cancelHandleClick = (e) => {
    e.preventDefault();
    this.toggle();
    this.setState(this.baseState);
  };

  itemHandleClick = (courseid, courseSelected) => {
    this.setState({
      courseid,
      courseSelected,
    });
  };

  acceptHandleClick = async (e) => {
    e.preventDefault();
    if (this.dataChecker()) {
      const data = {
        resource: this.state.courseid,
        name: this.state.name,
        taskid: this.state.taskid,
        description: this.state.description,
      };
      try {
        const response = await taskService.createTask(data);
        if (response.status === 201) {
          this.toggle();
          this.setState(this.baseState);
          return showAlert(201, "Actividad creada!");
        }
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
    }
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
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
              {/* collapse start */}
              <Row>
                <Col lg="6" md="6" sm="6" xs="6">
                  <Collapse isOpen={this.state.isOpen}>
                    <Card>
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
                            <h5 className="h5 text-black-50 ">
                              Crear una nueva actividad
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
                                <label htmlFor="">Nombre de la actividad</label>
                                <Input
                                  type="text"
                                  name="name"
                                  value={this.state.name}
                                  onChange={this.handleChange}
                                />{" "}
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col className="px-2" md="12">
                              <FormGroup>
                                <label htmlFor="">Actividad ID</label>
                                <Input
                                  type="text"
                                  name="taskid"
                                  value={this.state.taskid}
                                  onChange={this.handleChange}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col className="px-2" md="12">
                              <FormGroup>
                                <label htmlFor="">Curso</label>
                                <UncontrolledDropdown
                                  direction="right"
                                  size="sm"
                                >
                                  <DropdownToggle caret color="info">
                                    {this.state.courseSelected}
                                  </DropdownToggle>
                                  <DropdownMenu>
                                    {this.state.courses.map((course) => {
                                      return (
                                        <DropdownItem
                                          key={course.id}
                                          onClick={() => {
                                            this.itemHandleClick(
                                              course.id,
                                              course.resource_name
                                            );
                                          }}
                                        >
                                          {course.resource_name}
                                        </DropdownItem>
                                      );
                                    })}
                                  </DropdownMenu>
                                </UncontrolledDropdown>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col className="px-2" md="12">
                              <FormGroup>
                                <label htmlFor="">Descripción</label>
                                <Input
                                  type="textarea"
                                  name="description"
                                  value={this.state.description}
                                  onChange={this.handleChange}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <CardFooter>
                            <Row>
                              <Col className="px-1" md="6">
                                <FormGroup>
                                  <Button
                                    className="btn-round"
                                    color="default"
                                    block
                                    onClick={this.cancelHandleClick}
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
                                    onClick={this.acceptHandleClick}
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
                <Col lg="6" md="6" sm="6" xs="6">
                  <Collapse isOpen={this.state.isOpen}>
                    <UploadModalButton
                      update={this.updateInitialState}
                      task={this.state.taskid}
                    />
                  </Collapse>
                </Col>
              </Row>
              {/* collapse end */}
            </Col>
          </Row>
          <hr />
          {!this.state.loading ? (
            <Row>
              <NotificationAlert ref={notificationAlert} />

              <Col md="12">
                <Card>
                  <CardHeader>
                    <CardTitle tag="h4">ACTIVIDADES POR CURSO</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col md="12">
                        <BasicFiltering
                          columns={TASK_COLUMNS}
                          data={this.state.rows}
                        />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          ) : (
            <ShowSkeleton />
          )}
        </div>
      </>
    );
  }
}

export default Actividades;

const ShowSkeleton = () => {
  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">
                  <Skeleton width="40%" />
                </CardTitle>
              </CardHeader>
              <CardBody>
                <Table responsive className="table-hover">
                  <thead className="text-info">
                    <tr>
                      <th className="col-md-1">
                        <Skeleton />
                      </th>
                      <th className="col-md-3">
                        <Skeleton />
                      </th>
                      <th className="col-md-2">
                        <Skeleton />
                      </th>
                      <th className="col-md-2">
                        <Skeleton />
                      </th>
                      <th className="col-md-3">
                        <Skeleton />
                      </th>
                      <th className="col-md-1">
                        <Skeleton circle={true} width={50} height={50} />
                      </th>
                    </tr>
                  </thead>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

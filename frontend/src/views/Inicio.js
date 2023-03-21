// React
import React from "react";

// reactstrap components
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";

import CourseCard from "./CourseCard";

// services and utils
import ResourceService from "../service/ResourceService";
import TaskService from "../service/TaskService";
import GraphicService from "../service/GraphicService";
import { AppContext } from "../context/AppContext";
import { HEX_COLORS, LITTLE_TASK_COLUMNS } from "../utils/general";

// notificationAlert
import NotificationAlert from "react-notification-alert";
import { notificationAlert, showAlert } from "../utils/notifications";
import PieGraph from "./PieGraph";
import BasicFiltering from "../utils/table";

const resourceService = new ResourceService();
const taskService = new TaskService();

class Inicio extends React.Component {
  static contextType = AppContext;
  graphicService = new GraphicService();

  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      resources: [],
      tasks: [],
      deleteFlag: false,
      pieLoaded: true,
      rows: [],
      loading: true,
    };
  }

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

  getPieData = () => {
    this.graphicService
      .getCourseTask(this.context.user.id)
      .then((response) => {
        if (response.data.length > 0) {
          let labels = [];
          let graphData = [];
          let background = [];
          let total = 0;

          response.data.forEach((item) => {
            labels.push(item.res_name);
            graphData.push(item.total_tasks);
            let number = Math.floor(
              Math.random() * (HEX_COLORS.length - 0) + 0
            );
            background.push(HEX_COLORS[number]);
            total += item.total_tasks;
          });

          const data = {
            labels: labels,
            datasets: [
              {
                label: "Estado",
                backgroundColor: background,
                data: graphData,
                hoverOffset: 10,
              },
            ],
          };
          const options = {
            legend: {
              display: true,
              position: "bottom",
              margin: "0",
            },
          };
          this.setState({
            pieData: data,
            pieOptions: options,
            pieLoaded: false,
            total: total,
          });
        }
      })
      .catch((error) => {
        this.errorHandler(error);
      });
  };

  createRows = (taskList) => {
    let rows = [];
    taskList.forEach((value) => {
      let obj = {};
      obj["course"] = value.resource.course.short_name;
      obj["resource"] = value.resource.resource_name;
      obj["taskid"] = value.taskid;
      rows.push(obj);
    });

    return rows;
  };

  updateInitialState = () => {
    resourceService
      .getResourcesByProfessor(this.context.user.id)
      .then((res) => {
        this.setState({
          resources: res.data,
        });
      })
      .catch((error) => {
        this.errorHandler(error);
      });

    taskService
      .getTasksByProfessor(this.context.user.id)
      .then((res) => {
        if (res.data.length > 0) {
          let rows = this.createRows(res.data);
          this.setState({
            tasks: res.data,
            rows: rows,
            loading: false,
          });
        }
      })
      .catch((error) => {
        this.errorHandler(error);
      });

    this.getPieData();
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

  render() {
    return (
      <>
        <div className="content">
          <NotificationAlert ref={notificationAlert} />

          <Row>
            <Col md="12">
              <p className="h3 text-center">Cursos</p>
            </Col>
          </Row>
          <Row>
            {this.state.resources.map((course) => {
              return (
                <CourseCard
                  data={course}
                  update={() => {
                    this.updateResources();
                  }}
                  key={course.id}
                />
              );
            })}
          </Row>
          <hr />
          <Row>
            <Col md="6">
              {!this.state.pieLoaded ? (
                <PieGraph
                  title="Estadísticas"
                  description="Total de actividades por curso"
                  data={this.state.pieData}
                  options={this.state.pieOptions}
                  footer="Actividades cargadas"
                  optional={this.state.pieTotal}
                />
              ) : null}
            </Col>
            <Col md="6">
              {this.state.loading ? null : (
                <Card className="card-deck">
                  <CardHeader>
                    <CardTitle tag="h4">Actividades por Curso</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col md="12">
                        <BasicFiltering
                          columns={LITTLE_TASK_COLUMNS}
                          data={this.state.rows}
                        />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              )}
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Inicio;

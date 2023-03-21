// React
import React from "react";

import GraphicService from "../service/GraphicService";
import { AppContext } from "context/AppContext";

// graphs
import PieGraph from "./PieGraph";
import BarGraph from "./BarGraph";
import LineGraph from "./LineGraph";

import { showAlert } from "../utils/notifications";
import { HEX_COLORS } from "../utils/general";

// reactstrap components
import { Row, Col } from "reactstrap";

class Estadisticas extends React.Component {
  static contextType = AppContext;
  notificationAlert = React.createRef();
  graphicService = new GraphicService();
  constructor(props) {
    super(props);
    this.state = {
      pieLoaded: true,
      pieData: {},
      pieOptions: {},
      barLoaded: true,
      barData: {},
      barOptions: {},
      lineLoaded: true,
      lineData: {},
      lineOptions: {},
      failLoaded: true,
      failData: {},
      failOptions: {},
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

  getBarData = () => {
    this.graphicService
      .getTotalResult(this.context.user.id)

      .then((response) => {
        if (response.data.length > 0) {
          let labels = [];
          let graphData = [];
          let background = [];
          let total = 0;
          response.data.forEach((item) => {
            labels.push(item.result);
            graphData.push(item.total);
            let number = Math.floor(
              Math.random() * (HEX_COLORS.length - 0) + 0
            );
            background.push(HEX_COLORS[number]);
            total += item.total;
          });

          const data = {
            labels: labels,
            datasets: [
              {
                backgroundColor: background,
                data: graphData,
                hoverOffset: 10,
              },
            ],
          };
          const options = {
            legend: {
              display: false,
              position: "bottom",
              margin: "0",
            },
          };
          this.setState({
            barData: data,
            barOptions: options,
            barLoaded: false,
            total: total,
          });
        }
      })
      .catch((error) => {
        this.errorHandler(error);
      });
  };

  getLineDataByCourse = () => {
    this.graphicService
      .getTotalResultByCourses(this.context.user.id)
      .then((response) => {
        if (response.data.length > 0) {
          let dataSet = [];
          const pos = {
            killed: 0,
            timeout: 1,
            failed: 2,
            success: 3,
            crash: 4,
          };
          let object = {
            data: [0, 0, 0, 0, 0],
            label: "",
            borderColor: "",
            fill: true,
          };
          let courseName = response.data[0].res_name;
          object.label = courseName;
          object.borderColor =
            HEX_COLORS[Math.floor(Math.random() * (HEX_COLORS.length - 0) + 0)];
          response.data.forEach((item) => {
            if (item.res_name === courseName) {
              object.data[pos[item.result]] = item.total;
            } else {
              dataSet.push(object);
              object = {
                data: [0, 0, 0, 0, 0],
                label: "",
                borderColor: "",
                fill: true,
              };
              courseName = item.res_name;
              object.data[pos[item.result]] = item.total;
              object.label = courseName;
              object.borderColor =
                HEX_COLORS[
                  Math.floor(Math.random() * (HEX_COLORS.length - 0) + 0)
                ];
            }
          });
          dataSet.push(object);
          const data = {
            labels: ["killed", "timeout", "failed", "success", "crash"],
            datasets: dataSet,
          };
          const options = {
            legend: {
              display: true,
              position: "bottom",
              margin: "0",
            },
          };
          this.setState({
            lineData: data,
            lineOptions: options,
            lineLoaded: false,
          });
        }
      })
      .catch((error) => {
        this.errorHandler(error);
      });
  };

  getFailData = () => {
    this.graphicService
      .getTaskFailed(this.context.user.id)
      .then((response) => {
        if (response.data.length > 0) {
          let labels = [];
          let graphData = [];
          let background = [];
          response.data.forEach((item) => {
            let number = Math.floor(
              Math.random() * (HEX_COLORS.length - 0) + 0
            );
            background.push(HEX_COLORS[number]);
            labels.push(item.taskid);
            graphData.push(item.fails);
          });
          const data = {
            labels: labels,
            datasets: [
              {
                backgroundColor: background,
                data: graphData,
                hoverOffset: 10,
              },
            ],
          };
          const options = {
            legend: {
              display: false,
              position: "bottom",
              margin: "0",
            },
          };
          this.setState({
            failData: data,
            failOptions: options,
            failLoaded: false,
          });
        }
      })
      .catch((error) => {
        this.errorHandler(error);
      });
  };

  initialState = () => {
    this.getPieData();
    this.getBarData();
    this.getLineDataByCourse();
    this.getFailData();
  };

  componentDidMount() {
    this.initialState();
  }

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col md="6">
              {!this.state.pieLoaded ? (
                <PieGraph
                  title="Actividades"
                  description="Total de actividades por curso"
                  data={this.state.pieData}
                  options={this.state.pieOptions}
                  footer="Actividades cargadas"
                />
              ) : null}
            </Col>
            <Col md="6">
              {!this.state.barLoaded ? (
                <BarGraph
                  title="Entregas"
                  description="Resumen de los resultados obtenidos"
                  data={this.state.barData}
                  options={this.state.barOptions}
                  footer="Códigos evaluados"
                />
              ) : null}
            </Col>
          </Row>
          <hr />
          <Row>
            <Col md="12">
              {!this.state.lineLoaded ? (
                <LineGraph
                  title="Entregas por curso"
                  description="Resumen de los resultados obtenidos"
                  data={this.state.lineData}
                  options={this.state.lineOptions}
                  footer="Comparando cursos 🤔"
                />
              ) : null}
            </Col>
          </Row>
          <hr />
          <Row>
            <Col md="12">
              {!this.state.failLoaded ? (
                <BarGraph
                  title="Actividades complejas"
                  description="Actividades con más entregas fallidas"
                  data={this.state.failData}
                  options={this.state.failOptions}
                  footer="Para tener en cuenta 😉"
                />
              ) : null}
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Estadisticas;

import React, { Component, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  CustomInput,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
  Table,
} from "reactstrap";
import { AppContext } from "../context/AppContext";
// utils
import { METRICS_COLUMNS } from "../utils/general";
import BasicFiltering from "../utils/table";
// services
import LangService from "../service/LangService";
import TaskService from "../service/TaskService";
// import StudentService from "../service/StudentService";
import MetricService from "../service/MetricService";
// notificationAlert
import NotificationAlert from "react-notification-alert";
import { showAlert, notificationAlert } from "../utils/notifications";
import CardTitle from "reactstrap/lib/CardTitle";
// code
import { CopyBlock, dracula } from "react-code-blocks";
// skeleton
import Skeleton from "react-loading-skeleton";

import { CSVLink } from "react-csv";

export default class Metrics extends Component {
  static contextType = AppContext;
  taskService = new TaskService();
  // studentService = new StudentService();
  languageService = new LangService();
  metricService = new MetricService();

  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      inputid: "",
      tableData: [],
      evaluatedTasks: [],
      rows: [],
      disabled: true,
      tasks: [],
      students: [],
      lang: [],
      extension: "--",
      skeleton: false,
      table: false,
    };
  }

  updateInitialState = async () => {
    try {
      const taskResponse = await this.taskService.getTasksByProfessor(
        this.context.user.id
      );
      // const studentResponse = await studentService.getStudentsByProfessor(
      //   this.context.user.id
      // );
      const taskEvaluatedResponse =
        await this.metricService.getEvaluatedMetrics(this.context.user.id);

      const langResponse = await this.languageService.getLanguages();

      this.setState({
        lang: langResponse.data,
        tasks: taskResponse.data,
        evaluatedTasks: taskEvaluatedResponse.data,
        // students: studentResponse.data,
      });
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
        return showAlert(
          500,
          "El servicio no está disponible en este momento, por favor intente más tarde 🤦 "
        );
      }
    }
  };

  componentDidMount() {
    this.updateInitialState();
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  cancelHandleClick = (e) => {
    e.preventDefault();
    this.toggle();
  };

  inputMetricHandleClick = async (e) => {
    e.preventDefault();
    try {
      this.setState({
        table: false,
        skeleton: true,
      });
      const metricResponse = await this.metricService.getMetricByInputId(
        this.state.inputid,
        { language: this.state.extension }
      );
      this.setState({
        tableData: metricResponse.data.data,
        rows: this.createTableRows(metricResponse.data.data),
        skeleton: false,
        table: true,
      });
    } catch (error) {
      this.setState({
        skeleton: false,
      });
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

  createTableRows = (data) => {
    let rows = [
      {
        metric: "Proporción de comentarios",
        value: Math.round(data.comment_ratio * 1000) / 1000,
      },
      {
        metric: "Complejidad Ciclomática",
        value: Math.round(data.cyclomatic_complexity * 1000) / 1000,
      },
      {
        metric: "Número de bugs",
        value: Math.round(data.halstead_bugprop * 1000) / 1000,
      },
      {
        metric: "Suma de Operandos",
        value: Math.round(data.operands_sum * 1000) / 1000,
      },
      {
        metric: "Operandos únicos",
        value: Math.round(data.operands_uniq * 1000) / 1000,
      },
      {
        metric: "Suma de operadores",
        value: Math.round(data.operators_sum * 1000) / 1000,
      },
      {
        metric: "Operadores Únicos",
        value: Math.round(data.operators_uniq * 1000) / 1000,
      },
      {
        metric: "Dificultad de Halstead",
        value: Math.round(data.halstead_difficulty * 1000) / 1000,
      },
      {
        metric: "Esfuerzo de Halstead",
        value: Math.round(data.halstead_effort * 1000) / 1000,
      },
      {
        metric: "Tiempo de Halstead",
        value: Math.round(data.halstead_timerequired * 1000) / 1000,
      },
      {
        metric: "Volumen de Halstead",
        value: Math.round(data.halstead_volume * 1000) / 1000,
      },
      {
        metric: "Índice de mantenibilidad",
        value: Math.round(data.maintainability_index * 1000) / 1000,
      },
      {
        metric: "Líneas de código",
        value: data.loc,
      },
    ];
    return rows;
  };

  render() {
    return (
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
              <Col lg="6" md="6" sm="10" xs="12">
                <Collapse isOpen={this.state.isOpen}>
                  <GenerateMetricsCard
                    options={this.state.tasks}
                    cancelHandleClick={this.cancelHandleClick}
                    languages={this.state.lang}
                  />
                </Collapse>
              </Col>
              <Col lg="6" md="6" sm="10" xs="12">
                <Collapse isOpen={this.state.isOpen}>
                  <CSVCard
                    options={this.state.evaluatedTasks}
                    cancelHandleClick={this.cancelHandleClick}
                  />
                </Collapse>
              </Col>
            </Row>
            {/* collapse end */}
          </Col>
        </Row>
        <NotificationAlert ref={notificationAlert} />
        <hr />
        <Row>
          <Col md="12">
            <Row>
              <Col md="6" sm="6" xs="7">
                <FormGroup>
                  <Input
                    name="inputid"
                    placeholder="Input ID"
                    type="text"
                    value={this.state.inputid}
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Col>
              <Col md="3" sm="3" xs="5">
                <CustomInput
                  name="extension"
                  type="select"
                  className="customSelect"
                  id="uploadType"
                  onChange={this.handleChange}
                >
                  <option value={"--"}>Lenguaje</option>
                  {this.state.lang.map((l) => {
                    return (
                      <option value={l.extension} key={l.extension}>
                        {l.name}
                      </option>
                    );
                  })}
                </CustomInput>
              </Col>
              <Col md="5">
                <Button
                  className="m-0 m-0"
                  color="success"
                  onClick={this.inputMetricHandleClick}
                  disabled={
                    /^\s*$/.test(this.state.inputid) ||
                    this.state.extension === "--"
                      ? true
                      : false
                  }
                >
                  Obtener Métricas
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        {this.state.skeleton ? <ShowSkeleton /> : null}
        {this.state.table ? (
          <Row>
            <Col md="6">
              <Card className="mt-2">
                <CardHeader>
                  <CardTitle>
                    <FormGroup>
                      <Label>
                        <Row>
                          <Col>
                            <strong>Curso:</strong>{" "}
                            {this.state.tableData.input.courseid}{" "}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <strong>Actividad:</strong>
                            {this.state.tableData.input.taskid}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <strong>Lenguaje:</strong>{" "}
                            {this.state.tableData.extension.name}
                          </Col>
                        </Row>
                      </Label>
                    </FormGroup>
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md="12">
                      <BasicFiltering
                        columns={METRICS_COLUMNS}
                        data={this.state.rows}
                      />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col md="6" className="mt-2">
              <CopyBlock
                text={this.state.tableData.input.source_code}
                language={"js"}
                showLineNumbers={true}
                theme={dracula}
                codeBlock
              />
            </Col>
          </Row>
        ) : null}
      </div>
    );
  }
}

const headers = () => {
  const header = [
    { label: "Username", key: "username" },
    { label: "Input_ID", key: "id" },
    { label: "Grade", key: "grade" },
    { label: "Resultado", key: "result" },
    { label: "Comentarios(proporcion)", key: "comment" },
    { label: "CC", key: "cc" },
    { label: "Bugprop(H)", key: "bugprop" },
    { label: "Dificultad(H)", key: "difficulty" },
    { label: "Effort(H)", key: "effort" },
    { label: "Tiempo(H)", key: "time" },
    { label: "Volumen(H)", key: "volume" },
    { label: "Operandos(suma)", key: "operands_sum" },
    { label: "Operandos(unicos)", key: "operands_uniq" },
    { label: "Operadores(suma)", key: "operators_sum" },
    { label: "Operadores(unicos)", key: "operators_uniq" },
    { label: "LOC", key: "loc" },
  ];
  return header;
};

const body = (data) => {
  let info = [];
  data.forEach((value) => {
    let obj = {};
    obj["username"] = value.input.student.username;
    obj["id"] = value.input._id;
    obj["grade"] = value.input.grade;
    obj["result"] = value.input.result;
    obj["comment"] = value.comment_ratio;
    obj["cc"] = value.cyclomatic_complexity;
    obj["bugprop"] = value.halstead_bugprop;
    obj["difficulty"] = value.halstead_difficulty;
    obj["effort"] = value.halstead_effort;
    obj["time"] = value.halstead_timerequired;
    obj["volume"] = value.halstead_volume;
    obj["operands_sum"] = value.operands_sum;
    obj["operands_uniq"] = value.operands_uniq;
    obj["operators_sum"] = value.operators_sum;
    obj["operators_uniq"] = value.operators_uniq;
    obj["loc"] = value.loc;
    info.push(obj);
  });
  return info;
};

const CSVCard = (props) => {
  const metricService = new MetricService();
  const [value, setValue] = useState({ id: "0", extension: "" });
  const [dis, setDis] = useState(true);
  const [head, setHead] = useState({});
  const [csvData, setCsvData] = useState({});
  const [fileName, setFileName] = useState("");
  const [working, setWorking] = useState(false);
  const [download, setDownload] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    if (value.id !== "0") {
      try {
        let params = { language: value.extension };
        setWorking(true);
        setDis(true);
        const response = await metricService.getMetricsByTask(value.id, params);
        if (response.data.length > 0) {
          let header = headers();
          let info = body(response.data);
          let name =
            "metrics_" +
            response.data[0].input.courseid +
            "_" +
            response.data[0].input.taskid;
          setHead(header);
          setCsvData(info);
          setFileName(name);
          setWorking(false);
          showAlert(1, "Archivo listo para descargar.");
          setDownload(true);
        } else {
          showAlert(400, "No hay información para mostrar.");
          setWorking(false);
        }
      } catch (error) {
        try {
          if (error.response.status === 401) {
            this.context.setUser({ logged: false });
          }
          showAlert(error.response.status, error.response.data.data);
          setWorking(false);
        } catch (err) {
          console.log(err);
          showAlert(500, "Ha ocurrido un error inesperado");
          setWorking(false);
        }
      }
    } else {
      showAlert(
        500,
        "Seleccione una tarea y un el lenguaje con el que se va a evaluar."
      );
    }
  };

  return (
    <div>
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
              <h5 className="h5 text-black-50 ">Generar Archivo CSV</h5>
            </div>
            <div lg="2" md="2" sm="2" xs="2">
              <i className="nc-icon nc-cloud-download-93" />
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <Form>
            <Row>
              <Col className="px-2" md="12">
                <Label>
                  A continuación seleccione la actividad que desea descargar con
                  las métricas halladas previamente por la herramienta.
                </Label>
                <FormGroup>
                  <Row>
                    <Col md="8">
                      <Input
                        type="text"
                        name="actividad"
                        value="Selecione una Actividad"
                        disabled
                      ></Input>
                    </Col>
                    <Col md="4">
                      <CustomInput
                        name="value"
                        type="select"
                        className="customSelect"
                        id="uploadType"
                        onChange={(e) => {
                          if (e.target.value === "0-") {
                            setValue(e.target.value);
                            setDis(true);
                          } else {
                            let data = e.target.value.split("-");
                            setValue({ id: data[0], extension: data[1] });
                            setDis(false);
                            setDownload(false);
                          }
                        }}
                      >
                        <option value={"0-"}>--</option>
                        {props.options.map((task) => {
                          return (
                            <option
                              value={task.activity_id + "-" + task.extension}
                              key={task.activity_id}
                            >
                              {task.activity + " : " + task.extension__name}
                            </option>
                          );
                        })}
                      </CustomInput>
                    </Col>
                  </Row>
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
                      onClick={props.cancelHandleClick}
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
                      onClick={handleClick}
                      disabled={dis}
                      style={{
                        boxShadow:
                          "0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)",
                      }}
                    >
                      <i className="nc-icon nc-check-2 pr-2"></i>
                      Generar
                    </Button>
                  </FormGroup>
                </Col>
              </Row>
              <Row>{working ? <Loading /> : false}</Row>
              <Row>
                {download ? (
                  <Col
                    style={{
                      display: "flex",
                      alignContent: "baseline",
                      justifyContent: "center",
                    }}
                  >
                    <CSVLink headers={head} data={csvData} filename={fileName}>
                      Descargar
                    </CSVLink>
                  </Col>
                ) : null}
              </Row>
            </CardFooter>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

const GenerateMetricsCard = (props) => {
  const metricService = new MetricService();

  const [value, setValue] = useState(0);
  const [lang, setLang] = useState("");

  const validateData = () => {
    if (lang === "nn" || value === 0 || lang === "") {
      return false;
    }
    return true;
  };

  const findMetricsHandleClick = (e) => {
    e.preventDefault();
    if (validateData()) {
      showAlert(1, "Se enviará un mensaje al finalizar el proceso.");
      metricService
        .generateMetricsByTask(value, { language: lang })
        .then((res) => {
          setLang("nn");
          setValue(0);
          showAlert(res.data.status, res.data.data);
        })
        .catch((error) => {
          try {
            if (error.response.status === 401) {
              this.context.setUser({ logged: false });
            }
            showAlert(error.response.status, error.response.data.data);
          } catch (err) {
            console.log(err);
            showAlert(500, "Ha ocurrido un error inesperado");
          }
        });
      setValue(0);
    } else {
      showAlert(
        500,
        "Seleccione una tarea y un el lenguaje con el que se va a evaluar."
      );
    }
  };

  return (
    <>
      <div className="content">
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
                <h5 className="h5 text-black-50 ">Generar Métricas</h5>
              </div>
              <div lg="2" md="2" sm="2" xs="2">
                <i className="nc-icon nc-sound-wave" />
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <Form>
              <Row>
                <Col className="px-2" md="12">
                  <Label>
                    En esta sección podrá evaluar el código fuente de los
                    estudiantes mediante métricas, al finalizar este proceso se
                    le eviará un correo electrónico.
                  </Label>
                  <FormGroup>
                    <Row>
                      <Col md="8">
                        <Input
                          type="text"
                          name="actividad"
                          value="Selecione una Actividad"
                          disabled
                        ></Input>
                      </Col>
                      <Col md="4">
                        <CustomInput
                          name="value"
                          type="select"
                          className="customSelect"
                          id="uploadType"
                          onChange={(e) => {
                            setValue(e.target.value);
                          }}
                        >
                          <option value={0}>--</option>
                          {props.options.map((task) => {
                            return (
                              <option value={task.pk} key={task.pk}>
                                {task.taskid}
                              </option>
                            );
                          })}
                        </CustomInput>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="8">
                        <Input
                          type="text"
                          name="lenguaje"
                          value="Selecione el lenguaje"
                          disabled
                        ></Input>
                      </Col>
                      <Col md="4">
                        <CustomInput
                          name="lang"
                          type="select"
                          className="customSelect"
                          id="uploadType"
                          onChange={(e) => {
                            setLang(e.target.value);
                          }}
                        >
                          <option value={"nn"}>Select</option>
                          {props.languages.map((language) => {
                            return (
                              <option
                                value={language.extension}
                                key={language.extension}
                              >
                                {language.name}
                              </option>
                            );
                          })}
                        </CustomInput>
                      </Col>
                    </Row>
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
                        onClick={props.cancelHandleClick}
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
                        onClick={findMetricsHandleClick}
                        disabled={value !== 0 && lang !== "nn" ? false : true}
                        block
                        style={{
                          boxShadow:
                            "0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)",
                        }}
                      >
                        <i className="nc-icon nc-check-2 pr-2"></i>
                        Generar
                      </Button>
                    </FormGroup>
                  </Col>
                </Row>
              </CardFooter>
            </Form>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

const ShowSkeleton = () => {
  return (
    <>
      <div className="content">
        <Row>
          <Col md="6">
            <Card>
              <CardHeader>
                <Skeleton />
              </CardHeader>
              <CardBody>
                <br />
                <CardTitle tag="h4" className="text-right">
                  <Skeleton width="50%" />
                </CardTitle>

                <Table responsive className="table-hover">
                  <thead className="text-info">
                    <tr>
                      <th className="col-md-5">
                        <Skeleton />
                      </th>
                      <th className="col-md-5">
                        <Skeleton />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="col-md-5">
                      <Skeleton />
                    </tr>
                    <th className="col-md-5">
                      <Skeleton />
                    </th>
                    <th className="col-md-5">
                      <Skeleton />
                    </th>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

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
      <p className="text-info"> &nbsp;&nbsp;Generando archivo...</p>
    </div>
  );
};

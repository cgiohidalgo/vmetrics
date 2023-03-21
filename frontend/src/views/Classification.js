// React
import React from "react";

import {
  Collapse,
  Card,
  Button,
  Row,
  Col,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  CardHeader,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Badge,
  Input,
  Label,
} from "reactstrap";
// core components
import Papa from "papaparse";
// components
import PieChart from "../utils/pieChart";
import BarChart from "../utils/barChart";
import ImageCSV from "../utils/image";
import Carousel from "../utils/carousel";
import BasicFiltering from "../utils/table";
import TableInfo from "utils/tableInfo";
import MlTable from "utils/mlTable";
//Context
import { AppContext } from "../context/AppContext";
//Endpoints
import { ENDPOINTS } from "../utils/general";
import FileService from "../service/FileService";
// notificationAlert
import NotificationAlert from "react-notification-alert";
import { showAlert, notificationAlert } from "../utils/notifications";

let objectFileService = new FileService();

class Classification extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      csvfile: undefined,
      data: [],
      load: false,
      bestGrades: [],
      worstGrades: [],
      //spinner
      spinner: false,
      //Images
      gralImage: null,
      dtImage: null,
      knnImage: null,
      nbImage: null,
      svmImage: null,
      rocImage: null,
      //table
      tableData: [],
      //modal
      modal: false,
      //ml info
      email: [],
      media: [],
      //algorithm accuracy
      accuracyDT: 0,
      accuracyKNN: 0,
      accuracyNB: 0,
      accuracySVM: 0,
      //roc info
      rocDT: 0,
      rocKNN: 0,
      rocNB: 0,
      rocSVM: 0,
      //confussion matrix
      matrixDT: {},
      matrixKNN: {},
      matrixNB: {},
      matrixSVM: {},
      //check
      check_ml: false,
      collapse: false,
    };
    //Badge info
    this.toggleBadge = this.toggleBadge.bind(this);
    //toggle de Modal
    this.toggle = this.toggle.bind(this);
    this.updateData = this.updateData.bind(this);
  }

  //LECTURA DE CSV
  handleChange = async (event) => {
    this.setState({
      csvfile: event.target.files[0],
    });
  };

  checkBoxhandleChange = (event) => {
    this.setState({ check_ml: event.target.checked });
  };

  importCSV = () => {
    this.setState({
      spinner: true,
    });
    const { csvfile } = this.state;
    Papa.parse(csvfile, {
      complete: this.updateData,
      header: true,
    });
  };

  updateData(result) {
    const readerfile = new FormData();
    try {
      readerfile.append("professor", this.context.user.id);
      readerfile.append("file", this.state.csvfile);
      readerfile.append("name", this.state.csvfile.name);
      readerfile.append("check", this.state.check_ml);
      objectFileService
        .sendCsvFile(readerfile)
        .then((response) => {
          console.log(response.data);
          this.setState({
            spinner: false,
            load: true,
            //URL images
            gralImage: ENDPOINTS.images + response.data.id + "/1/",
            dtImage: ENDPOINTS.images + response.data.id + "/2/",
            knnImage: ENDPOINTS.images + response.data.id + "/3/",
            nbImage: ENDPOINTS.images + response.data.id + "/4/",
            svmImage: ENDPOINTS.images + response.data.id + "/5/",
            rocImage: ENDPOINTS.images + response.data.id + "/6/",
            //ML information
            email: response.data.email,
            media: response.data.media,
            accuracyDT: response.data.accuracyDT,
            accuracyKNN: response.data.accuracyKNN,
            accuracyNB: response.data.accuracyNB,
            accuracySVM: response.data.accuracySVM,
            rocDT: response.data.rocDT,
            rocKNN: response.data.rocKNN,
            rocNB: response.data.rocNB,
            rocSVM: response.data.rocSVM,
            //confussion matrix informatipn
            matrixDT: response.data.matrixDT,
            matrixKNN: response.data.matrixKNN,
            matrixNB: response.data.matrixNB,
            matrixSVM: response.data.matrixSVM,
          });
        })
        .catch((error) => {
          this.setState({
            spinner: false,
          });
          if (error.response.status === 400) {
            showAlert(400, error.response.data);
          } else {
            showAlert(
              500,
              "Ha ocurrido un error inesperado. Por favor, intente más tarde"
            );
          }
        });
    } catch (error) {
      console.log(error);
    }

    let data = result.data;
    let columnsData = [];
    data.forEach((information) => {
      let object = {};
      object["nombre"] = information.realname;
      object["usuario"] = information.username;
      object["calificacion"] = information.grade;
      object["entregas"] = information.task_succeeded;
      object["intentos"] = information.task_tried;
      columnsData.push(object);
    });
    this.setState({
      data: data,
      tableData: columnsData,
      bestGrades: data.filter((d) => d.grade >= 60),
      worstGrades: data.filter((d) => d.grade < 60),
    });
  }
  //FIN DE LECTURA DE CSV

  //BADGE TOGGLE
  toggleBadge() {
    this.setState({ collapse: !this.state.collapse });
  }
  //FIN BADGE TOGGLE

  //TOGGLE MODAL//
  toggle() {
    this.setState({
      //False o true dependiendo del estado en el que este
      //Commit develop
      modal: !this.state.modal,
    });
  }
  //FIN TOGGLE MODAL//

  render() {
    return (
      <>
        <div className="content">
          <NotificationAlert ref={notificationAlert} />
          <Card body outline color="success">
            <Row>
              <Col className="px-2" md="1"></Col>
              <Col className="px-2" md="4">
                <h2>Archivo CSV</h2>
                <div id="checkbox_ml">
                  <Input type="checkbox" onChange={this.checkBoxhandleChange} />{" "}
                  <Label check>Entrenar modelo desde cero.</Label>
                </div>
                <input
                  className="csv-input"
                  type="file"
                  accept=".csv"
                  name="file"
                  placeholder={null}
                  onChange={this.handleChange}
                />
                {this.state.csvfile !== undefined ? (
                  <div>
                    <Button
                      className="btn-round"
                      color="success"
                      block
                      style={{
                        boxShadow:
                          "0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)",
                      }}
                      onClick={this.importCSV}
                    >
                      <i className="nc-icon nc-check-2 pr-2"></i>
                      Visualizar
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button
                      className="btn-round"
                      color="success"
                      block
                      style={{
                        boxShadow:
                          "0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)",
                      }}
                      onClick={() =>
                        showAlert(
                          500,
                          <div>
                            Debe seleccionar un <b>archivo csv</b> para la
                            visualización
                          </div>
                        )
                      }
                    >
                      <i className="nc-icon nc-check-2 pr-2"></i>
                      Visualizar
                    </Button>
                  </div>
                )}
              </Col>
              <Col className="px-2" md="7"></Col>
            </Row>
          </Card>

          <Col className="px-2" md="12">
            {this.state.load ? (
              <div>
                {/* <Button
                  color="warning"
                  onClick={this.toggle}
                  id="alertButton"
                  style={{
                    position: "fixed",
                    top: "50%",
                    right: 26,
                    boxShadow:
                      "0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 10px 0 rgba(0,0,0,0.19)",
                  }}
                  title="¡Alerta a tus estudiantes!"
                >
                  <i id="iconAlert" className="nc-icon nc-bell-55"></i>
                </Button> */}
                <Modal
                  id="alertModal"
                  isOpen={this.state.modal}
                  toggle={this.toggle}
                  className={this.props.className}
                >
                  <ModalHeader toggle={this.toggle}>
                    <strong>Enviar correos</strong>
                  </ModalHeader>
                  <ModalBody align="justify">
                    En este espacio usted podrá enviar un recordatorio a los
                    estudiantes que según el archivo seleccionado tienen
                    calificaciones inferiores a 60, para que practiquen un poco
                    más los ejercicios propuestos en el curso.
                  </ModalBody>
                  <ModalFooter>
                    <Button color="info" onClick={this.toggle}>
                      <i className="nc-icon nc-email-85"></i> Enviar correo
                    </Button>
                    <Button color="secondary" onClick={this.toggle}>
                      Cancelar
                    </Button>
                  </ModalFooter>
                </Modal>
                <Row>
                  <Card body outline color="success">
                    <Row>
                      <Col className="px-2" md="5">
                        <CardHeader>
                          <CardTitle tag="h5">Información CSV</CardTitle>
                          <p className="card-category">
                            Datos de los estudiantes
                          </p>
                        </CardHeader>
                        <Card>
                          <CardBody>
                            <b>Información general</b>
                            <hr></hr>Cantidad de estudiantes:{" "}
                            <b>{this.state.data.length}</b>
                            <br></br>
                            <br></br>
                            <b>Información calificaciones</b>
                            <hr></hr>
                            Estudiantes con calificaciones inferiores a 60:{" "}
                            <b>{this.state.worstGrades.length}</b>
                            <br></br>
                            Estudiantes con calificaciones superiores a 60:{" "}
                            <b>{this.state.bestGrades.length}</b>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col className="px-2" md="7">
                        <br></br>
                        <br></br>
                        <PieChart
                          dataA={this.state.bestGrades.length}
                          dataB={this.state.worstGrades.length}
                        />
                      </Col>
                    </Row>
                    <br></br>
                    <Row>
                      <Col className="px-2" md="6">
                        <Card>
                          <CardBody align="justify">
                            <b>Información diagrama de barras</b>- <hr></hr>Los
                            atributos con mayor influencia en los - datos de los
                            estudiantes son los intentos y entregas - totales.
                            <br></br>
                            <br></br>
                            <BarChart
                              dataA={this.state.media[0][0]}
                              dataAA={this.state.media[0][3]}
                              dataB={this.state.media[0][1]}
                              dataBB={this.state.media[0][4]}
                              dataC={this.state.media[0][2]}
                              dataCC={this.state.media[0][5]}
                            />
                            <br></br>
                            <br></br>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col className="px-2" md="6">
                        <Card>
                          <CardBody align="justify">
                            <b>
                              Análisis de la información del diagrama de barras
                            </b>
                            <br></br>
                            <hr></hr>
                            {this.state.media[0][0] > this.state.media[0][3] ? (
                              <p>
                                Los estudiantes que aprueban hasta el momento
                                tienen una media de entregas totales superior a
                                los de bajo promedio, con una media de entregas
                                igual a :{" "}
                                <b>
                                  {Math.round(this.state.media[0][0] * 1000) /
                                    1000}
                                </b>
                              </p>
                            ) : (
                              <p>
                                Los estudiantes que no aprueban hasta el momento
                                tienen una media de entregas totales superior a
                                los que aprueban, con una media de entregas
                                igual a :{" "}
                                <b>
                                  {Math.round(this.state.media[0][3] * 1000) /
                                    1000}
                                </b>
                              </p>
                            )}
                            <br></br>
                            {this.state.media[0][1] > this.state.media[0][4] ? (
                              <p>
                                La media de la cantidad de intentos de los
                                estudiantes que aprueban es superior a los de
                                menor promedio:{" "}
                                <b>
                                  {Math.round(this.state.media[0][1] * 1000) /
                                    1000}
                                </b>
                              </p>
                            ) : (
                              <p>
                                La media de la cantidad de intentos de los
                                estudiantes que no aprueban es superior a los de
                                mayor promedio:{" "}
                                <b>
                                  {Math.round(this.state.media[0][4] * 1000) /
                                    1000}
                                </b>
                              </p>
                            )}
                            <br></br>
                            {this.state.media[0][2] > this.state.media[0][5] ? (
                              <p>
                                La media de la cantidad de intentos (fallidos y
                                aceptados como correctos) es superior en los
                                estudiantes que hasta el momento aprueban la
                                asignatura:{" "}
                                <b>
                                  {Math.round(this.state.media[0][2] * 1000) /
                                    1000}
                                </b>
                              </p>
                            ) : (
                              <p>
                                La media de la cantidad de intentos (fallidos y
                                aceptados como correctos) es superior en los
                                estudiantes que hasta el momento no aprueban la
                                asignatura:{" "}
                                <b>
                                  {Math.round(this.state.media[0][5] * 1000) /
                                    1000}
                                </b>
                              </p>
                            )}
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </Card>
                </Row>
                <Row>
                  <Col className="px-2" md="12">
                    <Card>
                      <CardHeader>
                        <CardTitle tag="h5">Tabla del CSV</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <BasicFiltering
                          columns={[
                            { title: "NOMBRE", field: "nombre" },
                            { title: "USUARIO", field: "usuario" },
                            { title: "CALIFICACIÓN", field: "calificacion" },
                            { title: "ENTREGAS", field: "entregas" },
                            { title: "INTENTOS", field: "intentos" },
                          ]}
                          data={this.state.tableData}
                          filter={true}
                        />
                      </CardBody>
                    </Card>
                  </Col>
                </Row>

                <Card body outline color="success">
                  <CardHeader>
                    <CardTitle tag="h5">
                      Algoritmos de clasificación{"   "}
                      <Badge color="info" onClick={this.toggleBadge}>
                        <i className="nc-icon nc-alert-circle-i"></i>
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <Card body outline color="success">
                    <Row>
                      <Col className="px-2" md="6">
                        <Collapse
                          isOpen={this.state.collapse}
                          align="justify"
                          title="Información"
                        >
                          <Card>
                            <CardBody>
                              <b>Matrices de confusión</b>
                              <br></br>
                              <br></br>
                              La matriz de confusión permite evaluar de la
                              precisión de cada algoritmo utilizado para el
                              proyecto. Teniendo en cuenta para ello el recuento
                              de verdaderos negativos, falsos negativos, los
                              verdaderos positivos y falsos positivos.
                              <br></br>
                              Para conocer más al respecto, visite la página
                              oficial de Sklearn (confusion_matrix):
                              <br></br>
                              <a
                                href="https://scikit-learn.org/stable/modules/generated/sklearn.metrics.confusion_matrix.html"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {" "}
                                Sklearn confusion matrix
                              </a>
                              <br></br>
                              <br></br>
                              <b>Curva ROC</b>
                              <br></br>
                              <br></br>
                              La curva ROC se encarga de evaluar la calidad de
                              las salidas por cada clasificador; se puede
                              observar, en la parte inferior cada uno de los
                              algoritmos y el desempeño de cada uno de acuerdo a
                              su clasificación, lo que permitirá conocer qué tan
                              adecuado resultó cada algoritmo para los datos en
                              cuestión.
                              <br></br>
                              Para conocer más al respecto, visite la página
                              oficial de Sklearn (ROC):
                              <br></br>
                              <a
                                href="https://scikit-learn.org/stable/auto_examples/model_selection/plot_roc.html#sphx-glr-auto-examples-model-selection-plot-roc-py"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {" "}
                                Sklearn ROC
                              </a>
                            </CardBody>
                          </Card>
                        </Collapse>
                      </Col>
                      <Col className="px-2" md="6">
                        <Collapse isOpen={this.state.collapse} align="justify">
                          <Card>
                            <CardBody>
                              <b>Información por algoritmo (tablas)</b>
                              <br></br>
                              <br></br>
                              Las tablas que se encuentran al lado de cada
                              matriz de confusión representan la información
                              obtenida por el reporte de clasificación de cada
                              algoritmo, donde atributo representa:
                              <br></br>
                              <br></br>
                              <b>precision: </b> Capacidad del clasificador de
                              no etiquetar como positiva una muestra que es
                              negativa.
                              <br></br>
                              <b>recall: </b> Capacidad del clasificador de
                              encontrar todas las muestras positivas.
                              <br></br>
                              <b>f1-score: </b>Media de precisión y
                              recuperación.
                              <br></br>
                              <b>support: </b> Número de ocurrencias de cada
                              clase en los valores objetivo.
                              <br></br>
                              <b>accuracy: </b> Puntaje de clasificación de
                              precisión.
                              <br></br>
                              <br></br>
                              Visite la página oficial de Sklearn para conocer
                              más al respecto (Metrics and scoring):
                              <br></br>
                              <br></br>
                              <a
                                href="https://scikit-learn.org/stable/modules/model_evaluation.html"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {" "}
                                Sklearn Metrics and scoring
                              </a>
                              <br></br>
                              <a
                                href="https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_recall_fscore_support.html"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {" "}
                                Sklearn Precision recall fscore support
                              </a>
                            </CardBody>
                          </Card>
                        </Collapse>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="px-2" md="6">
                        <Carousel
                          img1={this.state.dtImage}
                          img2={this.state.knnImage}
                        />
                      </Col>
                      <Col className="px-2" md="6">
                        <TableInfo
                          data={this.state.matrixDT}
                          algorithm="Decision Tree"
                        />
                        <TableInfo
                          data={this.state.matrixKNN}
                          algorithm="k-nearest neighbors"
                        />
                      </Col>
                    </Row>
                  </Card>
                  <br />
                  <Card body outline color="success">
                    <Row>
                      <Col className="px-2" md="6">
                        <TableInfo
                          data={this.state.matrixNB}
                          algorithm="Naive Bayes"
                        />
                        <TableInfo
                          data={this.state.matrixSVM}
                          algorithm="Support vector machine"
                        />
                      </Col>
                      <Col className="px-2" md="6">
                        <Carousel
                          img1={this.state.nbImage}
                          img2={this.state.svmImage}
                        />
                      </Col>
                    </Row>
                  </Card>
                  <Card body outline color="success">
                    <Row>
                      <Col className="px-2" md="6">
                        <ImageCSV
                          title="Comparación de los algoritmos de Machine
                      Learning"
                          data={this.state.rocImage}
                          name="roc"
                        />
                      </Col>
                      <Col className="px-2" md="6">
                        <Card>
                          <CardBody>
                            <CardTitle tag="h5">
                              <strong>Precisión</strong>
                            </CardTitle>
                            <CardSubtitle className="mb-2 text-muted">
                              <p className="card-category">
                                Cálculo de precisión de cada algoritmo
                                implementado
                              </p>
                            </CardSubtitle>
                            <CardText>
                              <MlTable
                                column1="Decision Tree"
                                column2="k-nearest neighbors"
                                column3="Naive Bayes"
                                column4="Support vector machine"
                                data1={this.state.accuracyDT}
                                data2={this.state.accuracyKNN}
                                data3={this.state.accuracyNB}
                                data4={this.state.accuracySVM}
                              />
                            </CardText>
                          </CardBody>
                        </Card>
                        <Card>
                          <CardBody>
                            <CardTitle tag="h5">
                              <strong>Curva ROC</strong>
                            </CardTitle>
                            <CardSubtitle className="mb-2 text-muted">
                              <p className="card-category">
                                Información de la evaluación de calidad de
                                salida de cada algoritmo clasificador
                              </p>
                            </CardSubtitle>
                            <CardText>
                              <MlTable
                                column1="Decision Tree"
                                column2="k-nearest neighbors"
                                column3="Naive Bayes"
                                column4="Support vector machine"
                                data1={this.state.rocDT}
                                data2={this.state.rocKNN}
                                data3={this.state.rocNB}
                                data4={this.state.rocSVM}
                              />
                            </CardText>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </Card>
                </Card>
              </div>
            ) : null}
            {this.state.spinner ? (
              <Spinner id="spinner_ml" color="info" />
            ) : null}
          </Col>
        </div>
      </>
    );
  }
}

export default Classification;

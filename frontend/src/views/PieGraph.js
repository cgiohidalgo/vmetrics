import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Card,
  CardTitle,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Row,
} from "reactstrap";

class PieGraph extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <>
        <div>
          <Card className="card-chart">
            <CardHeader>
              <CardTitle tag="h5">{this.props.title}</CardTitle>
              <p className="card-category">{this.props.description}</p>
            </CardHeader>
            <CardBody>
              <Pie data={this.props.data} options={this.props.options} />
            </CardBody>
            <CardFooter>
              <Row>
                <Col md="10">
                  <div className="stats">
                    <i className="fa fa-calendar" /> {this.props.footer}
                  </div>
                </Col>
                {this.props.optional !== -1 ? (
                  <Col md="2">{this.props.optional}</Col>
                ) : null}
              </Row>
            </CardFooter>
          </Card>
        </div>
      </>
    );
  }
}
export default PieGraph;

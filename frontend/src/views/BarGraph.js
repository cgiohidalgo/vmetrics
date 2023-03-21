import React from "react";
import { Bar } from "react-chartjs-2";
import { Card, CardBody, CardFooter, CardHeader, CardTitle } from "reactstrap";

class BarChart extends React.Component {
  render() {
    return (
      <div>
        <Card className="card-chart">
          <CardHeader>
            <CardTitle tag="h5">{this.props.title}</CardTitle>
            <p className="card-category">{this.props.description}</p>
          </CardHeader>
          <CardBody>
            <Bar data={this.props.data} options={this.props.options} />
          </CardBody>
          <CardFooter>
            <div className="stats">
              <i className="fa fa-check" /> {this.props.footer}
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }
}

export default BarChart;

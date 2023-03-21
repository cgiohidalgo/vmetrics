import React, { Component } from "react";
import { Card, CardBody, CardFooter, Table } from "reactstrap";

export default class CustomTable extends Component {
  render() {
    return (
      <div>
        <Card>
          <CardBody>
            <Table className="table table-bordered table-responsive-xl">
              <thead className="text text-info">
                <tr>
                  {this.props.columns.map((column) => {
                    return <th key={column}>{column}</th>;
                  })}
                </tr>
              </thead>

              <tbody>
                {this.props.rows.map((row) => {
                  return (
                    <tr key={row[0] + row[1]}>
                      <td itemScope="row">{row[0]}</td>
                      <td>{Math.round(row[1] * 100) / 100}</td>
                      <td>0</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </CardBody>
          <CardFooter></CardFooter>
        </Card>
      </div>
    );
  }
}

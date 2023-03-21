import React from "react";
import { Table } from "reactstrap";

class MlTable extends React.Component {
  render() {
    return (
      <div>
        <Table size="sm">
          <thead>
            <tr>
              <th>{this.props.column1}</th>
              <th>{this.props.column2}</th>
              <th>{this.props.column3}</th>
              <th>{this.props.column4}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{Math.round(this.props.data1 * 1000) / 1000}</td>
              <td>{Math.round(this.props.data2 * 1000) / 1000}</td>
              <td>{Math.round(this.props.data3 * 1000) / 1000}</td>
              <td>{Math.round(this.props.data4 * 1000) / 1000}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}
export default MlTable;

import React from "react";
import { Table } from "reactstrap";

class TableInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstColumn: [
        "aprueba",
        "no aprueba",
        "accuracy",
        "macro avg",
        "weighted avg",
      ],
      data: this.props.data,
    };
  }
  render() {
    return (
      <div>
        <p className="card-title">
          <strong>Algoritmo {this.props.algorithm}</strong>
        </p>
        <Table size="sm" bordered>
          <thead class="table-light">
            <tr>
              <th scope="row"></th>
              <th>precision</th>
              <th>recall</th>
              <th>f1-score</th>
              <th>support</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((value, i) => {
              if (i !== 2) {
                return (
                  <tr>
                    <th scope="row">{this.state.firstColumn[i]}</th>
                    <td>{Math.round(value.precision * 1000) / 1000}</td>
                    <td>{Math.round(value.recall * 1000) / 1000}</td>
                    <td>{Math.round(value["f1-score"] * 1000) / 1000}</td>
                    <td>{Math.round(value.support * 1000) / 1000}</td>
                  </tr>
                );
              }
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}
export default TableInfo;

import React, { Component } from "react";
import { MDBDataTable } from "mdbreact";
import axios from "axios";
import { endpoints } from "../variables/general";

class Table2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      tasks: [],
    };
  }

  componentDidMount = async () => {
    const response = await axios.get(endpoints.task);
    this.setState({
      tasks: response.data.data,
    });
    const columns = [
      {
        label: "PK",
        field: "pk",
        sort: "asc",
        width: 150,
      },
      {
        label: "Name",
        field: "name",
        sort: "asc",
        width: 150,
      },
      {
        label: "TaskID",
        field: "taskid",
        sort: "asc",
        width: 150,
      },
      {
        label: "Description",
        field: "description",
        sort: "asc",
        width: 150,
      },
    ];
    let rows = [];
    this.state.tasks.forEach((task) => {
      let r = {
        pk: task.pk,
        name: task.name,
        taskid: task.taskid,
        description: task.description,
      };
      rows.push(r);
    });
    this.setState({
      data: {
        columns: columns,
        rows: rows,
      },
    });
  };
  render() {
    return (
      <div>
        <MDBDataTable
          hover
          className="Table"
          entriesOptions={[5, 10, 25]}
          entries={5}
          pagesAmount={4}
          fixed={true}
          data={this.state.data}
        />
      </div>
    );
  }
}

export default Table2;

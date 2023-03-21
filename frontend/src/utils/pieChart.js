import React from "react";
import { Pie } from "react-chartjs-2";

function dataPie(firstData, secondData) {
  const data = {
    labels: ["Aprueba", "No aprueba"],
    datasets: [
      {
        label: "Estado",
        backgroundColor: ["#e3e3e3", "#4acccd"],
        hoverBackgroundColor: ["#e3e3e3", "#4acccd"],
        data: [firstData, secondData],
        hoverOffset: 4,
      },
    ],
  };
  return data;
}

class PieChart extends React.Component {
  render() {
    return (
      <div>
        <Pie
          data={dataPie(this.props.dataA, this.props.dataB)}
          options={{
            title: {
              display: true,
              text: "Estado de los estudiantes",
              fontSize: 15,
              fontFamily: "Arial",
              fontColor: "black",
              margin: "0",
            },
            legend: {
              display: true,
              position: "bottom",
              margin: "0",
            },
          }}
        />
      </div>
    );
  }
}
export default PieChart;

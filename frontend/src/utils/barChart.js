import React from "react";
import { Bar } from "react-chartjs-2";

function dataBar(
  firstDataA,
  firstDataB,
  secondDataA,
  secondDataB,
  thirdDataA,
  thirdDataB
) {
  const data = {
    labels: ["Aprueban", "No aprueban"],
    datasets: [
      {
        label: "Tareas entregadas",
        data: [firstDataA, firstDataB],
        backgroundColor: "rgb(255, 99, 132)",
      },
      {
        label: "Cantidad intentos",
        data: [secondDataA, secondDataB],
        backgroundColor: "rgb(54, 162, 235)",
      },
      {
        label: "Total Intentos",
        data: [thirdDataA, thirdDataB],
        backgroundColor: "rgb(75, 192, 192)",
      },
    ],
  };
  return data;
}

const options = {
  scales: {
    yAxes: [
      {
        gridLines: {
          color: "rgba(0, 0, 0, 0)",
        },
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },

  title: {
    display: true,
    text: "Entregas e intentos de los estudiantes",
    fontSize: 15,
    fontFamily: "Arial",
    fontColor: "black",
    margin: "0",
  },
};

class BarChart extends React.Component {
  render() {
    return (
      <div>
        <Bar
          data={dataBar(
            this.props.dataA,
            this.props.dataAA,
            this.props.dataB,
            this.props.dataBB,
            this.props.dataC,
            this.props.dataCC
          )}
          options={options}
        />
      </div>
    );
  }
}

export default BarChart;

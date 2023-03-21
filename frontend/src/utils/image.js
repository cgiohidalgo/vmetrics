import React from "react";
import { CardTitle } from "reactstrap";
class ImageCSV extends React.Component {
  render() {
    return (
      <>
        <h5>
          <CardTitle>{this.props.title}</CardTitle>
        </h5>
        <img src={this.props.data} alt={this.props.name}></img>
      </>
    );
  }
}

export default ImageCSV;

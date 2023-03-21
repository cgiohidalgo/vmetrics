import React from "react";

// reactstrap components
import { UncontrolledAlert } from "reactstrap";

class Sesion extends React.Component {
  render() {
    return (
      <>
        <div className="content">
          <UncontrolledAlert color="success" fade={false}>
            <span>
              <b>¡Gracias por utilizar nuestra página! </b>
              Vuelve pronto.
            </span>
          </UncontrolledAlert>
        </div>
      </>
    );
  }
}

export default Sesion;

import React from "react";
import { UncontrolledCarousel } from "reactstrap";

class Carousel extends React.Component {
  render() {
    const items = [
      {
        src: this.props.img1,
      },
      {
        src: this.props.img2,
        // altText: "Slide 2",
      },
    ];
    return (
      <div>
        {" "}
        <style>
          {`
              .custom-tag {
                max-width: 100%;
                max-height: 100%;
              }
              .carousel-control-next {
                filter: invert(100%);
                margin:-14px;
              }
              .carousel-control-prev {
                filter: invert(100%);
                margin:-14px;
              }
              `}
        </style>
        <br />
        <br />
        <br />
        <UncontrolledCarousel items={items} className="custom-tag" />
      </div>
    );
  }
}
export default Carousel;

const teamMembers = (
  <Card>
    <CardHeader>
      <CardTitle tag="h4">Team Members</CardTitle>
    </CardHeader>
    <CardBody>
      <ul className="list-unstyled team-members">
        <li>
          <Row>
            <Col md="2" xs="2">
              <div className="avatar">
                <img
                  alt="..."
                  className="img-circle img-no-padding img-responsive"
                  src={require("assets/img/faces/ayo-ogunseinde-2.jpg")}
                />
              </div>
            </Col>
            <Col md="7" xs="7">
              DJ Khaled <br />
              <span className="text-muted">
                <small>Offline</small>
              </span>
            </Col>
            <Col className="text-right" md="3" xs="3">
              <Button
                className="btn-round btn-icon"
                color="success"
                outline
                size="sm"
              >
                <i className="fa fa-envelope" />
              </Button>
            </Col>
          </Row>
        </li>
        <li>
          <Row>
            <Col md="2" xs="2">
              <div className="avatar">
                <img
                  alt="..."
                  className="img-circle img-no-padding img-responsive"
                  src={require("assets/img/faces/joe-gardner-2.jpg")}
                />
              </div>
            </Col>
            <Col md="7" xs="7">
              Universidad del Valle <br />
              <span className="text-success">
                <small>Available</small>
              </span>
            </Col>
            <Col className="text-right" md="3" xs="3">
              <Button
                className="btn-round btn-icon"
                color="success"
                outline
                size="sm"
              >
                <i className="fa fa-envelope" />
              </Button>
            </Col>
          </Row>
        </li>
        <li>
          <Row>
            <Col md="2" xs="2">
              <div className="avatar">
                <img
                  alt="..."
                  className="img-circle img-no-padding img-responsive"
                  src={require("assets/img/faces/clem-onojeghuo-2.jpg")}
                />
              </div>
            </Col>
            <Col className="col-ms-7" xs="7">
              Flume <br />
              <span className="text-danger">
                <small>Busy</small>
              </span>
            </Col>
            <Col className="text-right" md="3" xs="3">
              <Button
                className="btn-round btn-icon"
                color="success"
                outline
                size="sm"
              >
                <i className="fa fa-envelope" />
              </Button>
            </Col>
          </Row>
        </li>
      </ul>
    </CardBody>
  </Card>
);

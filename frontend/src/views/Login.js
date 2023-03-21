// React
import React, { useContext, useState } from "react";

import jwtDecode from "jwt-decode";

// reactstrap components
import { Card, CardHeader, CardBody, Row, Col, Form, Input } from "reactstrap";

// endpoint
import { ENDPOINTS } from "../utils/general";

// axios
import axios from "axios";
import FormGroup from "reactstrap/lib/FormGroup";
import Button from "reactstrap/lib/Button";
import { AppContext } from "context/AppContext";

const LoginTest = () => {
  const { user, setUser } = useContext(AppContext);
  const [userInfo, setUserInfo] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleclick = async (e) => {
    e.preventDefault();
    const data = { ...userInfo };
    try {
      const response = await axios.post(ENDPOINTS.login, data);
      const userData = jwtDecode(response.data.access);
      if (userData["role"] === "professor") {
        window.localStorage.setItem("token-access", response.data.access);
        window.sessionStorage.setItem("token-refresh", response.data.refresh);
        setUser({
          ...user,
          ...userData,
          logged: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="content">
        <Row className="justify-content-center">
          <Col md="5">
            <Card>
              <CardHeader>Login</CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col className="px-2" md="12">
                      <FormGroup>
                        <label htmlFor="">USERNAME</label>
                        <Input
                          name="username"
                          type="text"
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="px-2" md="12">
                      <FormGroup>
                        <label>PASSWORD</label>
                        <Input
                          name="password"
                          type="password"
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Button color="success" block onClick={handleclick}>
                        Login
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default LoginTest;

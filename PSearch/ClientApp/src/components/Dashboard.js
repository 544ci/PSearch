import React, { Component } from 'react';
import { Container, Row, Col } from "reactstrap";
let hrStyle = {
    borderTop: "1px solid white"
};
export class Dashboard extends Component {
  render () {
    return (
        <Container>
            <Row>
                <Col xs={2}>
                    <Container>
                        <Row>
                            <img
                                src={require("../icons/encrypt.svg")}
                                width="80"
                                height="80"
                                className="d-inline-block align-top"
                                alt="Encrypt data"
                            />
                        </Row>
                        <Row>Encrypt Data</Row>
                    </Container>
                </Col>
                <Col xs={2}>
                    <Container>
                        <Row>
                            <img
                                src={require("../icons/decrypt.svg")}
                                width="80"
                                height="80"
                                className="d-inline-block align-top"
                                alt="Encrypt data"
                            />
                        </Row>
                        <Row>Decrypt Data</Row>
                    </Container>
                </Col>
            </Row>
            <hr style={hrStyle} />
        </Container>
    );
  }
}

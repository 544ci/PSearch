import React, { Component } from 'react';
import { Container, Row, Col, Button, Card, CardTitle, CardText, CardImg, CardBody, CardDeck } from 'reactstrap';
import { Link } from 'react-router-dom'




export class Home extends Component {
  static displayName = Home.name;

  render () {
      return (
          <Container fluid>
              <Container style={{ marginTop: 50 }} className="border rounded bg-primary">
                  <Row>
                      <Col>
                          <div style={{ marginLeft:50, position: "absolute", top: "30%" }}>
                          <h1>PSearch</h1>
                          <h5>Mobile app for all your security needs</h5>
                          <br/>
                              <Link to={'phones'}><Button color="danger" >Get Started</Button></Link>
                      </div>
                    </Col>
                    <Col>
                          <img
                              src={require("../mainPageLogo.png")}
                              alt="logo"
                              className="img-fluid"
                      />
                    </Col>
              </Row>
              </Container>
              <hr />

              <Row style={{ marginTop:200 }}>

                  <Container>
                      <Row>
                      <Col className="text-center">
                          <h1>Features</h1>
                          <h5>PSearch provides a wide variety of features releated from security and everyday usage</h5>
                          </Col>
                      </Row>
                      <hr />

                      <Container fluid>
                          <Row >
                              <Col>
                              <CardDeck className="justify-content-center">
                                  <Card color="primary" className="text-center">
                                          <CardImg className="mt-4" top style={{ width: 100, margin: "0 auto" }} width="100%" src={require("../icons/security.svg")} alt="Card image cap" />
                                      <CardBody>
                                          <CardTitle>Data Encryption</CardTitle>

                                          <CardText>Encrypt your data remotely if your phone gets stolen.</CardText>
                                      </CardBody>
                                      </Card>
                                  <Card color="success" className="text-center">
                                          <CardImg className="mt-4" top style={{ width: 100, margin: "0 auto" }} width="100%" src={require("../icons/location.svg")} alt="Card image cap" />
                                      <CardBody>
                                          <CardTitle>Location</CardTitle>

                                          <CardText>Get live location of your phone</CardText>
                                      </CardBody>
                                  </Card>
                                  <Card color="info" className="text-center">
                                          <CardImg className="mt-4" top style={{ width: 100, margin: "0 auto" }} width="100%" src={require("../icons/find.svg")} alt="Card image cap" />
                                      <CardBody>
                                          <CardTitle>Find Phone</CardTitle>

                                          <CardText>Find your phone easily if it is nearby.</CardText>
                                      </CardBody>
                                      </Card>
                                  </CardDeck>
                                  <CardDeck className="mt-4">

                                  <Card color="danger" className="text-center">
                                          <CardImg className="mt-4" top style={{ width: 100, margin: "0 auto" }} width="100%" src={require("../icons/live.svg")} alt="Card image cap" />
                                      <CardBody>
                                          <CardTitle>Live Video</CardTitle>

                                          <CardText>Remotly access your phone's camera</CardText>
                                      </CardBody>
                                  </Card>
                                  <Card color="warning" className="text-center">
                                          <CardImg className="mt-4" style={{ width: 100, margin: "0 auto" }} top width="100%" src={require("../icons/reset.svg")} alt="Card image cap" />
                                      <CardBody>
                                          <CardTitle>Remote Wipe</CardTitle>

                                          <CardText>This card has supporting text below as a natural lead-in to additional content.</CardText>
                                      </CardBody>
                                  </Card>
                                      <Card color="light" className="text-center">
                                          <CardImg className="mt-4" top style={{ width: 100, margin:"0 auto" }} width="100px" src={require("../icons/info.svg")} alt="Card image cap" />
                                      <CardBody>
                                          <CardTitle>SMS/Call Info</CardTitle>

                                          <CardText>Retrieve Call info or messages from your phone</CardText>
                                      </CardBody>
                                      </Card>
                                  </CardDeck>

                                  </Col>
                          </Row>
                      </Container>
                  </Container>

              </Row>

            


          </Container>
  );
  }
}


import React, { Component } from 'react';
import { Container,Row,Col } from 'reactstrap';
import { NavMenu } from './NavMenu';
import { Link } from 'react-router-dom';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
export class Layout extends Component {
  static displayName = Layout.name;

  render () {
    return (
        <div>
        <ReactNotification />

            <NavMenu />
            <Container className="bodySize">
          {this.props.children}
        </Container>
            <Container>
                <Row style={{ marginTop: 50 }}>
                    <hr />
                </Row>
                <Row >

                    <Col>
                        <footer className="site-footer">
                            <div className="container">
                                <div className="row">
                                    <div className="col-sm-12 col-md-6">
                                        <h6>About</h6>
                                        <p className="text-justify"> Welcome to PSearch, your number one source for mobile security. We're dedicated to giving you the very best of security, with a focus on every day use.
Founded in 2020 by , PSearch has come a long way from its beginnings from a small project. We now serve customers all over the world,and are thrilled to be a part of the  wing of the security industry.
We hope you enjoy our products as much as we enjoy offering them to you.</p>
                                    </div>
                                   
                                    <div className="col-xs-6 col-md-3">
                                        <h6>Quick Links</h6>
                                        <ul className="footer-links">
                                            <li><Link to="phones">Phones</Link></li>
                                            <li><Link to="">Home</Link></li>
                                            <li><Link to="authentication/login">Login</Link></li>
                                            <li><Link to="authentication/profile">Account</Link></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                        </footer>

                    </Col>

                </Row>
            </Container>
      </div>
    );
  }
}

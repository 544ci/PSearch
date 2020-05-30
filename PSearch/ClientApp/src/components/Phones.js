import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Card, CardBody, Row, Col, CardTitle, CardSubtitle, CardText, Button, UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle, Container, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import request from './api-requests/Request'
import { store } from 'react-notifications-component';


export class Phones extends Component {
  static displayName = Phones.name;

  constructor(props) {
      super(props);
      this.modalToggle = this.modalToggle.bind(this);
      this.renderPhones = this.renderPhones.bind(this);
      this.getModal = this.getModal.bind(this);
      this.showEncryptModal = this.showEncryptModal.bind(this);
      this.encryptPhone = this.encryptPhone.bind(this);
      this.decryptPhone = this.decryptPhone.bind(this);
      this.resetPhone = this.resetPhone.bind(this);
      this.removePhone = this.removePhone.bind(this);
      this.showNotification = this.showNotification.bind(this);
      this.showDecryptModal = this.showDecryptModal.bind(this);
      this.showResetPhoneModal = this.showResetPhoneModal.bind(this);

      
      this.showRemovePhoneModal = this.showRemovePhoneModal.bind(this);
      this.state = { phones: [], loading: true, modal:false,modalTitle:"",modalDesc:"",modalType:"",loadingModal:true,phoneSelected:""};
  }

  componentDidMount() {
    this.populatePhones();
    }

    decryptPhone() {

    }
    resetPhone() {

    }
    showNotification(title,message,type) {
        store.addNotification({
            title: title,
            message: message,
            type: type,
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
                duration: 5000,
                onScreen: true
            }
        });
    }
    modalToggle() {
        this.setState({ modal: !this.state.modal })
    }
 
    getModal() {
        let func
        if (this.state.modalType === "encrypt")
            func = () => { this.encryptPhone(this.state.phoneSelected) }
        else if (this.state.modalType === "decrypt") {
            func = () => { this.decryptPhone(this.state.phoneSelected) }

        } else if (this.state.modalType === "reset") {
            func = () => { this.resetPhone(this.state.phoneSelected) }
        } else if (this.state.modalType === "remove") {
            func = () => { this.removePhone(this.state.phoneSelected) }
        }
        return (

            <Modal centered={true} isOpen={this.state.modal} toggle={this.modalToggle} >
                <ModalHeader toggle={this.modalToggle}>{this.state.modalTitle}</ModalHeader>
                <ModalBody>
                    {this.state.modalDesc}
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={func}>Confirm</Button>
                    <Button color="secondary"  onClick={this.modalToggle}>Cancel</Button>
                </ModalFooter>
             </Modal>
            )
    }
    showLoadingModal() {

    }
    showEncryptModal(phone) {
        this.setState({ modal: true, modalTitle: "Encrypt Phone", modalDesc: "Are you sure you want to encrypt this phone?", modalType: "encrypt", phoneSelected: phone.deviceId })
    }
    showDecryptModal(phone) {
        this.setState({ modal: true, modalTitle: "Decrypt Phone", modalDesc: "Are you sure you want to decrypt this phone?", modalType: "decrypt", phoneSelected: phone.deviceId  })
    }
    showRemovePhoneModal(phone) {
        this.setState({ modal: true, modalTitle: "Remove Phone", modalDesc: "Are you sure you want to remove this phone?", modalType: "remove", phoneSelected: phone.deviceId  })
    }
    showResetPhoneModal(phone) {
        this.setState({ modal: true, modalTitle: "Reset Phone", modalDesc: "Are you sure you want to reset this phone?", modalType: "reset", phoneSelected: phone.deviceId })
    }
    renderPhones(phones) {
        if (phones.length === 0) {
            return (<p className="text-danger">You have not added any phone.</p>)
        }
        let phoneCards = phones.map((phone, index) => {
            return (
                <Col style={{ marginBottom: 30 }} id={index} key={index} sm="3">
                    <Card style={{ minHeight: 250 , minWidth:250 }} color = "secondary" >
                        <CardBody style={{ height: "100%", width: "100%" }}>
                            <CardTitle><b className="text-info">Manufacturer</b>: {phone.manufacturer}</CardTitle>
                            <CardSubtitle><b className="text-info">Model</b>: {phone.model}</CardSubtitle>
                            <CardText><b className="text-info">Device Id</b>: {phone.deviceId}</CardText>
                            <UncontrolledButtonDropdown >
                                <DropdownToggle style={{ alignSelf:"bottom" }} color="info" caret>
                                    Actions
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem className="text-info" header>Track</DropdownItem>
                                    <Link to={`location/${phone.deviceId}`}><DropdownItem>Last Known Location</DropdownItem></Link>
                                    <DropdownItem divider />
                                    <DropdownItem className="text-info" header>Security</DropdownItem>
                                    <DropdownItem onClick={() => { this.showEncryptModal(phone) }}>Encrypt Phone</DropdownItem>
                                    <DropdownItem onClick={() => { this.showDecryptModal(phone) }}>Decrypt Phone</DropdownItem>
                                    <DropdownItem onClick={() => { this.showResetPhoneModal(phone) }}>Reset Phone</DropdownItem>
                                    <Link to={`gallery/${phone.deviceId}`}><DropdownItem>Intruders</DropdownItem></Link>
                                    <Link to={`live/${phone.deviceId}`}><DropdownItem>Live Video</DropdownItem></Link>
                                    <DropdownItem>Recorded Videos</DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem className="text-info" header>Information</DropdownItem>
                                    <Link to={`Messages/${phone.deviceId}`}><DropdownItem>Messages</DropdownItem></Link>
                                    <Link to={`calllogs/${phone.deviceId}`}><DropdownItem>Call Logs</DropdownItem></Link>
                                    <DropdownItem divider />
                                    <DropdownItem className="text-danger" onClick={() => {this.showRemovePhoneModal(phone)}}>Remove Phone</DropdownItem>

                                </DropdownMenu>
                            </UncontrolledButtonDropdown>
                        </CardBody>
                    </Card>
                </Col>
            )
        }
            )

        return (<Container fluid><Row>{phoneCards} </Row></Container>)
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : this.renderPhones(this.state.phones);

    return (
        <div>
            <h1 id="tabelLabel" className="text-info" >Your Phones</h1>
        <p>Select a phone to monitor.</p>
            {contents}
            {this.getModal()}
      </div>

    );
  }

    async populatePhones() {
        let resp = await request.getPhones();
        if (resp.status == 200)
            this.setState({ phones: resp.data, loading: false });
        else
            this.setState({ loading: false });
    }
    async encryptPhone(deviceId) {
        let data = await request.encryptPhone(this.state.phoneSelected);
        if (data.status == 200)
            this.showNotification(data.data.message, " ", "success")
        else 
            this.showNotification(data.data.message, " ", "danger")
        this.modalToggle();

    }
    async decryptPhone(deviceId) {
        let data = await request.decryptPhone(this.state.phoneSelected);
        if (data.status == 200)
            this.showNotification(data.data.message, " ", "success")
        else
            this.showNotification(data.data.message, " ", "danger")
        this.modalToggle();

    }
    async resetPhone(deviceId) {
        let data = await request.resetPhone(this.state.phoneSelected);
        if (data.status == 200)
            this.showNotification(data.data.message, " ", "success")
        else
            this.showNotification(data.data.message, " ", "danger")
        this.modalToggle();
    }
    async removePhone(deviceId) {
        let data = await request.removePhone(this.state.phoneSelected);
        if (data.status == 200)
            this.showNotification(data.data.message, " ", "success")
        else
            this.showNotification(data.data.message, " ", "danger")
        this.modalToggle();
    }
}

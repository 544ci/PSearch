import React, { Component } from 'react';
import request from './api-requests/Request'
import { Table, Button } from "reactstrap"
import { store } from 'react-notifications-component';
import Moment from 'react-moment';

export class Messages extends Component {

  constructor(props) {
    super(props);
      this.state = { messages: [], loading: true };
      this.getMessages = this.getMessages.bind(this)
      this.renderMessages = this.renderMessages.bind(this)
      this.requestUpdate = this.requestUpdate.bind(this)

  }

  componentDidMount() {
    this.getMessages();
  }

    renderMessages(messages) {
        if (messages.length === 0) {
            return <div><div style={{ textAlign: "right" }}><Button style={{ marginBottom: 10 }} color="primary" onClick={this.requestUpdate}>Request Update</Button></div><p className="text-danger">No Messages available</p></div>
        }
        let rows = messages.map((value, index) => (<tr key={index}><td>{index + 1}</td><td>{value.message}</td><td><Moment>{value.date}</Moment></td></tr>))

        return (
            <div>
                <div style={{ textAlign: "right" }}><Button style={{ marginBottom: 10 }} color="primary" onClick={this.requestUpdate}>Request Update</Button></div>
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Message</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                 </Table>  
            </div>

    );
  }

  render() {
    let contents = this.state.loading
        ? <p><em>Loading...</em></p>
        : this.renderMessages(this.state.messages);

    return (
      <div>
            <h1 id="tabelLabel" className="text-info" >Messages</h1>
            {contents}
      </div>
    );
  }

    async getMessages() {
        let deviceId = this.props.match.params.deviceId
        let data = await request.getMessages(deviceId)
        if (data.status === 200)
            this.setState({ messages: data.data, loading: false })
        else 
            this.setState({loading: false })
    }

    async requestUpdate() {
        let deviceId = this.props.match.params.deviceId
        let data = await request.updateMessagesRequest(deviceId)
        if (data.status === 200)
            this.showNotification("SMS update request queued"," ","success")
        else
            this.showNotification("SMS update reqyest failed", " ", "danger")
    }

    showNotification(title, message, type) {
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
}

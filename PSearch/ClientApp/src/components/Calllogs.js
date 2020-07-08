import React, { Component } from 'react';
import request from './api-requests/Request'
import { Table, Button } from "reactstrap"
import { store } from 'react-notifications-component';
import Moment from 'react-moment';

export class Calllogs extends Component {

  constructor(props) {
    super(props);
      this.state = { callLogs: [], loading: true };
      this.getCallLogs = this.getCallLogs.bind(this)
      this.renderCallLogs = this.renderCallLogs.bind(this)
      this.requestUpdate = this.requestUpdate.bind(this)

  }

  componentDidMount() {
    this.getCallLogs();
  }

    renderCallLogs(callLogs) {
        if (callLogs.length === 0)
            return <div>                <div style={{ textAlign: "right" }}><Button style={{ marginBottom: 10 }} color="primary" onClick={this.requestUpdate}>Request Update</Button></div>
 <p className="text-danger">No call logs available</p></div>
        console.log(callLogs)
        let rows = callLogs.map((value, index) => (<tr key={index}><td>{index + 1}</td><td>{value.call_to}</td><td>{value.duration}</td><td>{value.status}</td><td><Moment>{value.date}</Moment></td></tr>))

        return (
            <div>
                <div style={{ textAlign: "right" }}><Button style={{ marginBottom:10 }} color="primary" onClick={this.requestUpdate}>Request Update</Button></div>
                <Table bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Number</th>
                    <th>Duration</th>
                    <th>Status</th>
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
        : this.renderCallLogs(this.state.callLogs);

    return (
      <div>
        <h1 id="tabelLabel" >Call Logs</h1>
            {contents}
      </div>
    );
  }

    async getCallLogs() {
        let deviceId = this.props.match.params.deviceId
        let resp = await request.getCallLogs(deviceId);
        if (resp.status === 200)
            this.setState({ callLogs: resp.data, loading: false });
        else 
            this.setState({ loading: false });
    }
    async requestUpdate() {
        let deviceId = this.props.match.params.deviceId
        let data = await request.updateCalllogsRequest(deviceId)
        if (data.status === 200)
            this.showNotification("Call Logs update request queued", " ", "success")
        else
            this.showNotification("Call Logs update reqyest failed", " ", "danger")
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

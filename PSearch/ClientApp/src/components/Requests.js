import React, { Component } from 'react';
import request from './api-requests/Request'
import { Table, Button, Badge } from "reactstrap"
import { store } from 'react-notifications-component';
import Moment from 'react-moment';
export class Requests extends Component {

  constructor(props) {
    super(props);
      this.state = { requests: [], loading: true };
      this.getRequests = this.getRequests.bind(this)
      this.renderRequests = this.renderRequests.bind(this)
  }

  componentDidMount() {
      this.getRequests();
  }

    renderRequests(requests) {
        console.log(requests)
        if (requests.length === 0) {
            return <div><div style={{ textAlign: "right" }}><Button style={{ marginBottom: 10 }} color="primary" onClick={this.getRequests}>Update</Button></div><p className="text-danger">No Messages available</p></div>
        }
        let rows = requests.map((value, index) => (<tr key={index}><td>{index + 1}</td><td>{this.getRequestName(value.requestId)}</td><td>{this.getStatusBadge(value.status)}</td><td><Moment>{value.lastModified}</Moment></td></tr>))

        return (
            <div>
                <div style={{ textAlign: "right" }}><Button style={{ marginBottom: 10 }} color="primary" onClick={this.getRequests}>Update</Button></div>
                <Table hover bordered>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Request</th>
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
    getRequestName(id) {
        switch (id) {
            case 1:
                return "Phone Encryption"
            case 2:
                return "Phone Decryption"
            case 3:
                return "Reset Phone"
            case 4:
                return "Update Messages"
            case 5:
                return "Update Calllogs"
            case 6:
                return "Live Video"
            default:
           
        }
    }

    getStatusBadge(status) {
        switch (status) {
            case 1:
                return <h5> <Badge color="primary">Queued</Badge></h5>
            case 2:
                return <h5> <Badge color="warning">Sent to phone</Badge></h5>
            case 3:
                return <h5> <Badge color="success">Completed</Badge></h5>
            case 4:
                return <h5> <Badge color="danger">Failed</Badge></h5>
            case 5:
                return <h5> <Badge color="success">Completed</Badge></h5>
            default:
                return 
        }
    }

  render() {
    let contents = this.state.loading
        ? <p><em>Loading...</em></p>
        : this.renderRequests(this.state.requests);

    return (
      <div>
            <h1 id="tabelLabel" className="text-info" >Requests</h1>
            {contents}
      </div>
    );
  }

    async getRequests() {
        this.setState({ loading:true })
        let deviceId = this.props.match.params.deviceId
        let data = await request.getRequests(deviceId)
        if (data.status === 200)
            this.setState({ requests: data.data, loading: false })
        else 
            this.setState({loading: false })
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

import React, { Component } from 'react';
import { Button } from "reactstrap"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import request from './api-requests/Request'
import Loader from 'react-loader-spinner'
import { FcHighPriority } from 'react-icons/fc'
import { ReactFlvPlayer } from 'react-flv-player'

export class Video extends Component {
    static displayName = Video.name;
    constructor(props) {
        super(props);
        this.state = { connecting: true, phoneAvailable: false }
  //      this.state = { connecting: false, phoneAvailable: true}

        this.sendRequest = this.sendRequest.bind(this)
        this.tryAgain = this.tryAgain.bind(this)
        this.checkLiveStream = this.checkLiveStream.bind(this)

    }
    async sendRequest() {
        let deviceId = this.props.match.params.deviceId
        let resp = await request.liveVideoRequest(deviceId);
        if (resp.status == 200) {
           // this.checkLiveStream();
        }
        else
            this.setState({ phoneAvailable: false, connecting:false });
    }
    componentDidMount() {
       // this.checkLiveStream()

       this.sendRequest()
    }
    tryAgain() {
        this.setState({ connecting: true })
        this.checkLiveStream()
    }
    async checkLiveStream() {
        let timerId  = setInterval(async () => {
            let resp = await request.checkLiveStream(this.props.match.params.deviceId);
            console.log(resp)
            if (resp.status == 200 && !this.state.streamURL)
                this.setState({ connecting: false,  phoneAvailable: true, streamURL: resp.data.url })
        }, 1000)
        setTimeout(() => {
            clearInterval(timerId); if (this.state.connecting === true) { this.setState({ connecting: false, phoneAvailable:false }) }
        }, 10000)
    }
    render() {
        if (this.state.connecting) {
            return (
                <div style={{ textAlign: "center", marginTop: 200 }}>
                    <Loader type="TailSpin" color="#00BFFF" height={100} width={100} />
                    <h3 style={{ marginTop: 10 }} className="text-info">Connecting</h3>
                </div>
            )

        } else if (this.state.phoneAvailable === false) {
            return (
                <div style={{ textAlign: "center",marginTop:200 }}>
                    <FcHighPriority size={100} />
                    <h3 className="text-danger">Phone Offline</h3>
                    <Button onClick={ this.tryAgain } style={{ marginTop: 10 }} color="primary" >Try Again</Button>
                </div>
            )
        }
        else {
            return (
                <div style={{ textAlign: "right" }}>

                    <div style={{ textAlign: "left" }}><h1 className="text-info" >Live Video</h1></div>

                    <ReactFlvPlayer
                        url={this.state.streamURL}
                    heigh="500px"
                    width="100%"
                        isMuted={true}
                    />
                    <Button style={{ marginTop: 10 }} color="danger" >Record</Button>

                </div>
            );
        }
    }
}

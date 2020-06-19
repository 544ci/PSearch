import React, { Component } from 'react';
import { Button } from "reactstrap"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import request from './api-requests/Request'
import Loader from 'react-loader-spinner'
import { FcHighPriority } from 'react-icons/fc'
import { ReactFlvPlayer } from 'react-flv-player'
import { store } from 'react-notifications-component';

export class Video extends Component {
    static displayName = Video.name;
    constructor(props) {
        super(props);
        this.state = { connecting: true, phoneAvailable: false,recoring:false, }
  //      this.state = { connecting: false, phoneAvailable: true}

        this.sendRequest = this.sendRequest.bind(this)
        this.tryAgain = this.tryAgain.bind(this)
        this.record = this.record.bind(this)

        this.stopRecord = this.stopRecord.bind(this)

        this.checkLiveStream = this.checkLiveStream.bind(this)

    }
    async sendRequest() {
        let deviceId = this.props.match.params.deviceId
        let resp = await request.liveVideoRequest(deviceId);
        if (resp.status === 200) {
           //this.checkLiveStream();
        }
        else
            this.setState({ phoneAvailable: false, connecting:false });
    }
    componentDidMount() {
        this.sendRequest()

       this.checkLiveStream()
    }
    async record() {
        let deviceId = this.props.match.params.deviceId
        let resp = await request.record(deviceId);
        if (resp.status === 200) {
            this.setState({ vidId: resp.data.videoId, recoring: true })
            this.showNotification("Recording Video"," ","success")
        }
        else {
            this.showNotification("Unable to start recording", " ", "danger")

        }
    }
    async stopRecord() {
        let deviceId = this.props.match.params.deviceId
        let resp = await request.stopRecord(deviceId,this.state.vidId);
        if (resp.status === 200) {
            this.setState({ recoring: false })
            this.showNotification("Recording Stopped", " ", "success")
        }
        else {
            this.showNotification("Error", " ", "danger")

        }
    }
    tryAgain() {
        this.setState({ connecting: true })
        this.checkLiveStream()
    }
    async checkLiveStream() {
        let timerId  = setInterval(async () => {
            let resp = await request.checkLiveStream(this.props.match.params.deviceId);
            console.log(resp)
            if (resp.status === 200 && !this.state.streamURL)
                this.setState({ connecting: false,  phoneAvailable: true, streamURL: resp.data.url })
        }, 1000)
        setTimeout(() => {
            clearInterval(timerId); if (this.state.connecting === true) { this.setState({ connecting: false, phoneAvailable:false }) }
        }, 10000)
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
            let b;
            if (this.state.recoring)
                b = <Button onClick={this.stopRecord} style={{ marginTop: 10 }} color="danger" >Stop Recording</Button>
            else
                b = <Button onClick={this.record} style={{ marginTop: 10 }} color="danger" >Record</Button>

            return (
                <div style={{ textAlign: "right" }}>

                    <div style={{ textAlign: "left" }}><h1 className="text-info" >Live Video</h1></div>

                    <ReactFlvPlayer
                        url={this.state.streamURL}
                    heigh="500px"
                    width="100%"
                        isMuted={true}
                    />

                    {b}

                </div>
            );
        }
    }
}

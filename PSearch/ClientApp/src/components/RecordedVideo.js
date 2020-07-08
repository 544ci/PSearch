import React, { Component } from 'react';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import request from './api-requests/Request'
import { FcStart } from 'react-icons/fc'
import { store } from 'react-notifications-component';
import ModalVideo from 'react-modal-video'
import { Card, CardBody, Row, Col,  CardFooter, CardText, Container} from 'reactstrap';
import Moment from 'react-moment';

import 'react-modal-video/scss/modal-video.scss';


export class RecordedVideo extends Component {
    static displayName = RecordedVideo.name;
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            loading: true,
        }
        this.openModal = this.openModal.bind(this)
        this.renderVideos = this.renderVideos.bind(this);
        this.populateVideos = this.populateVideos.bind(this);
    }
    componentDidMount() {
        this.populateVideos();
    }
    openModal(url) {
        console.log(url)
        this.setState({
            isOpen: true, selectedVideoUrl: url })
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
        //return (
        //    <div>
        //        <ModalVideo channel='custom' isOpen={this.state.isOpen} url="http://localhost:5000/videos/4fb7f535-c30e-4b24-bddd-0f8ed0d37a88.mp4" onClose={() => this.setState({ isOpen: false })} />
        //    <button onClick={this.openModal}>Open</button>
        //    </div>     
        //)

        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderVideos(this.state.videos);

        return (
            <div>
                <h1 id="tabelLabel" className="text-info" >Your Recorded Videos</h1>
                <p>Select a phone to monitor.</p>
                {contents}
                <ModalVideo channel='custom' isOpen={this.state.isOpen} url={this.state.selectedVideoUrl} onClose={() => this.setState({ isOpen: false })} />
            </div>

        );
    }



    renderVideos(videos) {
        if (videos.length === 0) {
            return (<p className="text-danger">No videos available.</p>)
        }
        let videosCards = videos.map((video, index) => {
            return (
                <Col style={{ marginBottom: 30 }} id={index} key={index} sm="3">
                    <Card  outline color="primary"  >
                        <CardBody className="text-center">
                            <FcStart onClick={() => this.openModal(video.url)} size="7em" />

                        </CardBody>
                        <CardFooter><CardText ><Moment>{video.date}</Moment></CardText></CardFooter>

                    </Card>
                </Col>
            )
        }
        )

        return (<Container fluid><Row>{videosCards} </Row></Container>)
    }



    async populateVideos() {
        let deviceId = this.props.match.params.deviceId
        let resp = await request.getVideos(deviceId);
        console.log(resp.data)
        if (resp.status === 200)
            this.setState({ videos: resp.data, loading: false });
        else
            this.setState({ loading: false });
    }
}

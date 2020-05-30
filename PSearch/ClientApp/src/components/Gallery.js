import React from "react";
import request from './api-requests/Request'
import Gallery from 'react-grid-gallery';

export class IntruderGallery extends React.Component {
    constructor(props){
        super(props)
        this.state={
            images:[]
        }
        this.format = this.format.bind(this);
        this.getImages = this.getImages.bind(this);

    }

    componentDidMount() {
        this.getImages()
    }
    async getImages() {
        let deviceId = this.props.match.params.deviceId
        let resp = await request.getImages(deviceId);
        console.log(resp)
        if (resp.status == 200) 
            this.format(resp.data);
        
    }

    format(response){
        let images=[]
        response.forEach(element => {
            images.push({
                src: "http://localhost:3581/images/"+element.imageName,
                thumbnail: "http://localhost:3581/images/" + element.imageName,
                thumbnailWidth: 320,
                thumbnailHeight: 320,
                isSelected: false,
                caption: new Date(Date.parse(element.date)).toString()
            })

        });
        this.setState({
            images:images
        })

    }

  render() {
    return (
        <div>
            <h1 id="tabelLabel" class="text-info" >Intruders</h1>
            <Gallery images={this.state.images} />
    
      </div>
    );
  }
}
export default Gallery

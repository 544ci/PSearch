import React, { Component } from "react";
import { Map as LeafletMap, Marker, Popup, TileLayer } from "react-leaflet";
import { Container, Col, Row, ListGroup, FormGroup, Input,  ListGroupItemHeading, ListGroupItem } from "reactstrap";
import Moment from 'react-moment';
import '../custom.css';
import request from './api-requests/Request'
import L from "leaflet";
import "leaflet/dist/leaflet.css";
const style = {
    borderRadius: "10px",
    padding: "5px",

    height: "630px",

};
const style1 = {
    overflowY: "scroll",
    height: "620px"
};

const iconLocation = new L.Icon({
  iconUrl: require("../icons/marker2.svg"),
  iconRetinaUrl: require("../icons/marker2.svg"),
  iconAnchor: [32,32],
  popupAnchor: [0, -10],
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: new L.Point(50, 50)
});
const iconSelectedLocation = new L.Icon({
    iconUrl: require("../icons/marker1.png"),
    iconRetinaUrl: require("../icons/marker1.png"),
    iconAnchor: [32, 32],
    popupAnchor: [0, -10],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(50, 50)
});
export class Map extends Component {
  constructor() {
      super();
      this.state = {
      position: [33.6844, 73.0479],
      selectedLocations:[],
      locations:[]
    };
      this.getLocations = this.getLocations.bind(this);
      this.addLocationsSidebar = this.addLocationsSidebar.bind(this);
      this.selectItem = this.selectItem.bind(this)
      this.searchDate = this.searchDate.bind(this)
  }

  render() {
      return (
          <Container className="container-fluid">
              <Row>
                  <h1 id="tabelLabel" className="text-info" >Available Phone Locations</h1>
              </Row>
              <Row >
                  <Col md="3">
                      <Row>
                          <Col style={style1}>
                              <ListGroup className="overflow-auto">
                                  <FormGroup>
                                      <Input
                                          onChange={this.searchDate}
                                          type="date"
                                          id="date"
                                          placeholder="date placeholder"
                                      />
                                  </FormGroup>
                              {this.addLocationsSidebar()}
                           </ListGroup>
                             </Col>
                      </Row>
                  </Col>
                  <Col md="9">
                      <div className="leaflet-container" style={style}>
                          <LeafletMap style={{ width: "100%", height: 600 }} center={this.state.position} zoom={13}>

                              <TileLayer
                                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                              />
                              {this.createMarkers()}
                          </LeafletMap>
                      </div>
                  </Col>
              </Row>
          </Container>
       
    );
  }
    componentDidMount() {
        this.getLocations();
    }

    async getLocations() {
        let deviceId = this.props.match.params.deviceId
        let resp = await request.getLocations(deviceId);
        if (resp.status === 200) {
            this.setState({ locations: resp.data, selectedLocations: resp.data })
        }
    }

createMarkers(){
    const locations = this.state.locations.map((value, index) =>
        <Marker key={index} opacity="1" icon={(this.state.position[0] === value.latitude && this.state.position[1] === value.longitude) ? iconSelectedLocation : iconLocation} position={[value.latitude, value.longitude]}>
        <Popup>
                  <b>Latitude:</b> {value.latitude}  <b>Longitude:</b> {value.longitude} <br /> <Moment>{value.time}</Moment>
        </Popup>
  </Marker>
  )
  return(locations)
    }
    searchDate() {
        let searchDate = new Date( Date.parse(document.getElementById("date").value));
        let searchResult = [];
        this.state.locations.forEach(value => {
            let d = new Date(Date.parse(value.time));
            if (d.getDate() === searchDate.getDate() && d.getMonth() === searchDate.getMonth() && d.getYear() === searchDate.getYear())
                searchResult.push(value)
        })

        this.setState({ selectedLocations: searchResult })
    }

    addLocationsSidebar() {

        if (this.state.selectedLocations.length === 0)
            return (<p className="text-danger">No Locations Available</p>)
        const listItem = this.state.selectedLocations.map((value, index) =>
            <ListGroupItem key={index} color="info" onClick={() => { this.selectItem(index) }} tag="button">
                <ListGroupItemHeading className="text-dark" key={index}>{<Moment>{value.time}</Moment>}</ListGroupItemHeading>
            </ListGroupItem>
        )

        return listItem
    }

    selectItem(index) {
        this.setState({
            position: [this.state.locations[index].latitude, this.state.locations[index].longitude]
        })
    }

}

export default Map;

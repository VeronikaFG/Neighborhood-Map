import React, {Component} from "react";
import MenuLocations from "./MenuLocations";
import {Places} from "./Places.js";
import {colorMap} from "./colorMap.js";
import scriptLoader from "react-async-script-loader";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "localizations": Places,
            "map": "",
            "infowindow": "",
            "usermarker": ""
        };

        this.initMap = this.initMap.bind(this);
        this.showInfoWindow = this.showInfoWindow.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);
    }

    componentDidMount(){
       window.initMap = this.initMap;
    }

  // Initial Google Map
    initMap() {
        let elem = this;

        var centralizedmap = document.getElementById('map');
        // styling map full screen
        centralizedmap.style.height = "100vh";
        const map = new window.google.maps.Map(centralizedmap, {
            center: {lat: 40.9957141, lng: 17.2190192},
            zoom: 18,
            styles: colorMap,
            mapTypeControl: false
        });

        window.google.maps.event.addDomListener(window, "resize", function () {
            let center = map.getCenter();
            window.google.maps.event.trigger(map, "resize");
            elem.state.map.setCenter(center);
        });

        let InfoWindow = new window.google.maps.InfoWindow({});

        window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
            elem.closeInfoWindow();
        });

        window.google.maps.event.addListener(map, 'click', function () {
            elem.closeInfoWindow();
        });

        this.setState({
            'map': map,
            'infowindow': InfoWindow
        });
        // Initialize localizations
        let localizations = [];
        this.state.localizations.forEach(function (viewpoint) {
            let titleplace = viewpoint.name
            let marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng
                (viewpoint.latitude, viewpoint.longitude),
                animation: window.google.maps.Animation.DROP,
                map: map
            });

            // if the user click on the marker, a info window will open
            marker.addListener('click', function () {
                elem.showInfoWindow(marker);
            });
            
            viewpoint.display = true;
            viewpoint.titleplace = titleplace;
            viewpoint.marker = marker;
            localizations.push(viewpoint);
        });
        this.setState({
            'localizations': Places,
        });
    }

    showInfoWindow(marker) {
        this.closeInfoWindow();
        this.state.infowindow.open(this.state.map, marker);
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        this.setState({
            "usermarker": marker
        });
        this.state.infowindow.setContent('Load info.........');
        // Centralize the selected marker in the map
        this.state.map.setCenter(marker.getPosition());

        this.retrieveInfo(marker);
    }

    closeInfoWindow() {
        if (this.state.usermarker) {
            this.state.usermarker.setAnimation(null);
        }
        this.setState({
            "usermarker": ""
        });
        this.state.infowindow.close();
    }

    retrieveInfo(marker) {
        let elem = this;
        let clientSecret = "KH2KCPBLSM4PUWRU1GWJ1YUTQD4YJUZ1ZU2UWNNZGMHSVCAQ";
        let clientId = "KSQRXHPVGEMSIGMQVW0AM3S0Z34BNQB1SKUHKZXDJ5KTN4LV";
        let request = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20180718&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";
        fetch(request)
            .then(
                function (response) {
                  // failed error response :(
                    if (response.status !== 200) {
                        elem.state.infowindow.setContent("Info error loading");
                        return;
                    }
                    response.json().then(function (data) {
                      // successful response
                        let location_data = data.response.venues[0];
                        let retrieveData = '<a href="https://foursquare.com/v2/venues/search?'+ location_data.id +'" target="_blank">See the location on Foursquare</a>'
                        elem.state.infowindow.setContent(retrieveData);
                    });
                }
            )
            .catch(function (err) {
                elem.state.infowindow.setContent("Info error loading");
            });
    }

    //render the map in the app
    render() {
        return (
            <div role="main">
                <MenuLocations
                  localizations={this.state.localizations}
                  showInfoWindow={this.showInfoWindow}
                  closeInfoWindow={this.closeInfoWindow}
                />
                <div id="map" role="application"></div>
            </div>
        );
    }
}

 export default scriptLoader(
     ['https://maps.googleapis.com/maps/api/js?key=AIzaSyDKmgEgVbvwtPnS67YoroVxddk2rS9lMgg&v=3&callback=initMap']
 )(App);

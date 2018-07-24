import React, {Component} from 'react';
import ViewPlace from './ViewPlace';

class MenuLocations extends Component {
// Initialize Constructor
    constructor(props) {
        super(props);
        this.state = {
            "menuplaces": true,
            "locations": "",
            "inputText": "",
        };

        this.findLocations = this.findLocations.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
    }

    componentWillMount() {
        this.setState({
            "locations": this.props.localizations
        });
    }

    findLocations(e) {
        let locations = [];
        this.props.closeInfoWindow();
        const {value} = e.target;
        this.props.localizations.forEach(function (viewpoint) {
            if (viewpoint.titleplace.toUpperCase().indexOf(value.toUpperCase()) >= 0) {
                viewpoint.marker.setVisible(true);
                locations.push(viewpoint);
            } else {
                viewpoint.marker.setVisible(false);
            }
        });

        this.setState({
            "locations": locations,
            "inputText": value
        });
    }

    toggleMenu() {
        this.setState({
            "menuplaces": !this.state.menuplaces
        });
    }

    render() {
        let identifiedplace = this.state.locations.map(function (locationId, id) {
            return (
                <ViewPlace
                  key={id}
                  showInfoWindow={this.props.showInfoWindow.bind(this)}
                  data={locationId}
                />
            );
        }, this);

        return (

            <div className="start-menu" role="search" aria-label="searching places">
              <button className="button"
                // when the user click on button will start research,
                onClick={this.toggleMenu}>Start Research
              </button>
               <ul>
                 {this.state.menuplaces && identifiedplace}
               </ul>
               {/* Definition semantic ARIA attributes*/}
                  <input role="search"
                    aria-labelledby="filter"
                    id="search-field"
                    className="visual-input"
                    type="text"
                    placeholder="🔎 Powered by Foursquare"
                    value={this.state.inputText}
                    onChange={this.findLocations}
                  />
            </div>
        );
    }
}

export default MenuLocations;

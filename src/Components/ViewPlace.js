import React from "react";

class ViewPlace extends React.Component {

    render() {
        return (
            <li className="venues-list" tabIndex="1" role="button"
              onKeyPress={this.props.showInfoWindow.bind(this, this.props.data.marker)}
              onClick={this.props.showInfoWindow.bind(this, this.props.data.marker)}>
              {this.props.data.titleplace}
            </li>
        );
    }
}

export default ViewPlace;

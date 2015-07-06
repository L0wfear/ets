import React, { Component } from 'react';

class Panel extends Component {

  render() {
    return (
      <div className="chart-wrapper">
        <div className="chart-title">
          {this.props.title}
        </div>
        <div className="chart-stage" style={{ textAlign: 'center' }}>
          {this.props.children}
        </div>
      </div>
    );
  }

}

export default Panel;

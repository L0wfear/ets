import React from 'react/addons';
import CarInfo from './CarInfo.jsx';
import Panel from './Panel.jsx';

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

export default React.createClass({

  getDefaultProps() {
    return {
      open: true
    };
  },

  render: function() {

    let className = 'dashboard-sidebar';
    let store = this.props.flux.getStore('points');

    var c;

    if (!this.props.selected)
      c = <div key="nothing"/>;
    else
      c = <div key={this.props.selected.id} className={className} style={{ zIndex: 100 }}>
      <div style={{ height: "100%", overflow: "auto" }}>
        <CarInfo car={this.props.selected} updateTrack={store._pointsActions.updateTrack}/>
      </div>
    </div>

    return (
      <ReactCSSTransitionGroup transitionName="example">
        {c}
      </ReactCSSTransitionGroup>
    );
  }

});

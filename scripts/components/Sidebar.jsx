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

    // let open = !!this.props.selected;
    //
    let className = 'dashboard-sidebar';
    //
    // if (open) {
    //   className += ' dashboard-sidebar--open';
    // } else {
    //   className += ' dashboard-sidebar--closed';
    // }
    //
    var c;

    if (!this.props.selected)
      c = <div key="nothing"/>;
    else
      c = <div key={this.props.selected.id} className={className} style={{ zIndex: 100, paddingTop: 100 }}>
      <div style={{ height: "100%", overflow: "auto" }}>
        <CarInfo car={this.props.selected}/>
      </div>
    </div>

    return (
      <ReactCSSTransitionGroup transitionName="example">
        {c}
      </ReactCSSTransitionGroup>
    );
  }

});

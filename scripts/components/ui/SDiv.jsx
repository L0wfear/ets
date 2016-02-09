import React from 'react';

export default class SDiv extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return this.props.hidden ? <div className="none"/> : <div {...this.props}>{this.props.children}</div>
  }
}

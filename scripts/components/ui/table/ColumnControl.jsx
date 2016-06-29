import React, { Component } from 'react';
import { Modal, Row, Col, Button, Glyphicon, Input } from 'react-bootstrap';
import Div from '../Div.jsx';
import cx from 'classnames';

class ColumnControl extends Component {

  constructor(props) {
    super(props);
  }

  checkboxChange(name) {
    this.props.onChange(name);
  }

  render() {

    const buttonClass = cx('column-control-button', {
      'column-control-button-active': this.props.active,
      'open': this.props.show
    });

    let rows = this.props.options.map((option, i) => {
      if (option.name === 'rowNumber') return;
      return (
        <div key={i} style={{marginLeft: 20}}>
          <span onClick={this.checkboxChange.bind(this, option.name)} style={{cursor: "pointer"}}>
            <Input readOnly type="checkbox" checked={this.props.values.indexOf(option.name) === -1} />
            <span style={{bottom: -2, position: "relative"}}>{option.caption}</span>
          </span>
        </div>
      )
    });

    return (<Div className={'column-control-wrap'}>
      <Button bsSize="small" className={buttonClass} onClick={this.props.onClick}>
        <Glyphicon glyph="cog"/>
      </Button>
      <Div hidden={!this.props.show} className={'column-control-container'}>
        <Div className="column-control-container-window">
          <Modal.Body>
            {rows}
          </Modal.Body>
        </Div>
      </Div>
    </Div>);

  }

}

export default ColumnControl;

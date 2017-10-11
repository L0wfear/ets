import React, { Component, PropTypes } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import cx from 'classnames';
import Div from '../Div.jsx';

export default class ColumnControl extends Component {

  static get propTypes() {
    return {
      onChange: PropTypes.func,
      onClick: PropTypes.func,
      active: PropTypes.bool,
      show: PropTypes.bool,
      options: PropTypes.array,
      values: PropTypes.array,
    };
  }

  checkboxChange(name) {
    this.props.onChange(name);
  }

  render() {
    const buttonClass = cx('column-control-button', {
      'column-control-button-active': this.props.active,
      'open': this.props.show,
    });

    const rows = this.props.options.map((option, i) => {
      if (option.name === 'rowNumber') {
        return;
      }
      return (
        <div key={i} style={{ marginLeft: 20 }}>
            <div className="form-group"  style={{ cursor: 'pointer' }}>
              <div className="checkbox">
                <label className="control-label">
                  <input readOnly type="checkbox" checked={this.props.values.indexOf(option.name) === -1} onClick={this.checkboxChange.bind(this, option.name)} />
                  <span style={{ bottom: -2, position: 'relative' }}>{option.displayName}</span>
                </label>
              </div>
            </div>
        </div>
      );
    });

    return (
      <Div className={'column-control-wrap'}>
        <Button bsSize="small" className={buttonClass} onClick={this.props.onClick}>
          <Glyphicon glyph="cog" />
        </Button>
        <Div hidden={!this.props.show} className={'column-control-container'}>
          <Div className="column-control-container-window">
            <ModalBody>
              {rows}
            </ModalBody>
          </Div>
        </Div>
      </Div>
    );
  }

}

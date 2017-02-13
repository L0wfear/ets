import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { autobind } from 'core-decorators';
import Filter from './Filter.jsx';
import ToolbarControl from './ToolbarControl.jsx';

@autobind
export default class ToolbarSearch extends Component {

  static get propTypes() {
    return {
      focusOnLonelyCar: PropTypes.func,
    };
  }

  constructor(flux, props) {
    super(flux, props);

    this.state = {
      canFocus: false,
      btnClassName: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ canFocus: nextProps.carsCount === 1 });
  }

  onFilterChange(value) {
    this.setState({ btnClassName: !!value && value.length > 0 ? 'have-filter' : '' });
  }

  onToggle() {
    const inputDOM = ReactDOM.findDOMNode(this.search_text).firstChild;
    setTimeout(() => {
      inputDOM.focus();
    }, 150);
  }

  render() {
    const style = {
      position: 'absolute',
      right: 30,
      top: 6,
      background: 'transparent',
      color: '#ccc',
    };

    return (
      <ToolbarControl controlType="search" top="0px" btnClass={this.state.btnClassName} onToggle={this.onToggle}>
        <Filter ref={e => (this.search_text = e)} onFilterChange={this.onFilterChange} className="bnso-filter" title="рег. номер ТС или номер БНСО" name="bnso_gos" />
        {this.state.canFocus && <button style={style} onClick={this.props.focusOnLonelyCar} className="btn btn-default btn-sm"><span className="glyphicon glyphicon-screenshot" />&nbsp;Показать</button>}
      </ToolbarControl>
    );
  }

}

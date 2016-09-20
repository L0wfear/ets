import React from 'react';
import { autobind } from 'core-decorators';
import { Input } from 'react-bootstrap';
import cx from 'classnames';
import EtsSelect from './EtsSelect.jsx';
import DatePicker from './DatePicker.jsx';
import Div from './Div.jsx';

@autobind
export default class Field extends React.Component {

  static get propTypes() {
    return {
      value: React.PropTypes.any,
      key: React.PropTypes.string,
      type: React.PropTypes.string.isRequired,
      label: React.PropTypes.string,
      hidden: React.PropTypes.bool,
      onChange: React.PropTypes.func,
      error: React.PropTypes.string,
      readOnly: React.PropTypes.bool,
      className: React.PropTypes.string,
    };
  }

  onChange(...args) {
    this.props.onChange(this.props.key, ...args);
  }

  renderBoolean() {
    const { label = '' } = this.props;
    return (
      <Div hidden={this.props.hidden}>
        <label>{label}</label>
        <input type="checkbox" style={{ fontSize: '20px', marginLeft: '5px' }} checked={this.props.value} onChange={this.props.onChange} />
      </Div>
    );
  }

  renderNumber() {
    const { error } = this.props;
    const inputClassName = cx({ 'has-error': error });
    return (
      <Div hidden={this.props.hidden}>
        <Input type="number" className={inputClassName} {...this.props} />
        <Div hidden={!error} className="error">{error}</Div>
      </Div>
    );
  }

  renderDate() {
    const { error, label = '', readOnly = false } = this.props;
    const dateClassName = cx({ 'has-error': error });
    return (
      <Div hidden={this.props.hidden} style={{ marginBottom: 15 }}>
        <label style={{ minHeight: 15 }}>{label}</label>
        <DatePicker {...this.props} className={dateClassName} />
        <Div hidden={!error} className="error" style={{ marginTop: 4 }}>{error}</Div>
      </Div>
    );
  }

  renderSelect() {
    const { error, label = '', className = '' } = this.props;
    const selectClassName = cx({ 'has-error': error });
    return (
      <Div hidden={this.props.hidden} className={className} style={{ marginBottom: 15 }}>
        <label>{label}</label>
        <EtsSelect {...this.props} className={selectClassName} />
        <Div hidden={!error} className="error" style={{ marginTop: 4 }}>{error}</Div>
      </Div>
    );
  }

  renderString() {
    const { error, label = '', readOnly = false, className = '' } = this.props;
    const inputClassName = cx({ 'has-error': error });
    return !readOnly ?
      <Div hidden={this.props.hidden} style={this.props.wrapStyle || {}}>
        <Input type="text" className={inputClassName} {...this.props} />
        <Div hidden={!error} className="error">{error}</Div>
      </Div> :
      <Div hidden={this.props.hidden} className={className}>
        <label style={{ paddingTop: 5 }}>{this.props.label}</label><br />
        {this.props.value}
      </Div>;
  }

  renderFieldByType(type) {
    switch (type) {
      case 'string':
        return this.renderString();
      case 'select':
        return this.renderSelect();
      case 'date':
        return this.renderDate();
      case 'number':
        return this.renderNumber();
      case 'boolean':
        return this.renderBoolean();
      default:
        return this.renderString();
    }
  }

  render() {
    const { type } = this.props;

    return this.renderFieldByType(type);
  }

}

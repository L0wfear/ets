import React from 'react';
import { autobind } from 'core-decorators';
import { Input } from 'react-bootstrap';
import cx from 'classnames';
import EtsSelect from './EtsSelect.jsx';
import DatePicker from './DatePicker.jsx';
import Div from './Div.jsx';
import Preloader from './Preloader.jsx';

function StringField(props) {
  const { error, label = '', readOnly = false, disabled = false, className = '',
    value, wrapStyle, hidden, isLoading } = props;
  const inputClassName = cx({ 'has-error': error });

  if (isLoading) {
    return (
      <Div hidden={hidden}>
        <label style={{ paddingTop: 5 }}>{label}</label><br />
        <Preloader type="field" />
      </Div>
    );
  }

  return !readOnly ?
    <Div hidden={hidden} style={wrapStyle || {}}>
      <Input type="text" disabled={disabled} className={inputClassName} {...props} />
      <Div hidden={!error} className="error">{error}</Div>
    </Div> :
    <Div hidden={hidden} className={className}>
      <label style={{ paddingTop: 5 }}>{label}</label><br />
      {value}
    </Div>;
}


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
    const { error, label = '', className = '', readOnly = false } = this.props;
    const selectClassName = cx({ 'has-error': error });
    return (
      <Div hidden={this.props.hidden} className={className} style={{ marginBottom: 15 }}>
        <label>{label}</label>
        <EtsSelect {...this.props} disabled={readOnly || this.props.disabled} className={selectClassName} />
        <Div hidden={!error} className="error" style={{ marginTop: 4 }}>{error}</Div>
      </Div>
    );
  }

  renderString() {
    return <StringField {...this.props} />;
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

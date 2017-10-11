import React from 'react';
import { autobind } from 'core-decorators';
import { FormControl } from 'react-bootstrap';
import cx from 'classnames';

import { onChangeWithKeys } from 'components/compositions/hoc';
import DatePicker from 'components/ui/input/DatePicker';
import EtsSelect from 'components/ui/input/EtsSelect';
import FileInput from 'components/ui/input/FileInput/FileInput';
// import TextInput from 'components/ui/input/TextInput/TextInput';
import Div from './Div.jsx';
import Preloader from './Preloader.jsx';

function StringField(props) {
  const { error, label = '', readOnly = false, disabled = false, className = '',
    value, wrapStyle, hidden, isLoading, inline = false } = props;
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
      <div className="form-group">
        { label && <label className="control-label"><span>{label}</span></label>}
        <FormControl type="text" disabled={disabled} className={inputClassName} {...props} />
      </div>
      <Div hidden={!error} className="error">{error}</Div>
    </Div> :
    <Div hidden={hidden} className={className}>
      <label style={{ paddingTop: 5, paddingRight: 5 }}>{label}</label>
      {!inline && <br />}
      {value}
    </Div>;
}

function TextAreaField(props) {
  const { error, label = '', readOnly = false, disabled = false, value, hidden, rows = 5, textAreaStyle = {} } = props;

  const wrapperClassName = cx({
    'textarea-field': true,
    'has-error': error,
  });

  return (
    <Div hidden={hidden} className={wrapperClassName}>
      <label>{label}</label>
      <textarea
        style={textAreaStyle}
        className="form-control form-group"
        rows={rows}
        disabled={readOnly || disabled}
        onChange={props.onChange}
        value={value}
      />
      <Div hidden={!error} className="error">{error}</Div>
    </Div>
  );
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
        <input
          type="checkbox"
          style={{ fontSize: '20px', marginLeft: '5px' }}
          checked={this.props.value}
          onChange={this.props.onChange}
          disabled={this.props.disabled}
        />
      </Div>
    );
  }

  renderNumber() {
    const { error } = this.props;
    const inputClassName = cx({ 'has-error': error });
    return (
      <Div hidden={this.props.hidden}>
        <div className="form-group">
          { this.props.label && <label className="control-label"><span>{this.props.label}</span></label>}
          <FormControl type="number" className={inputClassName} {...this.props} />
        </div>
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

  renderFile() {
    const { error, label = '' } = this.props;
    const errorClassName = cx({ 'has-error': error });

    return (
      <Div hidden={this.props.hidden} style={{ marginBottom: 15 }}>
        <label htmlFor=" " style={{ minHeight: 15 }}>{label}</label>
        <FileInput
          {...this.props}
          errorClassName={errorClassName}
        />
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
  renderText() {
    return <TextAreaField {...this.props} />;
  }

  renderFieldByType(type) {
    switch (type) {
      case 'string':
        return this.renderString();
      case 'text':
        return this.renderText();
      case 'select':
        return this.renderSelect();
      case 'date':
        return this.renderDate();
      case 'file':
        return this.renderFile();
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

export const ExtField = onChangeWithKeys(Field);

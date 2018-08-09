import * as React from 'react';
import * as PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { FormControl } from 'react-bootstrap';
import cx from 'classnames';

import { onChangeWithKeys } from 'components/compositions/hoc';
import withMergeProps from 'components/compositions/vokinda-hoc/with-merge-props/WithMergeProps';
import DatePicker from 'components/ui/input/date-picker/DatePicker';
import EtsSelect from 'components/ui/input/EtsSelect';
import FileInput from 'components/ui/input/FileInput/FileInput';
// import TextInput from 'components/ui/input/TextInput/TextInput';
import Div from './Div.jsx';
import Preloader from './Preloader.jsx';

function StringField(props) {
  const { error, ...mainProps } = props; 
  const { label = '', readOnly = false, disabled = false, className = '',
    wrapStyle, hidden, isLoading, inline = false, id } = props;
  let { value } = props;

  const inputClassName = cx({ 'has-error': error });

  if (isLoading) {
    return (
      <Div hidden={hidden}>
        <label style={{ paddingTop: 5 }}>{label}</label>)<br />
        <Preloader type="field" />
      </Div>
    );
  }

  if (value === undefined || value === null) {
    value = '';
  }

  return !readOnly ?
    <Div hidden={hidden} style={wrapStyle || {}}>
      <div className="form-group">
        {label && <label className="control-label"><span>{label}</span></label>}
        <FormControl type="text" disabled={disabled} className={inputClassName} {...mainProps} value={value} />
      </div>
      <Div hidden={!error} className="error">{error}</Div>
    </Div> :
    <Div hidden={hidden} className={className}>
      <label style={{ paddingTop: 5, paddingRight: 5 }}>{label}</label>
      {!inline && <br />}
      <span id={id} >{value}</span>
    </Div>;
}

function TextAreaField(props) {
  const { error, label = '', readOnly = false, disabled = false, hidden, rows = 5, textAreaStyle = {}, id } = props;
  let { value } = props;
  if (value === undefined || value === null) {
    value = '';
  }

  const wrapperClassName = cx({
    'textarea-field': true,
    'has-error': error,
  });

  return (
    <Div hidden={hidden} className={wrapperClassName}>
      <label>{label}</label>
      <textarea
        id={id}
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
      value: PropTypes.any,
      key: PropTypes.string,
      type: PropTypes.string.isRequired,
      label: PropTypes.string,
      hidden: PropTypes.bool,
      onChange: PropTypes.func,
      error: PropTypes.string,
      readOnly: PropTypes.bool,
      className: PropTypes.string,
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
          id={this.props.id}
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
    const { error, ...mainProps } = this.props;
    const { showRedBorder } = mainProps;

    const inputClassName = cx({ 'has-error': error || showRedBorder });
    let { value } = this.props;

    if (value === undefined || value === null) {
      value = '';
    }

    return (
      <Div hidden={this.props.hidden}>
        <div className="form-group">
          <label className="control-label"><span>{this.props.label}</span></label>
          <FormControl lang="en" type="number" className={inputClassName} {...mainProps} value={value} />
        </div>
        <Div hidden={!error} className="error">{error}</Div>
      </Div>
    );
  }

  renderDate() {
    const { error, label, readOnly = false, date, value, className = '' } = this.props;

    const dateClassName = cx({ 'has-error': error });
    return (
      <Div hidden={this.props.hidden} className={className} style={{ marginBottom: typeof label === 'string' ? 15 : 0 }}>
      { typeof label === 'string' && <label style={{ minHeight: 15 }}>{label}</label> }
        <DatePicker {...this.props} date={date || value} className={dateClassName} />
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
    const { label = '', ...props } = this.props;
    const { error, className = '', readOnly = false, id } = props;
    const selectClassName = cx({ 'has-error': error });
    return (
      <Div hidden={this.props.hidden} className={className} style={{ marginBottom: typeof label === 'string' ? 15 : 0 }}>
        { typeof label === 'string' && <label id={id}>{label}</label> }
        <EtsSelect {...props} disabled={readOnly || this.props.disabled} className={selectClassName} />
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

export const ExtField = onChangeWithKeys(
  withMergeProps(
    ({ boundKeys, ...props }) => props
  )(Field)
);

import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as FormControl from 'react-bootstrap/lib/FormControl';
import cx from 'classnames';

import DatePicker from 'components/ui/input/date-picker/DatePicker';
import ReactSelect from 'components/ui/input/ReactSelect/ReactSelect';
import FileInput from 'components/ui/input/FileInput/FileInput';
import Preloader from 'components/ui/new/preloader/Preloader';

import Div from 'components/ui/Div';

function StringField(props) {
  const { error, label = '', modalKey, isLoading, ...mainProps } = props;
  const {
    readOnly = false,
    disabled = false,
    className = '',
    wrapStyle,
    hidden,
    inline = false,
  } = props;
  let { value } = props;

  const inputClassName = cx({ 'has-error': error });
  const id = props.id
    ? `${modalKey ? `${modalKey}-` : ''}${props.id}-label`
    : undefined;

  if (isLoading) {
    return (
      <Div hidden={hidden}>
        {typeof label === 'string' && (
          <label style={{ paddingTop: 5 }} id={id}>
            {label}
          </label>
        )}
        )
        <br />
        <Preloader typePreloader="field" />
      </Div>
    );
  }

  if (value === undefined || value === null) {
    value = '';
  }
  const showError = typeof error === 'boolean' ? error : true;

  return !readOnly ? (
    <Div hidden={hidden} style={wrapStyle || {}}>
      <div className="form-group">
        {typeof label === 'string' && (
          <label className="control-label" id={id}>
            <span>{label}</span>
          </label>
        )}
        <FormControl
          type="text"
          disabled={disabled}
          className={inputClassName}
          {...mainProps}
          id={id}
          value={value}
        />
      </div>
      {showError && (
        <Div hidden={!error} className="error">
          {error}
        </Div>
      )}
    </Div>
  ) : (
    <Div hidden={hidden} className={className}>
      <label style={{ paddingTop: 5, paddingRight: 5 }}>{label}</label>
      {!inline && <br />}
      <span id={id}>{value}</span>
    </Div>
  );
}

function TextAreaField(props) {
  const {
    error,
    label = '',
    readOnly = false,
    disabled = false,
    hidden,
    rows = 5,
    textAreaStyle = {},
    modalKey,
  } = props;
  let { value } = props;
  if (value === undefined || value === null) {
    value = '';
  }

  const id = props.id
    ? `${modalKey ? `${modalKey}-` : ''}${props.id}-label`
    : undefined;

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
      <Div hidden={!error} className="error">
        {error}
      </Div>
    </Div>
  );
}

export default class Field extends React.Component {
  static get propTypes() {
    return {
      value: PropTypes.any,
      key: PropTypes.string,
      type: PropTypes.string.isRequired,
      hidden: PropTypes.bool,
      onChange: PropTypes.func,
      error: PropTypes.string,
      readOnly: PropTypes.bool,
      className: PropTypes.string,
    };
  }

  onChange = (...args) => {
    this.props.onChange(this.props.key, ...args);
  };

  renderBoolean() {
    const {
      label = '',
      className = 'default-boolean-input',
      modalKey,
    } = this.props;

    const id = this.props.id
      ? `${modalKey ? `${modalKey}-` : ''}${this.props.id}-label`
      : undefined;

    return (
      <Div hidden={this.props.hidden} className={className}>
        <label>{label}</label>
        <input
          id={id}
          type="checkbox"
          style={{ fontSize: '20px', margin: '5px' }}
          checked={this.props.value}
          onChange={this.props.onChange}
          disabled={this.props.disabled}
        />
      </Div>
    );
  }

  renderNumber() {
    const { error, modalKey, showRedBorder, ...mainProps } = this.props;

    const inputClassName = cx({ 'has-error': error || showRedBorder });
    let { value } = this.props;

    if (value === undefined || value === null) {
      value = '';
    }

    const id = this.props.id
      ? `${modalKey ? `${modalKey}-` : ''}${this.props.id}-label`
      : undefined;

    return (
      <Div hidden={this.props.hidden}>
        <div className="form-group">
          <label className="control-label">
            <span>{this.props.label}</span>
          </label>
          <FormControl
            lang="en"
            type="number"
            className={inputClassName}
            {...mainProps}
            id={id}
            value={value}
          />
        </div>
        <Div hidden={!error} className="error">
          {error}
        </Div>
      </Div>
    );
  }

  renderDate() {
    const { label, error, modalKey, ...props } = this.props;
    const { date, value, className = '' } = this.props;

    const id = this.props.id
      ? `${modalKey ? `${modalKey}-` : ''}${this.props.id}-label`
      : undefined;

    const dateClassName = cx({ 'has-error': error });
    return (
      <Div
        hidden={this.props.hidden}
        className={className}
        style={{ marginBottom: typeof label === 'string' ? 15 : 0 }}>
        {typeof label === 'string' && (
          <label style={{ minHeight: 15 }}>{label}</label>
        )}
        <DatePicker
          {...props}
          id={id}
          date={date || value}
          className={dateClassName}
        />
        <Div hidden={!error} className="error" style={{ marginTop: 4 }}>
          {error}
        </Div>
      </Div>
    );
  }

  renderFile() {
    const { label = '', ...props } = this.props;
    const { error, modalKey } = this.props;
    const errorClassName = cx({ 'has-error': error });
    const id = this.props.id
      ? `${modalKey ? `${modalKey}-` : ''}${this.props.id}-label`
      : undefined;

    return (
      <Div hidden={this.props.hidden} style={{ marginBottom: 15 }}>
        <label htmlFor=" " id={id} style={{ minHeight: 15 }}>
          {label}
        </label>
        <FileInput {...props} errorClassName={errorClassName} />
        <Div hidden={!error} className="error" style={{ marginTop: 4 }}>
          {error}
        </Div>
      </Div>
    );
  }

  renderSelect() {
    const { label = '', ...props } = this.props;
    const { error, className = '', readOnly = false, modalKey } = this.props;

    const selectClassName = cx({ 'has-error': error });
    const id = this.props.id
      ? `${modalKey ? `${modalKey}-` : ''}${this.props.id}-label`
      : undefined;

    return (
      <Div
        hidden={this.props.hidden}
        className={className}
        style={{ marginBottom: typeof label === 'string' ? 15 : 0 }}>
        {typeof label === 'string' && <label id={id}>{label}</label>}
        <ReactSelect
          {...props}
          disabled={readOnly || this.props.disabled}
          className={selectClassName}
        />
        <Div hidden={!error} className="error" style={{ marginTop: 4 }}>
          {error}
        </Div>
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

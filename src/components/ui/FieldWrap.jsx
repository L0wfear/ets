import React from 'react';
import Field from './Field.jsx';
import Div from './Div.jsx';

export default class FieldWrap extends React.Component {
  constructor(props) {
    super(props);

    this.getFieldByPropertyMeta = this.getFieldByPropertyMeta.bind(this);
  }

  getFieldByPropertyMeta() {
    const {
      field, value, error, onChange,
    } = this.props;
    let fieldProps = {};
    console.log(value); // eslint-disable-line

    switch (field.form.formType) {
      case 'string':
        fieldProps = {
          type: 'string',
          label: field.displayName,
          readOnly: !field.form.editable,
          hidden: field.form.hidden,
          value,
          error,
          onChange,
        };
        break;
      case 'number':
        fieldProps = {
          type: 'number',
          label: field.displayName,
          disabled: !field.form.editable,
          hidden: field.form.hidden,
          value,
          error,
          onChange,
        };
        break;
      case 'select':
        fieldProps = {
          type: 'select2',
          label: field.displayName,
          disabled: !field.form.editable,
          hidden: field.form.hidden,
          value,
          error,
          onChange,
          options: field.form.formSelectOptions() || [],
        };
        console.log(fieldProps); // eslint-disable-line
        break;
    }

    return <Field {...fieldProps} />;
  }

  render() {
    const { field } = this.props;

    return (
      <Div>
        {this.getFieldByPropertyMeta()}
      </Div>
    );
  }
}

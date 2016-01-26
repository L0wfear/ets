import React from 'react';
import _ from 'lodash';
import Field from './Field.jsx';
import Div from './Div.jsx';


// <Field type="select" label="Ответственное лицо" error={errors['responsible_person_id']}
//        hidden={!(IS_CREATING || IS_POST_CREATING)}
//        options={MASTERS}
//        value={state.responsible_person_id}
//        onChange={this.handleChange.bind(this, 'responsible_person_id')}/>
//
// <Field type="string" label="Ответственное лицо" readOnly={true} hidden={IS_CREATING || IS_POST_CREATING}
//        value={getFIOById(employeesList, state.responsible_person_id, true)}/>
//
// <Field type="number" label="Пробег, км"
//        value={state.odometr_diff} hidden={!(IS_CLOSING || IS_DISPLAY )} disabled />

export default class FieldWrap extends React.Component {

  constructor(props) {
    super(props);

    this.getFieldByPropertyMeta = this.getFieldByPropertyMeta.bind(this);
  }

  // {
  //   name: 'name',
  //   caption: 'Наименование',
  //   type: 'string',
  //   filter: {
  //     type: 'select',
  //   },
  //   form: {
  //     required: true,
  //     editable: false,
  //   }
  // },

  getFieldByPropertyMeta() {
    const { field, value, error, onChange } = this.props;
    let fieldProps = {};
    console.log(value);

    switch (field.form.formType) {
      case 'string':
        fieldProps = {
          type: 'string',
          label: field.caption,
          readOnly: ! !!field.form.editable,
          hidden: field.form.hidden,
          value,
          error,
          onChange,
        };
        break;
      case 'number':
        fieldProps = {
          type: 'number',
          label: field.caption,
          disabled: ! !!field.form.editable,
          hidden: field.form.hidden,
          value,
          error,
          onChange,
        };
        break;
      case 'select':
        fieldProps = {
          type: 'select',
          label: field.caption,
          disabled: ! !!field.form.editable,
          hidden: field.form.hidden,
          value,
          error,
          onChange,
          options: field.form.formSelectOptions() || [],
        };
        console.log(fieldProps);
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

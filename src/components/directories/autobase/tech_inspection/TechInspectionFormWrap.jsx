import React from 'react';

import FormWrap from 'components/compositions/FormWrap.jsx';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';
import BaseTechInspectionForm from './TechInspectionForm';

const TechInspectionForm = enhanceWithPermissions(BaseTechInspectionForm);

export const schema = {
  properties: [
    {
      key: 'reg_number',
      title: 'Регистрационный номер',
      type: 'number',
      required: true,
      maxLength: 21,
    },
    {
      key: 'date_end',
      title: 'Срок действия до',
      type: 'date',
      required: true,
    },
    {
      key: 'date_start',
      title: 'Дата прохождения',
      type: 'date',
      required: true,
    },
    {
      key: 'tech_operator',
      title: 'Оператор технического осмотра / пункт технического осмотра',
      type: 'text',
      maxLength: 256,
    },
    {
      key: 'is_allowed',
      title: 'Заключение о возможности/невозможности эксплуатации ТС',
      type: 'number',
    },
    {
      key: 'note',
      title: 'Примечание прохождения',
      type: 'text',
    },
  ],
};

export default class TechInspectionFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);
    const { car_id } = this.props;

    this.schema = schema;
    this.preventDefaultNotification = true;

    this.createAction = context.flux.getActions('autobase').techInspection.bind(null, 'post', { car_id });
    this.updateAction = context.flux.getActions('autobase').techInspection.bind(null, 'put', { car_id });
  }

  render() {
    const { entity } = this.props;
    return this.props.showForm ?
      <TechInspectionForm
        formState={this.state.formState}
        formErrors={this.state.formErrors}
        cols={this.props.meta.cols}
        permissions={[`${entity}.update`]}
        addPermissionProp
        canSave={this.state.canSave}
        onSubmit={this.handleFormSubmit.bind(this)}
        handleFormChange={this.handleFormStateChange.bind(this)}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
      />
      : null;
  }
}

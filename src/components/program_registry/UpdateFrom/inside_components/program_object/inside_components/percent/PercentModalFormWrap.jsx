import * as React from 'react';
import moment from 'moment';

import { validateField } from 'utils/validate/validateField';

import FormWrap from 'components/compositions/FormWrap';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import PercentModalForm from 'components/program_registry/UpdateFrom/inside_components/program_object/inside_components/percent/PercentModalForm';

import { formValidationSchema } from 'components/program_registry/UpdateFrom/inside_components/program_object/inside_components/percent/schema';

class PercentModalFormWrap extends FormWrap {
  constructor(props) {
    super(props);
    this.schema = formValidationSchema;
    this.preventDefaultNotification = true;

    const {
      object_id,
    } = props;

    this.defaultElement = {
      object_id,
    };
  }

  createAction = (formState) => this.context.flux.getActions('repair').postDataToUpdateObjectPercent(formState).then((ans) => {
    global.NOTIFICATION_SYSTEM.notify({
      message: 'Удаление сохраненной записи возможно в течении дня создания.',
      level: 'info',
      position: 'tr',
    });

    this.props.updateObjectData();
    this.props.checkMinVals();

    return ans;
  })

  /**
   * @override
   */
  validate(state, errors) {
    if (typeof this.schema === 'undefined') return errors;

    const schema = this.schema;
    const formState = { ...state };

    const newErrors = schema.properties.reduce((formErrors, prop) => {
      const { key } = prop;
      formErrors[key] = validateField(prop, formState[key], formState, this.schema);
      return formErrors;
    },
    { ...errors });

    const {
      other: {
        minPercent,
        minReviewedAt,
      } = {},
    } = this.props;

    if (state.percent < minPercent) {
      newErrors.percent = 'Процент выполнения не должен быть меньше последнего процента выполнения';
    }

    if (moment(state.reviewed_at).diff(minReviewedAt, 'minutes') < 0) {
      newErrors.reviewed_at = 'Дата осмотра должна быть позже последней даты осмотра';
    }

    return newErrors;
  }

  render() {
    const { entity, isPermitted = false, isPermittedByStatus } = this.props;
    const { saveButtonEnability = true } = this.state;
    const canSave = isPermitted && this.state.canSave && saveButtonEnability;

    return this.props.showForm
      ? (
        <PercentModalForm
          formState={this.state.formState}
          formErrors={this.state.formErrors}
          permissions={[`${entity}.update`]}
          addPermissionProp
          isPermitted={isPermitted}
          canSave={canSave}
          onSubmit={this.handleFormSubmit.bind(this)}
          handleFormChange={this.handleFormStateChange.bind(this)}
          show={this.props.showForm}
          onHide={this.props.onFormHide}
          isPermittedByStatus={isPermittedByStatus}
        />
      )
      : null;
  }
}

export default enhanceWithPermissions(PercentModalFormWrap);

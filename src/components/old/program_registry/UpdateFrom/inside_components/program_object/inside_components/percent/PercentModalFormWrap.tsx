import * as React from 'react';

import { validateField } from 'utils/validate/validateField';

import UNSAFE_FormWrap from 'components/old/compositions/UNSAFE_FormWrap';
import PercentModalForm from 'components/old/program_registry/UpdateFrom/inside_components/program_object/inside_components/percent/PercentModalForm';

import { formValidationSchema } from 'components/old/program_registry/UpdateFrom/inside_components/program_object/inside_components/percent/schema';
import { withRequirePermission } from 'components/@next/@common/hoc/require_permission/withRequirePermission';
import { diffDates } from 'components/@next/@utils/dates/dates';

type Props = {
  [k: string]: any;
};
type State = any;

class PercentModalFormWrap extends UNSAFE_FormWrap<Props, State> {
  schema = formValidationSchema;
  preventDefaultNotification = true;
  defaultElement: any;

  constructor(props) {
    super(props);

    const { object_id } = props;

    this.defaultElement = {
      object_id,
    };
  }

  createAction = (formState) =>
    this.context.flux
      .getActions('repair')
      .postDataToUpdateObjectPercent(formState)
      .then((ans) => {
        global.NOTIFICATION_SYSTEM.notify({
          message:
            'Удаление сохраненной записи возможно в течение дня создания.',
          level: 'info',
          position: 'tr',
        });

        this.props.updateObjectData();
        this.props.checkMinVals();

        return ans;
      });

  /**
   * @override
   */
  validate = (state, errors) => {
    if (typeof this.schema === 'undefined') {
      return errors; 
    }

    const schema = this.schema;
    const formState = { ...state };

    const newErrors = schema.properties.reduce(
      (formErrors, prop) => {
        const { key } = prop;
        formErrors[key] = validateField(
          prop,
          formState[key],
          formState,
          this.schema,
          this.props,
        );
        return formErrors;
      },
      { ...errors },
    );

    const { other: { minPercent, minReviewedAt } = {} as any } = this.props;

    if (state.percent < minPercent) {
      newErrors.percent
        = 'Процент выполнения не должен быть меньше последнего процента выполнения';
    }

    if (diffDates(state.reviewed_at, minReviewedAt, 'minutes', false) < 0) {
      newErrors.reviewed_at
        = 'Дата осмотра должна быть позже последней даты осмотра';
    }

    return newErrors;
  };

  render() {
    const {
      entity,
      isPermitted = false,
      isPermittedPercentByStatus,
    } = this.props;
    const { saveButtonEnability = true } = this.state;
    const canSave = isPermitted && this.state.canSave && saveButtonEnability;

    return this.props.showForm ? (
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
        isPermittedPercentByStatus={isPermittedPercentByStatus}
      />
    ) : null;
  }
}

export default withRequirePermission<any>()(PercentModalFormWrap);

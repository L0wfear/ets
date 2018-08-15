import React from 'react';

import { unpackObjectData } from 'api/utils';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';
import FormWrap from 'components/compositions/FormWrap.jsx';
import { isEmpty } from 'utils/functions';
import { saveDataSuccessNotification } from 'utils/notifications';
import CarForm from './CarForm.jsx';
import schema from './schema';


const SAVE_BUTTON_LABEL_PROGRESS = 'Сохранение...';
const SAVE_BUTTON_LABEL_DEFAULT = 'Сохранить';

class CarFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.schema = schema;
    this.uniqueField = 'asuods_id';
    this.updateAction = context.flux.getActions('cars').updateCarAdditionalInfo;
  }
  async inheritedComponentWillReceiveProps(nextProps) {
    if (this.props.showForm !== nextProps.showForm && nextProps.element) {
      const {
        element,
      } = nextProps;

      const formState = element || {};

      const register_info = await this.context.flux.getActions('cars').getCarRegisterInfo(element.asuods_id) || {};
      const register_passport_info = await this.context.flux.getActions('cars').getCarPassportRegistryInfo(element.asuods_id) || {};
      const { type = '', id = null } = register_passport_info;

      this.setState({
        formState: {
          ...formState,
          ...unpackObjectData('register', register_info),
          passport_type: type,
          passport_id: id,
          ...unpackObjectData(`passport_${type.toLowerCase()}`, register_passport_info),
        },
      });
    }
  }
  handleFormHide = () => {
    if (Object.keys(this.props.location.query).length > 0) {
      this.props.history.replaceState(null, this.props.location.pathname, {});
    }
    this.props.onFormHide();
  }

  handleFormOnlySubmit = async () => {
    const uniqueField = this.uniqueField || 'id';
    let { formState } = this.state;
    let result = null;
    Object.entries(formState).forEach(([key, val])=> {
      if (typeof val === 'string') {
        formState[key] = val.trim();
      }
    });

    if (this.schema) {
      this.schema.properties.forEach((p) => {
        if (p.type === 'number' && p.float) {
          formState[p.key] = !isNaN(formState[p.key]) && formState[p.key] !== null ? parseFloat(formState[p.key]) : null;
        }
        if (p.type === 'number' && p.integer) {
          const parsedValue = parseInt(formState[p.key], 10);
          formState[p.key] = !isNaN(parsedValue) ? parsedValue : null;
        }

        if (typeof p.isSubmitted === 'function') {
          formState = p.isSubmitted(formState) ? formState : _.omit(formState, p.key);
        }
      });
    }

    // понять, обновлять форму или создавать новую
    // можно по отсутствию уникального идентификатора
    if (isEmpty(formState[uniqueField])) {
      if (typeof this.createAction === 'function') {
        try {
          this.setState({
            saveButtonLabel: SAVE_BUTTON_LABEL_PROGRESS,
            saveButtonEnability: false,
          });
          result = await this.createAction(formState);
          this.setState({
            saveButtonLabel: SAVE_BUTTON_LABEL_DEFAULT,
            saveButtonEnability: true,
          });
        } catch ({ error_text }) {
          this.setState({
            saveButtonLabel: SAVE_BUTTON_LABEL_DEFAULT,
            saveButtonEnability: true,
          });
          console.warn(error_text);
          return;
        }
      } else {
        throw new Error('Create action called but not specified');
      }
    } else {
      if (typeof this.updateAction === 'function') {
        try {
          this.setState({
            saveButtonLabel: SAVE_BUTTON_LABEL_PROGRESS,
            saveButtonEnability: false,
          });
          result = await this.updateAction(formState);
          this.setState({
            saveButtonLabel: SAVE_BUTTON_LABEL_DEFAULT,
            saveButtonEnability: true,
          });
        } catch ({ error_text }) {
          this.setState({
            saveButtonLabel: SAVE_BUTTON_LABEL_DEFAULT,
            saveButtonEnability: true,
          });
          console.warn(error_text);
          return;
        }
      } else {
        throw new Error('Update action called but not specified');
      }
      // в случае успешного обновления выдаем всплывающее окно
      if (!this.preventDefaultNotification) global.NOTIFICATION_SYSTEM.notify(saveDataSuccessNotification);
    }
  }

  render() {
    const { entity, isPermitted = false } = this.props;
    const { saveButtonEnability = true } = this.state;
    const canSave = isPermitted && this.state.canSave && saveButtonEnability;

    return this.props.showForm ?
      <CarForm
        formState={this.state.formState}
        onSubmit={this.handleFormSubmit}
        handleFormOnlySubmit={this.handleFormOnlySubmit}
        permissions={[`${entity}.update`]}
        addPermissionProp
        isPermitted={isPermitted}
        handleFormChange={this.handleFormStateChange}
        show={this.props.showForm}
        onHide={this.handleFormHide}
        {...this.state}
        canSave={canSave}
        location={this.props.location}
        history={this.props.history}
      />
      :
      null;
  }
}

export default enhanceWithPermissions(CarFormWrap);

import React, { Component } from 'react';
import _ from 'lodash';
import { autobind } from 'core-decorators';

import { validateField } from 'utils/validate/validateField.js';
import { FluxContext } from 'utils/decorators';
import { isEmpty } from 'utils/functions';
import { saveDataSuccessNotification } from 'utils/notifications';

const SAVE_BUTTON_LABEL_PROGRESS = 'Сохранение...';
const SAVE_BUTTON_LABEL_DEFAULT = 'Сохранить';

/**
 * FormWrap базовый класс хранения и работы с состоянием формы
 * @validate валидация состояния формы в соответствии со схемой (this.schema обязателен)
 * @handleFormStateChange обработка изменения состояния формы
 * @handleFormSubmit обработка отправки формы
 * @render дефолтный, обязательно переопределяется
 */
@FluxContext
@autobind
export default class FormWrap extends Component {

  static get propTypes() {
    return {
      showForm: React.PropTypes.bool.isRequired,
      // element: React.PropTypes.object.isRequired,
      onFormHide: React.PropTypes.func.isRequired,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      formState: {},
      formErrors: {},
      canSave: false,
      canPrint: false,
      saveButtonLabel: 'Сохранить',
      saveButtonEnability: true,
    };
  }

  componentWillReceiveProps(props) {
    if (props.showForm && (props.showForm !== this.props.showForm)) {
      let element = {};
      if (props.element !== null) {
        element = _.cloneDeep(props.element);
      } else {
        element = !isEmpty(this.defaultElement) ? _.cloneDeep(this.defaultElement) : {};
      }
      const formErrors = this.validate(element, {});

      this.setState({
        formState: element,
        formErrors,
        canSave: Object.values(formErrors).reduce((boolean, oneError) => boolean && !oneError, true),
      });
    }
    this.inheritedComponentWillReceiveProps(props);
  }

  inheritedComponentWillReceiveProps() {}

  validate(state, errors) {
    if (typeof this.schema === 'undefined') return errors;

    const schema = this.schema;
    const formState = { ...state };

    return schema.properties.reduce((formErrors, prop) => {
      const { key } = prop;
      formErrors[key] = validateField(prop, formState[key], formState, this.schema);
      return formErrors;
    },
      { ...errors },
    );
  }

  handleFormStateChange(field, e) {
    const value = e !== undefined && e !== null && !!e.target ? e.target.value : e;
    let { formErrors } = this.state;
    const { formState } = this.state;
    const newState = {};

    console.info('Form changed', field, value);
    formState[field] = value;

    formErrors = this.validate(formState, formErrors);

    newState.canSave = Object.values(formErrors).reduce((boolean, oneError) => boolean && !oneError, true);

    newState.formState = formState;
    newState.formErrors = formErrors;

    this.setState(newState);
  }
  nullValueForField(field, value) {
    const { schema = {} } = this;
    const { properties = [] } = schema;
    const fieldsType = properties.reduce((obj, val) => Object.assign(obj, { [val.key]: val.type }), {});

    switch (fieldsType[field]) {
      case 'string':
      case 'date':
        return '';
      case 'number': return null;
      default:
        if (typeof value === 'string') {
          if (isNaN(+value)) return '';
          return null;
        }
        if (Array.isArray(value)) {
          return [];
        }
        if (typeof value === 'object') {
          return {};
        }
        return 'say_Frontend';
    }
  }

  // отправка формы
  async handleFormSubmit() {
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
        } catch (e) {
          this.setState({
            saveButtonLabel: SAVE_BUTTON_LABEL_DEFAULT,
            saveButtonEnability: true,
          });
          console.warn(e);
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
        } catch (e) {
          this.setState({
            saveButtonLabel: SAVE_BUTTON_LABEL_DEFAULT,
            saveButtonEnability: true,
          });
          console.warn(e);
          return;
        }
      } else {
        throw new Error('Update action called but not specified');
      }
      // в случае успешного обновления выдаем всплывающее окно
      if (!this.preventDefaultNotification) global.NOTIFICATION_SYSTEM.notify(saveDataSuccessNotification);
    }

    // закрываем форму только в случае отсутствия исключительных ситуаций
    if (typeof this.props.onFormHide === 'function') {
      this.props.onFormHide(result);
    }
  }

  render() {
    throw new TypeError('FormWrap: do not call abstract method FormWrap#render from child.');
    // return <Component {...this.props} {...this.state} />;
  }

}

import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import { validateField } from 'validate/validateField.js';
import { FluxContext } from 'utils/decorators';
import { isEmpty } from 'utils/functions';
import { saveDataSuccessNotification } from 'utils/notifications';
import _ from 'lodash';

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
        canSave: !_.filter(formErrors).length,
      });
    }
  }

  validate(formState, errors) {
    if (typeof this.schema === 'undefined') return errors;
    const formErrors = _.clone(errors);
    const schema = this.schema;
    _.each(schema.properties, (prop) => {
      formErrors[prop.key] = validateField(prop, formState[prop.key], formState, this.schema);
    });

    return formErrors;
  }

  handleFormStateChange(field, e) {
    const value = e !== undefined && e !== null && !!e.target ? e.target.value : e;
    console.info('Form changed', field, value);
    let { formErrors } = this.state;
    const { formState } = this.state;
    const newState = {};
    formState[field] = value;

    formErrors = this.validate(formState, formErrors);
    newState.canSave = _(formErrors).map(v => !!v).filter(ev => ev === true).value().length === 0;

    newState.formState = formState;
    newState.formErrors = formErrors;


    this.setState(newState);
  }

  // отправка формы
  async handleFormSubmit() {
    const uniqueField = this.uniqueField || 'id';
    const { formState } = this.state;
    let result = null;

    // понять, обновлять форму или создавать новую
    // можно по отсутствию уникального идентификатора
    if (isEmpty(formState[uniqueField])) {
      if (typeof this.createAction === 'function') {
        try {
          result = await this.createAction(formState);
        } catch (e) {
          console.warn(e);
          return;
        }
      } else {
        throw new Error('Create action called but not specified');
      }
    } else {
      if (typeof this.updateAction === 'function') {
        try {
          result = await this.updateAction(formState);
        } catch (e) {
          console.warn(e);
          return;
        }
      } else {
        throw new Error('Update action called but not specified');
      }
      // в случае успешного обновления выдаем всплывающее окно
      global.NOTIFICATION_SYSTEM._addNotification(saveDataSuccessNotification);
    }

    // закрываем форму только в случае отсутствия исключительных ситуаций
    if (typeof this.props.onFormHide === 'function') {
      this.props.onFormHide(result);
    }
  }

  render() {
    throw new TypeError('FormWrap: do not call abstract method FormWrap#render from child.');
    return <Component {...this.props} {...this.state} />;
  }

}

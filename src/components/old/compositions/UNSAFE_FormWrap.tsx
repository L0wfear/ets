import * as React from 'react';

import { cloneDeep, omit } from 'lodash';

import { FluxContext } from 'utils/decorators';
import { isEmpty } from 'utils/functions';
import { saveDataSuccessNotification } from 'utils/notifications';
import { validate } from 'components/old/ui/form/new/validate';

const SAVE_BUTTON_LABEL_PROGRESS = 'Сохранение...';
const SAVE_BUTTON_LABEL_DEFAULT = 'Сохранить';

type State = {
  formState: any;
  formErrors: Record<string, any>;
  canSave: any;
  canPrint: any;
  saveButtonLabel: any;
  saveButtonEnability: any;
  [k: string]: any;
};

/**
 * UNSAFE_FormWrap базовый класс хранения и работы с состоянием формы
 * @validate валидация состояния формы в соответствии со схемой (this.schema обязателен)
 * @handleFormStateChange обработка изменения состояния формы
 * @handleFormSubmit обработка отправки формы
 * @render дефолтный, обязательно переопределяется
 */
@FluxContext
class FormWrap<P extends Record<string, any>, S extends State> extends React.Component<P, S> {
  defaultElement: any;
  schema: any;
  uniqueField: string;
  createAction: any;
  updateAction: any;
  preventDefaultNotification: any;

  constructor(props) {
    super(props);

    this.state = {
      formState: {},
      formErrors: {},
      canSave: false,
      canPrint: false,
      saveButtonLabel: 'Сохранить',
      saveButtonEnability: true,
    } as any;
  }

  // prettier-ignore
  UNSAFE_componentWillReceiveProps(props) { // eslint-disable-line
    if (props.showForm && props.showForm !== this.props.showForm) {
      let element = {};
      if (props.element !== null) {
        element = cloneDeep(props.element);
      } else {
        element = !isEmpty(this.defaultElement)
          ? cloneDeep(this.defaultElement)
          : {};
      }
      const formErrors = this.validate(element);

      this.setState({
        formState: element,
        formErrors,
        canSave: Object.values(formErrors).reduce(
          (boolean, oneError) => boolean && !oneError,
          true,
        ),
      });
    }
  }

  validate = (formState) => {
    if (typeof this.schema === 'undefined') {
      return {};
    }

    return validate(
      this.schema,
      formState,
      this.props,
      formState,
    );
  };

  handleFormStateChange = (field, e) => {
    const value
      = e !== undefined && e !== null && !!e.target ? e.target.value : e;
    let { formErrors } = this.state;
    const { formState } = this.state;
    const newState: any = {};

    console.info('Form changed', field, value);  // eslint-disable-line
    formState[field] = value;

    formErrors = this.validate(formState);

    newState.canSave = Object.values(formErrors).reduce(
      (boolean, oneError) => boolean && !oneError,
      true,
    );

    newState.formState = formState;
    newState.formErrors = formErrors;

    this.setState(newState);

    return newState;
  };

  nullValueForField = (field, value) => {
    const { schema = {} } = this;
    const { properties = [] } = schema;
    const fieldsType = properties.reduce(
      (obj, val) => Object.assign(obj, { [val.key]: val.type }),
      {},
    );

    switch (fieldsType[field]) {
      case 'string':
      case 'date':
        return '';
      case 'number':
        return null;
      default:
        if (typeof value === 'string') {
          if (isNaN(+value)) {
            return '';
          }
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
  };

  // отправка формы
  handleFormSubmit = async () => {
    const uniqueField = this.uniqueField || 'id';
    let { formState } = this.state;
    let result = null;
    Object.entries(formState).forEach(([key, val]) => {
      if (typeof val === 'string') {
        formState[key] = val.trim();
      }
    });

    if (this.schema) {
      this.schema.properties.forEach((p) => {
        if (p.type === 'number' && p.float) {
          formState[p.key]
            = !isNaN(formState[p.key]) && formState[p.key] !== null
              ? parseFloat(formState[p.key])
              : null;
        }
        if (p.type === 'number' && p.integer) {
          const parsedValue = parseInt(formState[p.key], 10);
          formState[p.key] = !isNaN(parsedValue) ? parsedValue : null;
        }

        if (typeof p.isSubmitted === 'function') {
          formState = p.isSubmitted(formState)
            ? formState
            : omit(formState, p.key);
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
            canSave: false,
          });
          result = await this.createAction(formState);
          this.setState({
            saveButtonLabel: SAVE_BUTTON_LABEL_DEFAULT,
            saveButtonEnability: true,
            canSave: true,
          });
        } catch (errorData) {
          this.setState({
            saveButtonLabel: SAVE_BUTTON_LABEL_DEFAULT,
            saveButtonEnability: true,
            canSave: true,
          });
          console.warn(errorData.error_text);  // eslint-disable-line
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
            canSave: false,
          });
          result = await this.updateAction(formState);
          this.setState({
            saveButtonLabel: SAVE_BUTTON_LABEL_DEFAULT,
            saveButtonEnability: true,
            canSave: true,
          });
        } catch ({ error_text }) {
          this.setState({
            saveButtonLabel: SAVE_BUTTON_LABEL_DEFAULT,
            saveButtonEnability: true,
            canSave: true,
          });
          console.warn(error_text);  // eslint-disable-line
          return;
        }
      } else {
        throw new Error('Update action called but not specified');
      }
      // в случае успешного обновления выдаем всплывающее окно
      if (!this.preventDefaultNotification) {
        global.NOTIFICATION_SYSTEM.notify(saveDataSuccessNotification);
      }
    }
    // закрываем форму только в случае отсутствия исключительных ситуаций
    if (typeof this.props.onFormHide === 'function' && result !== 'isError') {
      this.props.onFormHide(result);
    }
  };

  render() {
    return (
      <div>
        UNSAFE_FormWrap: do not call abstract method UNSAFE_FormWrap#render from
        child.
      </div>
    );
  }
}

export default FormWrap;

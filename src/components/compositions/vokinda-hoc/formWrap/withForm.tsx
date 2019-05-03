import * as React from 'react';
import { get } from 'lodash';
import { isFunction, isString, isBoolean, isArray } from 'util';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { SchemaType, FormErrorType } from 'components/ui/form/new/@types/validate.h';
import { validate } from 'components/ui/form/new/validate';
import { compose } from 'recompose';
import { connect, DispatchProp } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { createValidDateTime, createValidDate } from 'utils/dates';
import { isObject } from 'highcharts';
import PreloaderComponent from 'components/ui/new/preloader/Preloader';

/**
 * @params uniqField - уникальный ключ формы
 */
type ConfigWithForm<P, F> = {
  uniqField: keyof F | boolean;       // уникальный ключ формы
  createAction?: any;                 // Экшен создания записи
  updateAction?: any;                 // Экшен изменения записи
  withThrow?: boolean;                // Бросает исключение при сабмите
  getRecordAction?: any;              // Экшен загрузки записи по uniqField
  mergeElement?: (props: P) => F;     // Получение дефолтного элемента
  noMessage?: boolean;                // Не показывать уведомление после сабмита
  schema: SchemaType<F, P>,           // Схема валиадции
  permissions: {                      // Разрешения
    create: string | string[];
    update: string | string[];
    [k: string]: any;
  };
};

type WithFormConfigProps = {
  element: any,
  handleHide?: <A>(isSubmitted: boolean, result?: A) => any;
  readOnly?: boolean;

  page: string;
  path?: string;
};

type WithFormState<F, P> = {
  formState: F;
  originalFormState: F,
  formErrors: FormErrorType<SchemaType<F, P>>;
  canSave: boolean;

  hasData: boolean;
  inLoading: boolean;
};

type WithFormProps<P> = P & DispatchProp & {
  IS_CREATING: boolean;
  isPermitted: boolean;
  isPermittedToUpdate: boolean;
  isPermittedToCreate: boolean;
};

export type FormWithHandleChange<F> = (objChange: Partial<F> | keyof F, value?: F[keyof F]) => any;
export type FormWithHandleChangeBoolean<F> = (objChange: keyof F, value: F[keyof F]) => any;
type FormWithSubmitAction = (...arg: any[]) => Promise<any>;
type FormWithDefaultSubmit = () => void;

export type OutputWithFormProps<P, F, T extends any[], A> = (
  WithFormProps<P>
  & WithFormState<F, P>
  & Pick<ConfigWithForm<P, F>, 'mergeElement' | 'schema'>
  & {
    handleChange: FormWithHandleChange<F>;
    handleChangeBoolean: FormWithHandleChangeBoolean<F>;
    submitAction: FormWithSubmitAction;
    defaultSubmit: FormWithDefaultSubmit;
    hideWithoutChanges: (...arg: any[]) => void;
  }
);

const canSaveTest = (errorsData: any) => {
  if (isObject(errorsData)) {
    return Object.values(errorsData).every((error) => canSaveTest(error));
  }
  if (isArray(errorsData)) {
    return errorsData.every((error) => canSaveTest(error));
  }

  return !errorsData;
};

const getInitState = (propsForm: WithFormProps<any>, configForm: any, hasDataForm) => {
  let formState = propsForm.element;

  if (isFunction(configForm.mergeElement)) {
    formState = configForm.mergeElement(propsForm);
  }

  const formErrors = validate(configForm.schema, formState, propsForm, formState);

  return {
    formState,
    originalFormState: formState,
    formErrors,
    canSave: canSaveTest(formErrors),
    hasData: hasDataForm,
  };
};

export const removeEmptyString = (formState: any) => {
  Object.keys(formState).forEach((key) => {
    if (formState[key] === '') {
      formState[key] = null;
      return;
    }

    if (isObject(formState[key])) {
      removeEmptyString(formState[key]);
      return;
    }
    if (isArray(formState[key]) && isObject(formState[key][0])) {
      formState[key].forEach((obj) => {
        removeEmptyString(obj);
      });
    }
  });
};

const withForm = <P extends WithFormConfigProps, F>(config: ConfigWithForm<WithFormProps<P>, F>) => (Component) => (
  compose<any, any>(
    withRequirePermissionsNew({
      permissions: config.permissions.update,
      withIsPermittedProps: true,
      permissionName: 'isPermittedToUpdate',
    }),
    withRequirePermissionsNew({
      permissions: config.permissions.create,
      withIsPermittedProps: true,
      permissionName: 'isPermittedToCreate',
    }),
    connect<{}, DispatchProp, any, ReduxState>(
      null,
    ),
  )(
    class extends React.PureComponent<WithFormProps<P>, WithFormState<F, P>> {
      constructor(props) {
        super(props);

        const hasData = (
          !Boolean(config.getRecordAction)
          || (
            isBoolean(config.uniqField)
            || (
              !isBoolean(config.uniqField)
              && !get(props.element, config.uniqField, null)
            )
          )
        );

        this.state = {
          ...getInitState(
            props,
            config,
            hasData,
          ),
          inLoading: false,
        };
      }

      static getDerivedStateFromProps(nextProps: WithFormProps<P>, prevState: WithFormState<F, P>) {
        const triggerOnUpdateFromState = (
          !isBoolean(config.uniqField)
          && get(nextProps.element, config.uniqField, null)
          && get(nextProps.element, config.uniqField, null) !== get(prevState.formState, config.uniqField, null)
        );

        if (triggerOnUpdateFromState) {
          const triggerOnLoadNewData = (
            config.getRecordAction
            && !prevState.inLoading
          );

          if (triggerOnLoadNewData) {
            return {
              hasData: false,
              inLoading: false,
            };
          } else {
            return {
              ...getInitState(
                nextProps,
                config,
                true,
              ),
            };
          }
        }

        return null;
      }

      componentDidMount() {
        if (!this.state.hasData) {
          this.loadElement();
        }
      }

      async loadElement() {
        if (!isBoolean(config.uniqField)) {
          this.setState({
            inLoading: true,
          });

          let element: F = null;

          try {
            element = await this.props.dispatch(
              config.getRecordAction(
                this.props.element[config.uniqField],
                {
                  page: this.props.page,
                  path: this.props.path,
                },
              ),
            );
          } catch (error) {
            console.error('ошибка загузки'); // tslint:disable-line
          }

          if (element) {
            this.setState((state, props) => ({
              ...getInitState(
                {
                  ...props,
                  element,
                },
                config,
                true,
              ),
              inLoading: false,
            }));
          } else {
            global.NOTIFICATION_SYSTEM.notify('Выбранная запись не найдена', 'info', 'tr');
            this.props.handleHide(false);
          }
        }
      }

      componentDidUpdate(prevProps) {
        if (!this.state.hasData && !this.state.inLoading) {
          this.loadElement();
        }

        if (Object.entries(this.props).some(([key, value]) => value !== prevProps[key])) {
          this.setState((oldState) => {
            const formErrors = this.validate(oldState.formState);

            return {
              formErrors,
              canSave: this.canSave({
                ...oldState,
                formErrors,
              }),
            };
          });
        }
      }

      validate = (formState: F) => {
        return validate(config.schema, formState, this.props, formState);
      }
      canSave = (state: WithFormState<F, P>) => {
        return canSaveTest(state.formErrors);
      }
      handleChangeBoolean: FormWithHandleChangeBoolean<F> = (objChangeOrName, newRawValue) => {
        this.handleChange(objChangeOrName, get(newRawValue, ['target', 'checked'], null));
      }
      /**
       * @todo 1 сделать, чтобы шагал вглубь (по свойствам/массивам свойств)
       */
      handleChange: FormWithHandleChange<F> = (objChangeOrName, newRawValue) => {
        const objChangeItareble = !isString(objChangeOrName)
          ? objChangeOrName
          : {
            [objChangeOrName]: get(newRawValue, ['target', 'value'], newRawValue),
          };

        this.setState(({ formState: { ...formState } }) => {
          Object.entries(objChangeItareble).forEach(([key, value]) => {
            let newValue = value;
            if (key in config.schema.properties) {
              switch (config.schema.properties[key].type) {
                case 'number':
                  const valueNumberString: number | string = (value as number | string);

                  if (valueNumberString || valueNumberString === 0) {
                    const valueReplaced = valueNumberString.toString().replace(/,/g, '.');
                    if (!isNaN(Number(valueReplaced))) {
                      if (valueReplaced.match(/^.\d*$/)) {
                        newValue = `0${valueReplaced}`;
                      }
                      newValue = valueReplaced;
                    } else {
                      newValue = valueReplaced;
                    }
                  } else {
                    newValue = null;
                  }
                  break;
                case 'string':
                case 'boolean':
                  newValue = value;
                  break;
                case 'date':
                  newValue = createValidDate(value);
                  break;
                case 'datetime':
                  newValue = createValidDateTime(value);
                  break;
                default:
                  newValue = Boolean(value) || value === 0 ? value : null;
              }
            }
            formState[key] = newValue;

            console.log('FORM CHANGE STATE', key, formState[key]); // tslint:disable-line:no-console
          });

          const formErrors = this.validate(formState);
          const newState = {
            formState,
            formErrors,
            canSave: this.state.canSave,
          };

          return {
            ...newState,
            canSave: this.canSave({
              ...this.state,
              ...newState,
            }),
          };
        });
      }
      submitAction = async (...payload: any[]) => {
        const uniqValue = (
          !isBoolean(config.uniqField)
            ? get(this.state.formState, config.uniqField, null)
            : null
        );

        const {
          page,
          path,
        } = this.props;

        let result = null;

        if (!uniqValue) {
          const {
            createAction,
          } = config;

          if (isFunction(createAction)) {
            try {
              result = await this.props.dispatch(createAction(...payload, { page, path }));
              if (!config.noMessage) {
                global.NOTIFICATION_SYSTEM.notify('Запись успешно добавлена', 'success');
              }
            } catch (error) {
              console.warn(error); // tslint:disable-line
              if (config.withThrow) {
                throw error;
              }
              return null;
            }
          } else {
            throw new Error('Определи функцию createAction в конфиге withForm');
          }
        } else {
          const {
            updateAction,
          } = config;

          if (isFunction(updateAction)) {
            try {
              result = await this.props.dispatch(updateAction(...payload, { page, path }));
              if (!config.noMessage) {
                global.NOTIFICATION_SYSTEM.notify('Данные успешно сохранены', 'success');
              }
            } catch (error) {
              console.warn(error); // tslint:disable-line
              if (config.withThrow) {
                throw error;
              }
              return null;
            }
          } else {
            throw new Error('Определи функцию updateAction в конфиге withForm');
          }
        }

        return result;
      }

      defaultSubmit: FormWithDefaultSubmit = async () => {
        const formatedFormState = { ...this.state.formState };
        Object.entries(config.schema.properties).forEach(([key, { type }]: any) => {
          let value: any = formatedFormState[key];

          if (type === 'number' && value) {
            value = Number(value);
          }

          if (type === 'date' && value) {
            value = createValidDate(value);
          }
          if (type === 'datetime' && value) {
            value = createValidDateTime(value);
          }
          formatedFormState[key] = value;
        });

        removeEmptyString(formatedFormState);

        const result = await this.submitAction(formatedFormState);

        if (result) {
          if (isFunction(this.props.handleHide)) {
            this.props.handleHide(true, result);
          }
        }

        return result;
      }

      hideWithoutChanges = () => {
        this.props.handleHide(false);
      }

      render() {
        const IS_CREATING = !Boolean(get(this.state.formState, `${config.uniqField}`, !config.uniqField));
        const isPermittedToCreate = this.props.isPermittedToCreate && !this.props.readOnly;
        const isPermittedToUpdate = this.props.isPermittedToUpdate && !this.props.readOnly;
        const isPermitted = (
          IS_CREATING
            ? isPermittedToCreate
            : isPermittedToUpdate
        );

        return this.state.hasData && !this.state.inLoading
          ? (
            <Component
              {...this.props}
              isPermittedToCreate={this.props.isPermittedToCreate && !this.props.readOnly}
              isPermittedToUpdate={this.props.isPermittedToUpdate && !this.props.readOnly}
              isPermitted={isPermitted}
              formState={this.state.formState}
              originalFormState={this.state.originalFormState}
              formErrors={this.state.formErrors}
              canSave={this.state.canSave}
              handleChange={this.handleChange}
              handleChangeBoolean={this.handleChangeBoolean}
              submitAction={this.submitAction}
              defaultSubmit={this.defaultSubmit}
              hideWithoutChanges={this.hideWithoutChanges}
              IS_CREATING={IS_CREATING}
            />
          )
          : (
            <PreloaderComponent typePreloader="mainpage" />
          );
      }
    },
  )
);

export default withForm;

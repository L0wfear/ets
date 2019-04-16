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

type ConfigWithForm<P, F, S> = {
  uniqField: keyof F | boolean;
  createAction?: any;
  updateAction?: any;
  getRecordAction?: any;
  mergeElement?: (props: P) => F;
  canSave?: (state: S, props: P) => boolean;
  validate?: (formState: F, props: P) => FormErrorType<F>;
  schema: SchemaType<F, P>,
  permissions: {
    update: string;
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

type WithFormState<F> = {
  formState: F;
  originalFormState: F,
  formErrors: FormErrorType<F>;
  canSave: boolean;
};

type WithFormProps<P> = P & DispatchProp & {
  IS_CREATING: boolean;
  isPermitted: boolean;
  isPermittedToUpdate: boolean;
  isPermittedToCreate: boolean;
};

export type FormWithHandleChange<F> = (objChange: Partial<F> | keyof F, value?: F[keyof F]) => any;
export type FormWithHandleChangeBoolean<F> = (objChange: keyof F, value: F[keyof F]) => any;
type FormWithSubmitAction<T extends any[], A extends any> = (...payload: T) => Promise<A>;
type FormWithDefaultSubmit = () => void;

export type OutputWithFormProps<P, F, T extends any[], A> = (
  WithFormProps<P>
  & WithFormState<F>
  & Pick<ConfigWithForm<P, F, WithFormState<F>>, 'mergeElement' | 'canSave' | 'validate' | 'schema'>
  & {
    handleChange: FormWithHandleChange<F>;
    handleChangeBoolean: FormWithHandleChangeBoolean<F>;
    submitAction: FormWithSubmitAction<T, A>;
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

const withForm = <P extends WithFormConfigProps, F>(config: ConfigWithForm<Readonly<{ children?: React.ReactNode; }> & Readonly<WithFormProps<P>>, F, WithFormState<F>>) => (Component) => (
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
    class extends React.PureComponent<WithFormProps<P>, WithFormState<F>> {
      constructor(props) {
        super(props);

        this.state = this.getInitState(props);
      }

      getInitState(props: WithFormProps<P>) {
        let formState: F = props.element;

        if (isFunction(config.mergeElement)) {
          formState = config.mergeElement(props);
        }

        const formErrors = this.validate(formState);

        const newState = {
          formState,
          originalFormState: formState,
          formErrors,
          canSave: false,
        };

        return {
          ...newState,
          canSave: this.canSave({
            ...newState,
          }),
        };
      }

      componentDidMount() {
        this.checkOnNewData();
      }

      checkOnNewData() {
        if (config.getRecordAction && !isBoolean(config.uniqField) && this.props.element[config.uniqField]) {
          this.props.dispatch(
            config.getRecordAction(
              this.props.element[config.uniqField],
              {
                page: this.props.page,
                path: this.props.path,
              },
            ),
          ).then(
            (element: F) => {
              this.setState(
                this.getInitState({
                  ...this.props,
                  element,
                }),
              );
            },
          );
        }
      }

      componentDidUpdate(prevProps) {
        if (Object.entries(this.props).some(([key, value]) => value !== prevProps[key])) {
          if (this.props.element !== prevProps.element) {
            this.setState(this.getInitState(this.props));
            this.checkOnNewData();
          } else {
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
      }

      validate = (formState: F) => {
        if (isFunction(config.validate)) {
          return config.validate(formState, this.props);
        }

        return validate(config.schema, formState, this.props);
      }
      canSave = (state: WithFormState<F>) => {
        if (isFunction(config.canSave)) {
          return config.canSave(state, this.props);
        }

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
      submitAction = async <T extends any[], A extends any>(...payload: T) => {
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
              global.NOTIFICATION_SYSTEM.notify('Запись успешно добавлена', 'success');
            } catch (error) {
              console.warn(error); // tslint:disable-line
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
              global.NOTIFICATION_SYSTEM.notify('Данные успешно сохранены', 'success');
            } catch (error) {
              console.warn(error); // tslint:disable-line
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

          if (type === 'string' && !value) {
            value = null;
          }

          formatedFormState[key] = value;
        });

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

        return (
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
        );
      }
    },
  )
);

export default withForm;

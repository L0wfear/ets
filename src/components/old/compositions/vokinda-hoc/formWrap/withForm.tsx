import * as React from 'react';
import { cloneDeep, get } from 'lodash';
import { isFunction, isString, isBoolean } from 'util';
import { compose, withProps } from 'recompose';
import { connect, DispatchProp } from 'react-redux';

import { SchemaType, FormErrorType, PropertieType } from 'components/old/ui/form/new/@types/validate.h';
import { validate } from 'components/old/ui/form/new/validate';
import { ReduxState } from 'redux-main/@types/state';
import PreloadNew from 'components/old/ui/new/preloader/PreloadNew';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSessionState } from 'redux-main/reducers/selectors';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import { validatePermissions } from 'components/@next/@utils/validate_permissions/validate_permissions';
import { canSaveTest } from 'components/@next/@form/validate/validate';
import { removeEmptyString, getFormatedValue } from 'redux-main/reducers/modules/form_data_record/actions';

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
  schema: SchemaType<F, P>;           // Схема валиадции
  permissions: {                      // Разрешения
    create: string | Array<string>;
    update: string | Array<string>;
    [k: string]: any;
  };
  askBeforeCloseIfChanged?: {         // спрашивать перед закрытие формы
    askTitle?: string;
    askBody?: string;
  };
};

type WithFormConfigProps = {
  element: any;
  handleHide?: (isSubmitted: boolean, result?: any) => any;
  readOnly?: boolean;

  page: string;
  path?: string;
};

type WithFormState<F, P> = {
  formState: F;
  originalFormState: F;
  formErrors: FormErrorType<SchemaType<F, P>>;
  canSave: boolean;

  hasData: boolean;
  inLoading: boolean;
  inSubmit: boolean;
};

type StateProps = {
  userData: InitialStateSession['userData'];
};

type WithFormProps<P> = P & StateProps &  { dispatch: EtsDispatch; } & {
  IS_CREATING: boolean;
  isPermitted: boolean;
  isPermittedToUpdate: boolean;
  isPermittedToCreate: boolean;
};

export type FormWithHandleChange<F> = (objChange: Partial<F> | keyof F, value?: F[keyof F]) => any;
export type FormWithHandleChangeBoolean<F> = (objChange: keyof F, value: F[keyof F]) => any;
type FormWithSubmitAction = (...arg: Array<any>) => Promise<any>;
type FormWithDefaultSubmit = () => void;

export type OutputWithFormProps<P, F, T extends any = any, A extends any = any> = (
  WithFormProps<P>
  & WithFormState<F, P>
  & Pick<ConfigWithForm<P, F>, 'mergeElement' | 'schema'>
  & {
    handleChange: FormWithHandleChange<F>;
    handleChangeBoolean: FormWithHandleChangeBoolean<F>;
    submitAction: FormWithSubmitAction;
    defaultSubmit: FormWithDefaultSubmit;
    hideWithoutChanges: (...arg: Array<any>) => void;

    actionWrap: <PromiseAns extends any>(promiseFunc: () => Promise<PromiseAns>) => Promise<PromiseAns>;
  }
);

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

const withForm = <P extends WithFormConfigProps, F>(config: ConfigWithForm<WithFormProps<P>, F>) => (Component) => (
  compose<any, any>(
    connect<StateProps, DispatchProp, any, ReduxState>(
      (state) => ({
        userData: getSessionState(state).userData,
      }),
    ),
    withProps<StateProps & { isPermittedToCreate: boolean; isPermittedToUpdate: boolean; }, any>(
      (props) => ({
        ...props,
        isPermittedToCreate: validatePermissions(config.permissions.create, props.userData.permissionsSet),
        isPermittedToUpdate: validatePermissions(config.permissions.update, props.userData.permissionsSet),
      }),
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
          inSubmit: false,
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
      };
      canSave = (state: WithFormState<F, P>) => {
        return canSaveTest(state.formErrors);
      };
      handleChangeBoolean: FormWithHandleChangeBoolean<F> = (objChangeOrName, newRawValue) => {
        this.handleChange(objChangeOrName, get(newRawValue, ['target', 'checked'], null));
      };
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
            formState[key] = getFormatedValue(config.schema.properties[key], value);
            console.info('FORM CHANGE STATE', key, formState[key]); // eslint-disable-line
          });

          const formErrors = this.validate(formState);
          const newState = {
            formState,
            formErrors,
            canSave: this.state.canSave,
          };

          console.info('ERROR CHANGE STATE', formErrors); // eslint-disable-line
          return {
            ...newState,
            canSave: this.canSave({
              ...this.state,
              ...newState,
            }),
          };
        });
      };

      actionWrap = async <T extends any>(promiseFunc: () => Promise<T>): Promise<T> => {
        let result = null;
        if (!this.state.inSubmit) {
          this.setState({
            inSubmit: true,
          });

          try {
            result = await etsLoadingCounter(
              this.props.dispatch,
              promiseFunc(),
              {
                page: this.props.page,
                path: this.props.path,
              },
            );
          } catch (error) {
            this.setState({
              inSubmit: false,
            });
            throw error;
          }
          this.setState({
            inSubmit: false,
          });
        } else {
          console.info('i want more request'); // tslint:disable-line
        }

        return result;
      };

      createAction = async (...payload) => {
        const {
          createAction,
        } = config;
        const {
          page,
          path,
        } = this.props;

        let result = null;

        if (isFunction(createAction)) {
          try {
            result = await this.actionWrap(
              () => this.props.dispatch(createAction(...payload, { page, path })),
            );
            if (!config.noMessage) {
              global.NOTIFICATION_SYSTEM.notify('Запись успешно добавлена', 'success');
            }
          } catch (error) {
            throw error;
          }

          this.setState({
            inSubmit: false,
          });
        } else {
          throw new Error('Определи функцию createAction в конфиге withForm');
        }

        return result;
      };

      updateAction = async (...payload) => {
        const {
          updateAction,
        } = config;
        const {
          page,
          path,
        } = this.props;

        let result = null;

        if (isFunction(updateAction)) {
          try {
            result = await this.actionWrap(
              () => this.props.dispatch(updateAction(...payload, { page, path })),
            );
            if (!config.noMessage) {
              global.NOTIFICATION_SYSTEM.notify('Данные успешно сохранены', 'success');
            }
          } catch (error) {
            throw error;
          }
        } else {
          throw new Error('Определи функцию updateAction в конфиге withForm');
        }

        return result;
      };

      submitAction = async (...payload: Array<any>) => {
        const uniqValue = (
          !isBoolean(config.uniqField)
            ? get(this.state.formState, config.uniqField, null)
            : null
        );

        let result = null;

        try {
          if (!uniqValue) {
            result = await this.createAction(...payload);
          } else {
            result = await this.updateAction(...payload);
          }

          return result;
        } catch (error) {
          console.warn(error); // tslint:disable-line

          this.setState({
            inSubmit: false,
          });

          if (config.withThrow) {
            throw error;
          }
          return null;
        }
      };

      defaultSubmit: FormWithDefaultSubmit = async () => {
        const formatedFormState = cloneDeep(this.state.formState);
        Object.entries(config.schema.properties).forEach(
          (validateFieldEntrie) => {
            const key = validateFieldEntrie[0] as keyof F;
            const validateFieldData = validateFieldEntrie[1] as PropertieType<F, any>;

            formatedFormState[key] = getFormatedValue(validateFieldData as any, formatedFormState[key], true);
          },
        );

        removeEmptyString(formatedFormState);

        const result = await this.submitAction(formatedFormState);

        if (result) {
          if (isFunction(this.props.handleHide)) {
            this.props.handleHide(true, result);
          }
        }

        return result;
      };

      hideWithoutChanges = async () => {
        if (config.askBeforeCloseIfChanged) {
          if (this.state.originalFormState !== this.state.formState) {
            try {
              await global.confirmDialog({
                title: config.askBeforeCloseIfChanged.askTitle || 'Покинуть страницу?',
                body: config.askBeforeCloseIfChanged.askBody || 'Возможно, внесенные изменения не сохранятся.',
                okName: 'Закрыть',
                cancelName: 'Остаться',
              });
            } catch {
              return;
            }
          }
        }
        this.props.handleHide(false);
      };

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
              createAction={this.createAction}
              updateAction={this.updateAction}
              isPermittedToCreate={isPermittedToCreate}
              isPermittedToUpdate={isPermittedToUpdate}
              isPermitted={isPermitted}
              formState={this.state.formState}
              originalFormState={this.state.originalFormState}
              formErrors={this.state.formErrors}
              canSave={this.state.canSave && !this.state.inSubmit}
              handleChange={this.handleChange}
              handleChangeBoolean={this.handleChangeBoolean}
              submitAction={this.submitAction}
              defaultSubmit={this.defaultSubmit}
              hideWithoutChanges={this.hideWithoutChanges}
              IS_CREATING={IS_CREATING}
              actionWrap={this.actionWrap}
            />
          )
          : (
            <PreloadNew typePreloader="mainpage" />
          );
      }
    },
  )
);

export default withForm;

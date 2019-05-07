import * as React from 'react';
import { get } from 'lodash';
import { isFunction, isString, isArray, isObject } from 'util';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { SchemaType, PropertieType } from 'components/ui/form/new/@types/validate.h';
import { validate } from 'components/ui/form/new/validate';
import { compose } from 'recompose';

type FormErrorType<F> = {
  [K in keyof F]?: string | null;
};

type ConfigWithForm<P, F, S> = {
  uniqField: keyof F;
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
  handleHide?: <A>(isSubmited: boolean, result?: A) => any;
  createAction?: <T extends any[], A extends any>(...arg: T) => A;
  updateAction?: <T extends any[], A extends any>(...arg: T) => A;
};

type WithFormState<F> = {
  formState: F;
  originalFormState: F,
  formErrors: FormErrorType<F>;
  canSave: boolean;
  propertiesByKey: {
    [K in keyof F]?: PropertieType<F>
  };
};

type WithFormProps<P> = P & {
  isPermittedToUpdate: boolean;
  isPermittedToCreate: boolean;
};

type FormWithHandleChange<F> = (objChange: Partial<F> | keyof F, value?: F[keyof F]) => any;
type FormWithSubmitAction<T extends any[], A extends any> = (...payload: T) => Promise<A>;
type FormWithDefaultSubmit = () => void;

export type OutputWithFormProps<P, F, T extends any[], A> = (
  WithFormProps<P>
  & WithFormState<F>
  & Pick<ConfigWithForm<P, F, WithFormState<F>>, 'mergeElement' | 'canSave' | 'validate' | 'schema'>
  & {
    handleChange: FormWithHandleChange<F>;
    submitAction: FormWithSubmitAction<T, A>;
    defaultSubmit: FormWithDefaultSubmit;
  }
);

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
  )(
    class extends React.PureComponent<WithFormProps<P>, WithFormState<F>> {
      constructor(props) {
        super(props);

        let formState: F = props.element;

        if (isFunction(config.mergeElement)) {
          formState = config.mergeElement(props);
        }

        const formErrors = this.validate(formState);

        const newState = {
          formState,
          originalFormState: formState,
          formErrors,
          propertiesByKey: config.schema.properties.reduce<{ [K in keyof F]?: PropertieType<F>}>((newObj, { key, ...other }) => {
            newObj[key] = {
              key,
              ...other,
            };
            return newObj;
          }, {}),
          canSave: false,
        };

        this.state = {
          ...newState,
          canSave: this.canSave({
            ...newState,
          }),
        };
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

        return Object.values(state.formErrors).every((error) => !error);
      }
      handleChange: FormWithHandleChange<F> = (objChangeOrName, newRawValue) => {
        const objChangeItareble = !isString(objChangeOrName)
          ? objChangeOrName
          : {
            [objChangeOrName]: get(newRawValue, ['target', 'value'], newRawValue),
          };

        const { propertiesByKey } = this.state;
        const formState = { ...this.state.formState };

        Object.entries(objChangeItareble).forEach(([key, value]) => {
          let newValue = value;
          if (key in propertiesByKey) {
            switch (propertiesByKey[key].type) {
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
              case 'boolean':
                newValue = value;
                break;
              case 'string':
              case 'date':
              case 'datetime':
              default:
              newValue = Boolean(value) || value === 0 ? value : null;
            }
          }
          formState[key] = newValue;

          console.log('FORM CHANGE STATE', key, formState[key]); // tslint:disable-line
        });

        const formErrors = this.validate(formState);
        const newState = {
          formState,
          formErrors,
          canSave: this.state.canSave,
        };

        this.setState({
          ...newState,
          canSave: this.canSave({
            ...this.state,
            ...newState,
          }),
        });
      }
      submitAction = async <T extends any[], A extends any>(...payload: T) => {
        const {
          formState: {
            [config.uniqField]: uniqValue,
          },
        } = this.state;

        let result = null;

        if (!uniqValue) {
          if (isFunction(this.props.createAction)) {
            try {
              result = await this.props.createAction<T, A>(...payload);
              global.NOTIFICATION_SYSTEM.notify('Запись успешно добавлена', 'success');
            } catch (error) {
              console.warn(error); // tslint:disable-line
              return null;
            }
          } else {
            throw new Error('Определи функцию createAction в конфиге withForm');
          }
        } else {
          if (isFunction(this.props.updateAction)) {
            try {
              result = await this.props.updateAction<T, A>(...payload);
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

      defaultSubmit = async () => {
        const formatedFormState = { ...this.state.formState };
        config.schema.properties.forEach(({ key, type }) => {
          let value: any = formatedFormState[key];

          if (type === 'number' && value) {
            value = Number(value);
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

      render() {
        return (
          <Component
            {...this.props}
            formState={this.state.formState}
            originalFormState={this.state.originalFormState}
            formErrors={this.state.formErrors}
            canSave={this.state.canSave}
            handleChange={this.handleChange}
            submitAction={this.submitAction}
            defaultSubmit={this.defaultSubmit}
          />
        );
      }
    },
  )
);

export default withForm;

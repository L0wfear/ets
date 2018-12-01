import * as React from 'react';
import { isFunction } from 'util';
import { clone } from 'lodash';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { SchemaType, PropertieType } from 'components/ui/form/new/@types/validate.h';
import { validate } from 'components/ui/form/new/validate';

type FormErrorType<F> = {
  [K in keyof F]?: string | null;
};

type ConfigWithForm<P, F, S> = {
  uniqField?: string;
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
  formErrors: FormErrorType<F>;
  canSave: boolean;
};

type WithFormProps<P> = P & {
  isPermitted: boolean;
};

type FormWithHandleChange<F> = (objChange: { [K in keyof F]?: F[K] }) => void;
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

const withForm = <P extends WithFormConfigProps & object, F>(config: ConfigWithForm<Readonly<{ children?: React.ReactNode; }> & Readonly<WithFormProps<P>>, F, WithFormState<F>>) => (Component) => (
  withRequirePermissionsNew({
    permissions: config.permissions.update,
    withIsPermittedProps: true,
  })
  (
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
          formErrors,
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
      handleChange: FormWithHandleChange<F> = (objChange) => {
        setImmediate(() => {
          const formState = clone<F>(this.state.formState);
          const { properties } = config.schema;
          const propertiesByKey = properties.reduce<{ [K in keyof F]?: PropertieType<F>}>((newObj, { key, ...other }) => {
            newObj[key] = {
              key,
              ...other,
            };

            return newObj;
          }, {});

          Object.entries(objChange).forEach(([key, value]) => {
            if (key in propertiesByKey) {
              switch (propertiesByKey[key].type) {
                case 'number':
                  const valueNumberString: number | string = (value as number | string);

                  if (valueNumberString || valueNumberString === 0) {
                    const valueReplaced = valueNumberString.toString().replace(/,/g, '.');
                    if (!isNaN(Number(valueReplaced))) {
                      if (valueReplaced.match(/^.\d*$/)) {
                        formState[key] = `0${valueReplaced}`;
                      }
                      formState[key] = valueReplaced;
                    } else {
                      formState[key] = valueReplaced;
                    }
                  } else {
                    formState[key] = null;
                  }
                  break;
                case 'boolean':
                  formState[key] = value;
                  break;
                case 'string':
                case 'date':
                case 'datetime':
                default:
                  formState[key] = Boolean(value) || value === 0 ? value : null;
              }
            } else {
              formState[key] = value;
            }

            // tslint:disable-next-line
            console.log('FORM CHANGE STATE', key, formState[key]);
          });

          const formErrors = this.validate(formState);
          const newState = {
            formState,
            formErrors,
            canSave: this.state.canSave,
          };

          this.setState({
            ...newState,
            canSave: this.canSave(newState),
          });
        });
      }
      submitAction = async <T extends any[], A extends any>(...payload: T) => {
        const {
          formState: {
            [config.uniqField || 'id']: uniqValue,
          },
        } = this.state as any;

        let result = null;

        if (!uniqValue) {
          if (isFunction(this.props.createAction)) {
            try {
              result = await this.props.createAction<T, A>(...payload);
              global.NOTIFICATION_SYSTEM.notify('Данные успешно сохранены', 'success');
            } catch (error) {
              // tslint:disable-next-line
              console.warn(error);
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
              // tslint:disable-next-line
              console.warn(error);
              return null;
            }
          } else {
            throw new Error('Определи функцию updateAction в конфиге withForm');
          }
        }
        const { handleHide } = this.props;

        if (isFunction(handleHide)) {
          handleHide(true, result);
        }
        return result;
      }

      defaultSubmit = () => {
        const formatedFormState = clone(this.state.formState);
        config.schema.properties.forEach(({ key, type }) => {
          let value: any = formatedFormState[key];

          if (type === 'number' && value) {
            value = Number(value);
          }

          formatedFormState[key] = value;
        });

        this.submitAction(formatedFormState);
      }

      render() {
        return (
          <Component
            {...this.props}
            formState={this.state.formState}
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

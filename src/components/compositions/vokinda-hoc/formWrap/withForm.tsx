import * as React from 'react';
import { isFunction } from 'util';
import { clone } from 'lodash';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

type FormErrorType<F> = {
  [K in keyof F]?: string | null;
};

type ConfigWithForm<P, F, S> = {
  uniqField?: string;
  mergeElement?: (props: P) => F;
  canSave?: (state: S, props: P) => boolean;
  validate?: (formState: F, props: P) => FormErrorType<F>;
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

export type OutputProps<P, F, T extends any[], A> = (
  WithFormProps<P>
  & WithFormState<F>
  & Pick<ConfigWithForm<P, F, WithFormState<F>>, 'mergeElement' | 'canSave' | 'validate'>
  & {
    handleChange: FormWithHandleChange<F>;
    submitAction: FormWithSubmitAction<T, A>;
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
        return config.validate(formState, this.props);
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

          Object.entries(objChange).forEach(([key, value]) => {
            // tslint:disable-next-line
            console.log('FORM CHANGE STATE', key, value);
            formState[key] = value;
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
        } = this.state;

        let result = null;

        if (!uniqValue) {
          if (isFunction(this.props.createAction)) {
            try {
              result = await this.props.createAction<T, A>(...payload);
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

      render() {
        return (
          <Component
            {...this.props}
            formState={this.state.formState}
            formErrors={this.state.formErrors}
            canSave={this.state.canSave}
            handleChange={this.handleChange}
            submitAction={this.submitAction}
          />
        );
      }
    },
  )
);

export default withForm;

import * as React from 'react';
import { compose } from 'recompose';
import { Route, Switch } from 'react-router-dom';
import carFormTabKey from './formConfig';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { FormWithHandleChange, FormWithHandleChangeBoolean } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { CarWrap } from '../@types/CarForm';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import RedirectCarFormBody from './RedirectCarFormBody';

type CarFormBodyContainerOwnProps = {
  isPermitted: boolean;
  formState: CarWrap;
  formErrors: any;
  onChange: FormWithHandleChange<CarWrap>;
  onChangeBoolean: FormWithHandleChangeBoolean<CarWrap>;

  page: string;
  path: string;
};
type CarFormBodyContainerProps = (
  CarFormBodyContainerOwnProps
) & WithSearchProps;

const CarFormBodyContainer: React.FC<CarFormBodyContainerProps> = React.memo(
  (props) => {
    const {
      match,
    } = props;

    return (
      <EtsBootstrap.Row>
        <Switch>
          {
            carFormTabKey.map(({ tabKey: tabKeyScheme, title, ...other }) => {
              if ('children' in other) {
                return (
                  other.children.map(({ tabKey: tabKeyChildScheme, path, ...childrenOther }) => (
                    <Route
                      key={tabKeyChildScheme}
                      path={`${match.path.replace(':tabKey?', tabKeyChildScheme)}${path}`}
                      render={
                        () => (
                          <EtsBootstrap.Col md={12}>
                            <childrenOther.component
                              formState={props.formState}
                              selectedCarData={props.formState}
                              formErrors={props.formErrors}
                              onChange={props.onChange}
                              onChangeBoolean={props.onChangeBoolean}
                              isPermitted={props.isPermitted}

                              page={props.page}
                              path={props.path}
                            />
                          </EtsBootstrap.Col>
                        )
                      } />
                  ))
                );
              }

              return (
                <Route
                  key={tabKeyScheme}
                  path={`${match.path.replace(':tabKey?', tabKeyScheme)}${other.path}`}
                  render={
                    (routeProps) => (
                      <other.component
                        {...routeProps}
                        selectedCarData={props.formState}
                      />
                    )
                  }
                />
              );
            })
          }
          <RedirectCarFormBody />
        </Switch>
      </EtsBootstrap.Row>
    );
});

export default compose<CarFormBodyContainerProps, CarFormBodyContainerOwnProps>(
  withSearch,
)(CarFormBodyContainer);

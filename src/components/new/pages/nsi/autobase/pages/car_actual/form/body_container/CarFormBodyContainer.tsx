import * as React from 'react';
import { compose } from 'recompose';
import carFormTabKey, { mainInfo } from './formConfig';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { FormWithHandleChange, FormWithHandleChangeBoolean } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { CarWrap } from '../@types/CarForm';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

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
    return (
      <Row>
        <Switch>
          {
            carFormTabKey.map(({ tabKey: tabKeyScheme, title, ...other }) => {
              if ('children' in other) {
                return (
                  other.children.map(({ tabKey: tabKeyChildScheme, path, ...childrenOther }) => (
                    <Route
                      key={tabKeyChildScheme}
                      path={`/nsi/autobase/car_actual/:car_actual_asuods_id?/${tabKeyChildScheme}${path}`}
                      render={
                        () => (
                          <Col md={12}>
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
                          </Col>
                        )
                      } />
                  ))
                );
              }

              return (
                <Route
                  key={tabKeyScheme}
                  path={`/nsi/autobase/car_actual/:car_actual_asuods_id?/${tabKeyScheme}${other.path}`}
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
          <Redirect to={`/nsi/autobase/car_actual/:car_actual_asuods_id?/${mainInfo.tabKey}`} />
        </Switch>
      </Row>
    );
});

export default compose<CarFormBodyContainerProps, CarFormBodyContainerOwnProps>(
  withSearch,
)(CarFormBodyContainer);

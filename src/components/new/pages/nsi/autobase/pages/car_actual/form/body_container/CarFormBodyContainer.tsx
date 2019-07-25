import * as React from 'react';
import { compose } from 'recompose';
import carFormTabKey, { mainInfo } from './formConfig';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { FormWithHandleChange, FormWithHandleChangeBoolean } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { CarWrap } from '../@types/CarForm';
import { Route, Switch, Redirect } from 'react-router-dom';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import * as queryString from 'query-string';

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
    const carActualSearchStateString = React.useMemo(
      () => {
        return queryString.stringify({
          CarActual_filters: props.searchState.CarActual_filters,
          CarActual_page: props.searchState.CarActual_page,
          func_type_id: props.searchState.func_type_id,
          municipal_facility_id: props.searchState.municipal_facility_id,
          route_types: props.searchState.route_types,
          technicalOperationRelationsRegistry_page: props.searchState.technicalOperationRelationsRegistry_page,
          technical_operation_id: props.searchState.technical_operation_id,
        });
      },
      [
        props.searchState.CarActual_filters,
        props.searchState.CarActual_page,
        props.searchState.func_type_id,
        props.searchState.route_types,
        props.searchState.technicalOperationRelationsRegistry_page,
        props.searchState.technical_operation_id,
      ],
    );

    const {
      match,
    } = props;

    let urlAsArray = match.path.split('/').map((str) => str === ':car_actual_asuods_id?' ? null : str);

    const emptyIndex = urlAsArray.findIndex((value, index) => index && !value);
    if (emptyIndex > 0) {
      urlAsArray = urlAsArray.slice(0, emptyIndex);
    }

    const pathname = `${urlAsArray.join('/')}/:car_actual_asuods_id?`;

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
                      path={`${pathname}/${tabKeyChildScheme}${path}`}
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
                  path={`${pathname}/${tabKeyScheme}${other.path}`}
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
          <Redirect to={`${pathname}/${mainInfo.tabKey}?${carActualSearchStateString}`} />
        </Switch>
      </EtsBootstrap.Row>
    );
});

export default compose<CarFormBodyContainerProps, CarFormBodyContainerOwnProps>(
  withSearch,
)(CarFormBodyContainer);

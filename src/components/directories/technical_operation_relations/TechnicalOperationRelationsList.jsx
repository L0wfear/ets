import * as React from 'react';
import { withRouter, Route } from 'react-router-dom';
import * as Button from 'react-bootstrap/lib/Button';

import { connectToStores, staticProps } from 'utils/decorators';
import ElementsList from 'components/ElementsList';
import TechnicalOperationRelationsTable from 'components/directories/technical_operation_relations/table/TechnicalOperationRelationsTable';
import ChangeRouteForm from 'components/directories/technical_operation_relations/change-route-form/ChangeRouteForm';
import permissions from 'components/directories/technical_operation_relations/config-data/permissions';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { makeOptions } from 'components/ui/input/makeOptions';
import { customOptionsRoutes } from 'components/directories/technical_operation_relations/helpData';
import { ButtonUpdateRoute } from 'components/new/pages/routes_list/buttons/buttons';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { getSessionState } from 'redux-main/reducers/selectors';
import CarForm from 'components/new/pages/nsi/autobase/pages/car_actual/form/CarForm';
import { DivNone } from 'global-styled/global-styled';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import carActualPermissions from 'components/new/pages/nsi/autobase/pages/car_actual/_config-data/permissions';

const ButtonChangeCarData = withRequirePermissionsNew({
  permissions: carActualPermissions.update,
})(Button);

const loadingPage = 'technical_operation_relations';

@withRouter
@connectToStores(['objects'])
@staticProps({
  entity: 'technical_operation_relations',
  permissions,
  listName: 'technicalOperationRelationsList',
  selectField: 'car_id',
  tableComponent: TechnicalOperationRelationsTable,
  operations: ['LIST'],
})
class TechnicalOperationRelationsList extends ElementsList {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      showCarForm: false,
      carElement: null,
      showRouteChangeForm: false,
      routesData: [],
      ROUTES_OPTIONS: [],
    };
  }

  init() {
    this.context.flux.getActions('objects').getCars();

    this.getData(this.props);
  }

  componentDidUpdate(prevProps) {
    const {
      technical_operation_id,
      municipal_facility_id,
      route_types,
      func_type_id,
    } = this.props;

    if (
      technical_operation_id
      && municipal_facility_id
      && route_types
      && func_type_id
      && (technical_operation_id !== prevProps.technical_operation_id
        || municipal_facility_id !== prevProps.municipal_facility_id
        || route_types !== prevProps.route_types
        || func_type_id !== prevProps.func_type_id)
    ) {
      this.getData(this.props);
    }
  }

  refreshList = () => {
    const { selectedElement, showRouteChangeForm } = this.state;

    this.getData(this.props).then(({ result }) => {
      const selectedElement_new = result.find(
        ({ car_id }) => car_id === selectedElement.car_id,
      );
      if (selectedElement_new) {
        if (showRouteChangeForm) {
          this.setState({
            selectedElement: selectedElement_new,
            routesData: selectedElement_new.routes,
            showRouteChangeForm: true,
          });
        }
      }
    });
  };

  getData(props) {
    return this.context.flux
      .getActions('technicalOperation')
      .getTechnicalOperationRelations(props)
      .then(({ result }) => {
        const options = makeOptions({
          data: result,
          options: customOptionsRoutes,
        });

        this.setState({ ...options });

        return { result };
      });
  }

  handleChangeDriver = () => {
    const carElement = this.props.carsIndex[this.state.selectedElement.car_id];

    if (!carElement) {
      console.error(
        `Нет ТС с asuods_id = ${this.state.selectedElement.car_id}`,
      ); // eslint-disable-line
    } else {
      this.setState({
        showCarForm: true,
        carElement,
      });
    }
  };

  onCarFormHide = (isSubmitted) => {
    if (isSubmitted) {
      this.refreshList();
    }
    this.setState({
      carElement: null,
      showCarForm: false,
    });
  };

  handleChangeRoutes = () =>
    this.setState(({ selectedElement }) => ({
      routesData: selectedElement.routes,
      showRouteChangeForm: true,
    }));

  onRouteFormHide = () =>
    this.setState({
      routesData: [],
      showRouteChangeForm: false,
    });

  getButtons() {
    return [
      <ButtonChangeCarData
        key="change-driver"
        onClick={this.handleChangeDriver}
        disabled={!this.state.selectedElement}>
        Изменить водителей
      </ButtonChangeCarData>,
      <ButtonUpdateRoute
        key="change-routes"
        onClick={this.handleChangeRoutes}
        disabled={!this.state.selectedElement}>
        Изменить маршрут
      </ButtonUpdateRoute>,
    ];
  }

  getAdditionalProps() {
    const { ROUTES_OPTIONS = [] } = this.state;

    return {
      ROUTES_OPTIONS,
    };
  }

  additionalRender() {
    return (
      <React.Fragment>
        {this.state.showCarForm ? (
          <Route
            path={`${this.props.match.url}/:tabKey?`}
            render={(...routeProps) => (
              <CarForm
                handleHide={this.onCarFormHide}
                element={this.state.showCarForm ? this.state.carElement : null}
                page={loadingPage}
                path="сarFormWrap"
                {...routeProps}
              />
            )}
          />
        ) : (
          <DivNone />
        )}
        <ChangeRouteForm
          showForm={this.state.showRouteChangeForm}
          onFormHide={this.onRouteFormHide}
          routesData={this.state.routesData}
          technical_operation_id={this.props.technical_operation_id}
          municipal_facility_id={this.props.municipal_facility_id}
          refreshList={this.refreshList}
          page={loadingPage}
          path="changeRouteForm"
        />
      </React.Fragment>
    );
  }
}

export default compose(
  withSearch,
  connect((state) => ({
    userData: getSessionState(state).userData,
  })),
)(TechnicalOperationRelationsList);

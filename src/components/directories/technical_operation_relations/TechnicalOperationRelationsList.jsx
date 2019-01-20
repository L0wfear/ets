import * as React from 'react';
import { withRouter } from 'react-router-dom';
import * as Button from 'react-bootstrap/lib/Button';

import { connectToStores, staticProps } from 'utils/decorators';
import ElementsList from 'components/ElementsList';
import TechnicalOperationRelationsTable from 'components/directories/technical_operation_relations/table/TechnicalOperationRelationsTable';
import CarFormWrap from 'components/directories/autobase/cars/CarFormWrap';
import ChangeRouteForm from 'components/directories/technical_operation_relations/change-route-form/ChangeRouteForm';
import permissions from 'components/directories/technical_operation_relations/config-data/permissions';
import permissionsCar from 'components/directories/autobase/cars/config-data/permissions';
import enhanceWithPermissions from 'components/util/RequirePermissionsNew';
import { makeOptions } from 'components/ui/input/makeOptions';
import { customOptionsRoutes } from 'components/directories/technical_operation_relations/helpData';
import {
  ButtonUpdateRoute,
} from 'components/new/pages/routes_list/buttons/buttons';

const ButtonChangeCarData = enhanceWithPermissions({
  permission: permissionsCar.update,
})(Button);

const loadingPage = 'technical_operation_relations';

@withRouter
@connectToStores(['objects', 'session'])
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
      && (
        technical_operation_id !== prevProps.technical_operation_id
        || municipal_facility_id !== prevProps.municipal_facility_id
        || route_types !== prevProps.route_types
        || func_type_id !== prevProps.func_type_id
      )
    ) {
      this.getData(this.props);
    }
  }

  refreshList = () => {
    const {
      selectedElement,
      showRouteChangeForm,
    } = this.state;

    this.getData(this.props).then(({ result }) => {
      const selectedElement_new = result.find(({ car_id }) => car_id === selectedElement.car_id);
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
  }

  getData(props) {
    return this.context.flux.getActions('technicalOperation').getTechnicalOperationRelations(props)
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
      console.error(`Нет ТС с asuods_id = ${this.state.selectedElement.car_id}`); // eslint-disable-line
    } else {
      this.setState({
        showCarForm: true,
        carElement,
      });
    }
  }

  onCarFormHide = () => (
    this.setState({
      carElement: null,
      showCarForm: false,
    })
  );

  handleChangeRoutes = () => (
    this.setState(selectedElement => ({
      routesData: selectedElement.routes,
      showRouteChangeForm: true,
    }))
  );

  onRouteFormHide = () => (
    this.setState({
      routesData: [],
      showRouteChangeForm: false,
    })
  );

  getButtons() {
    return [
      <ButtonChangeCarData key="change-driver" onClick={this.handleChangeDriver} disabled={!this.state.selectedElement}>{'Изменить водителей'}</ButtonChangeCarData>,
      <ButtonUpdateRoute key="change-routes" onClick={this.handleChangeRoutes} disabled={!this.state.selectedElement}>{'Изменить маршрут'}</ButtonUpdateRoute>,
    ];
  }

  getAdditionalProps() {
    const {
      ROUTES_OPTIONS = [],
    } = this.state;

    return {
      ROUTES_OPTIONS,
    };
  }

  additionalRender() {
    return [
      <CarFormWrap
        key="carFormWrap"
        showForm={this.state.showCarForm}
        onFormHide={this.onCarFormHide}
        element={this.state.carElement}
        entity="car"
        permissions={['car.read']}
        flux={this.context.flux}
        refreshList={this.refreshList}
        {...this.props}
        page={loadingPage}
        path="сarFormWrap"
      />,
      <ChangeRouteForm
        key="ChangeRouteForm"
        showForm={this.state.showRouteChangeForm}
        onFormHide={this.onRouteFormHide}
        routesData={this.state.routesData}
        technical_operation_id={this.props.technical_operation_id}
        municipal_facility_id={this.props.municipal_facility_id}
        refreshList={this.refreshList}
        page={loadingPage}
        path="changeRouteForm"
      />,
    ];
  }
}

export default TechnicalOperationRelationsList;

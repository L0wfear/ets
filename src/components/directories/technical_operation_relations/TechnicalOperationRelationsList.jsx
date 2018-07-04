import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import { connectToStores, staticProps } from 'utils/decorators';
import ElementsList from 'components/ElementsList.jsx';
import TechnicalOperationRelationsTable from 'components/directories/technical_operation_relations/table/TechnicalOperationRelationsTable';
import CarFormWrap from 'components/directories/autobase/cars/CarFormWrap';
import ChangeRouteForm from 'components/directories/technical_operation_relations/change-route-form/ChangeRouteForm';
import permissions from 'components/directories/technical_operation_relations/config-data/permissions';
import permissionsCar from 'components/directories/autobase/cars/config-data/permissions';
import permissionsRoute from 'components/route/config-data/permissions';
import enhanceWithPermissions from 'components/util/RequirePermissionsNew';
import { makeOptions } from 'components/ui/input/makeOptions';
import { customOptionsRoutes } from 'components/directories/technical_operation_relations/helpData';

const ButtonChangeCarData = enhanceWithPermissions({
  permission: permissionsCar.update,
})(Button);

const ButtonChangeRoute = enhanceWithPermissions({
  permission: permissionsRoute.update,
})(Button);

@withRouter
@connectToStores(['objects', 'session'])
@staticProps({
  entity: 'technical_operation_relations',
  permissions,
  listName: 'technicalOperationRelationsList',
  tableComponent: TechnicalOperationRelationsTable,
  operations: ['LIST'],
})
export default class TechnicalOperationRelationsList extends ElementsList {
  constructor(props) {
    super(props);

    const {
      technical_operation_id,
      municipal_facility_id,
      func_type_id,
    } = props;

    this.state = {
      ...this.state,
      technical_operation_id,
      municipal_facility_id,
      func_type_id,
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

  componentWillReceiveProps(nextProps) {
    const {
      technical_operation_id,
      municipal_facility_id,
      func_type_id,
    } = nextProps;

    if (
      this.state.technical_operation_id !== technical_operation_id ||
      this.state.municipal_facility_id !== municipal_facility_id ||
      this.state.func_type_id !== func_type_id
    ) {
      this.getData(nextProps);

      this.setState({
        technical_operation_id,
        municipal_facility_id,
        func_type_id,
      });
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
    this.context.flux.getActions('technicalOperation').getTechnicalOperationRelations(props)
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
    const carElement = this.props.carsList.find(({ asuods_id }) => asuods_id === this.state.selectedElement.car_id);
    if (!carElement) {
      console.error(`Нет ТС с asuods_id = ${this.state.selectedElement.car_id}`);
    } else {
      this.setState({
        showCarForm: true,
        carElement,
      });
    }
  }
  onCarFormHide = () => this.setState({ carElement: null, showCarForm: false });

  handleChangeRoutes = () => {
    this.setState({
      routesData: this.state.selectedElement.routes,
      showRouteChangeForm: true,
    });
  }
  onRouteFormHide = () => this.setState({ routesData: [], showRouteChangeForm: false });

  getButtons() {
    return [
      <ButtonChangeCarData key="change-driver" onClick={this.handleChangeDriver} disabled={!this.state.selectedElement}>{'Изменить водителей'}</ButtonChangeCarData>,
      <ButtonChangeRoute key="change-routes" onClick={this.handleChangeRoutes} disabled={!this.state.selectedElement}>{'Изменить машрут'}</ButtonChangeRoute>,
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
        entity={'car'}
        permissions={['car.read']}
        flux={this.context.flux}
        refreshList={this.refreshList}
        {...this.props}
      />,
      <ChangeRouteForm
        key="ChangeRouteForm"
        showForm={this.state.showRouteChangeForm}
        onFormHide={this.onRouteFormHide}
        routesData={this.state.routesData}
        technical_operation_id={this.state.technical_operation_id}
        municipal_facility_id={this.state.municipal_facility_id}
        refreshList={this.refreshList}
      />,
    ];
  }
}

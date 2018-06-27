import * as React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import ChangeRouteTable from 'components/directories/technical_operation_relations/change-route-form/ChangeRouteTable';
import RouteFormWrap from 'components/route/RouteFormWrap.jsx';
import { connectToStores, FluxContext } from 'utils/decorators';
import permissionsRoute from 'components/route/config-data/permissions';

import enhanceWithPermissions from 'components/util/RequirePermissionsNew';

const ButtonCreateRoute = enhanceWithPermissions({
  permission: permissionsRoute.create,
})(Button);

const ButtonChangeRoute = enhanceWithPermissions({
  permission: permissionsRoute.update,
})(Button);

@connectToStores(['objects', 'employees', 'missions', 'routes'])
@FluxContext
export default class ChangeRouteForm extends React.Component {
  componentDidMount() {
    this.context.flux.getActions('geoObjects').getGeozones();
  }
  state = {
    routeSelected: null,
    showRouteForm: false,
    routeElement: null,
  }

  onRowClick = ({ props: { data } }) => {
    this.setState({ routeSelected: data });
  }

  onFormHide = () => {
    this.setState({
      showRouteForm: false,
    });
  }

  handleCreateNewRoute = () => {
    this.setState({
      showRouteForm: true,
      routeElement: {
        name: '',
        technical_operation_id: this.props.technical_operation_id,
        municipal_facility_id: this.props.municipal_facility_id,
        structure_id: null,
        object_list: [],
        input_lines: [],
      },
    });
  }
  handleChangeRoute = () => {
    this.context.flux.getActions('routes').getRouteById(this.state.routeSelected.id, false)
      .then(routeElement =>
        this.setState({
          showRouteForm: true,
          routeElement,
        })
      );
  }

  render() {
    const { routeSelected } = this.state;
    return (
      this.props.showForm
      ?
        <div>
          <Modal id="modal-technical-operation" show onHide={this.props.onFormHide} bsSize="large" backdrop="static">
            <Modal.Header closeButton>
              <Modal.Title>Маршруты</Modal.Title>
            </Modal.Header>
            <ModalBody>
              <ChangeRouteTable
                data={this.props.routesData}
                onRowClick={this.onRowClick}
                selected={routeSelected}
              >
                <ButtonCreateRoute onClick={this.handleCreateNewRoute}>Создать новый маршрут</ButtonCreateRoute>
              </ChangeRouteTable>
              <Row>
                <Col md={3} mdOffset={9}>
                  <ButtonChangeRoute bsClass={'btn all-width'} disabled={!routeSelected} onClick={this.handleChangeRoute}>Изменить</ButtonChangeRoute>
                </Col>
              </Row>
            </ModalBody>
          </Modal>
          <RouteFormWrap
            element={this.state.routeElement}
            onFormHide={this.onFormHide}
            showForm={this.state.showRouteForm}
            notTemplate
            fromTechnicalOperationRelations
          />
        </div>
      :
      null
    );
  }
}

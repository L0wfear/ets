import * as React from 'react';
import * as PropTypes from 'prop-types';

import * as Modal from 'react-bootstrap/lib/Modal';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';

import ModalBody from 'components/ui/Modal';
import ChangeRouteTable from 'components/directories/technical_operation_relations/change-route-form/ChangeRouteTable';
import RouteFormWrap from 'components/route/form/RouteFormWrap';
import { FluxContext } from 'utils/decorators';

import {
  ButtonCreateRoute,
  ButtonUpdateRoute,
  ButtonDeleteRoute,
} from 'components/route/buttons/buttons';

@FluxContext
export default class ChangeRouteForm extends React.Component {

  static get propTypes() {
    return {
      technical_operation_id: PropTypes.number,
      municipal_facility_id: PropTypes.number,
      refreshList: PropTypes.func,
      showForm: PropTypes.bool,
      onFormHide: PropTypes.func,
      routesData: PropTypes.any,
    };
  }

  state = {
    routeSelected: null,
    showRouteForm: false,
    routeElement: null,
  }

  componentDidMount() {
    this.context.flux.getActions('geoObjects').getGeozones();
  }

  onRowClick = ({ props: { data } }) => {
    this.setState({ routeSelected: data });
  }

  onFormHide = () => {
    this.props.refreshList();
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
        is_main: true,
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

  removeRoute = () => {
    confirmDialog({
      title: 'Внимание!',
      body: 'Вы уверены, что хотите удалить выбранный маршрут?',
    })
    .then(() => (
      this.context.flux.getActions('routes').removeRoute(this.state.routeSelected)
        .then(() => this.onFormHide())
        .catch((error) => console.log(error)) // eslint-disable-line
    ))
    .catch(() => 0);
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
                <ButtonDeleteRoute disabled={!routeSelected} onClick={this.removeRoute}>Удалить маршрут</ButtonDeleteRoute>
              </ChangeRouteTable>
              <Row>
                <Col md={3} mdOffset={9}>
                  <ButtonUpdateRoute bsClass={'btn all-width'} disabled={!routeSelected} onClick={this.handleChangeRoute}>Изменить</ButtonUpdateRoute>
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

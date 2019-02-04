import * as React from 'react';
import * as PropTypes from 'prop-types';

import * as Modal from 'react-bootstrap/lib/Modal';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';

import ModalBody from 'components/ui/Modal';
import ChangeRouteTable from 'components/directories/technical_operation_relations/change-route-form/ChangeRouteTable';
import RouteFormWrap from 'components/new/pages/routes_list/form/RouteFormWrap';

import {
  ButtonCreateRoute,
  ButtonUpdateRoute,
  ButtonDeleteRoute,
} from 'components/new/pages/routes_list/buttons/buttons';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { routesRemoveRoute, routesLoadRouteById } from 'redux-main/reducers/modules/routes/routes/actions';
import { DivNone } from 'global-styled/global-styled';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';

class ChangeRouteForm extends React.Component {
  static get propTypes() {
    return {
      technical_operation_id: PropTypes.number,
      municipal_facility_id: PropTypes.number,
      refreshList: PropTypes.func,
      showForm: PropTypes.bool,
      onFormHide: PropTypes.func,
      routesData: PropTypes.any,
      routesRemoveRoute: PropTypes.func.isRequired,
      routesLoadRouteById: PropTypes.func.isRequired,
      page: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    };
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
    this.props.refreshList();
    this.setState({
      showRouteForm: false,
    });
  }

  handleCreateNewRouteNew = () => {
    this.setState({
      showRouteForm: true,
      routeElement: {
        is_main: true,
        name: '',
        municipal_facility_id: this.props.municipal_facility_id,
        municipal_facility_name: '',
        technical_operation_id: this.props.technical_operation_id,
        technical_operation_name: '',
        structure_id: null,
        structure_name: '',
        type: null,
        object_list: [],
        input_lines: [],
        draw_object_list: [],
      },
    });
  }

  handleChangeRouteNew = async () => {
    try {
      const { routeSelected } = this.state;
      const { payload: { route_data } } = await this.props.routesLoadRouteById(routeSelected.id);

      this.setState({
        showRouteForm: true,
        routeElement: route_data,
      });
    } catch (e) {
      console.log(e); // eslint-disable-line
    }
  }

  removeRoute = async () => {
    try {
      await confirmDialog({
        title: 'Внимание!',
        body: 'Вы уверены, что хотите удалить выбранный маршрут?',
      });
    } catch (e) {
      return;
    }
    try {
      await this.props.routesRemoveRoute(this.state.routeSelected.id);
      this.onFormHide(true);
    } catch (e) {
      console.log(error); // eslint-disable-line
    }
  }

  render() {
    const {
      routeSelected,
    } = this.state;

    const {
      page,
      path,
    } = this.props;

    return (
      this.props.showForm
        ? (
          <div>
            <Modal id="modal-technical-operation" show onHide={this.props.onFormHide} bsSize="large" backdrop="static">
              <Modal.Header closeButton>
                <Modal.Title>Маршруты</Modal.Title>
              </Modal.Header>
              <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
                <ChangeRouteTable
                  data={this.props.routesData}
                  onRowClick={this.onRowClick}
                  selected={routeSelected}
                >
                  <ButtonCreateRoute onClick={this.handleCreateNewRouteNew}>Создать новый маршрут</ButtonCreateRoute>
                  <ButtonDeleteRoute disabled={!routeSelected} onClick={this.removeRoute}>Удалить маршрут</ButtonDeleteRoute>
                </ChangeRouteTable>
                <Row>
                  <Col md={3} mdOffset={9}>
                    <ButtonUpdateRoute id="change-route" bsClass="btn all-width" disabled={!routeSelected} onClick={this.handleChangeRouteNew}>Изменить</ButtonUpdateRoute>
                  </Col>
                </Row>
              </ModalBodyPreloader>
            </Modal>
            <RouteFormWrap
              element={this.state.routeElement}
              handleHide={this.onFormHide}
              showForm={this.state.showRouteForm}
            />
          </div>
        )
        : (
          <DivNone />
        )
    );
  }
}

export default compose(
  connect(
    null,
    (dispatch, { page, path }) => ({
      routesLoadRouteById: id => (
        dispatch(
          routesLoadRouteById(
            id,
            { page, path },
          ),
        )
      ),
      routesRemoveRoute: id => (
        dispatch(
          routesRemoveRoute(
            id,
            { page, path },
          ),
        )
      ),
    }),
  ),
)(ChangeRouteForm);

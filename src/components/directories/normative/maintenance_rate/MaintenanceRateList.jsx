import React, { Component } from 'react';
import * as Button from 'react-bootstrap/lib/Button';
import * as ButtonGroup from 'react-bootstrap/lib/ButtonGroup';

import ElementsList from 'components/ElementsList';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import MaintenanceRateFormWrap from 'components/directories/normative/maintenance_rate/MaintenanceRateFormWrap';
import MaintenanceRateTable from 'components/directories/normative/maintenance_rate/MaintenanceRateTable';
import permissions from 'components/directories/normative/maintenance_rate/config-data/permissions';

import { connect } from 'react-redux';
import {
  maintenanceRateGet,
  maintenanceRateDelete,
} from 'redux-main/reducers/modules/maintenance_rate/actions-maintenanceRate';
import {
  MAINTENANCE_RATE_SET_DATA,
} from 'redux-main/reducers/modules/maintenance_rate/maintenanceRate';
import { compose } from 'recompose';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

const loadingPageName = 'maintenance-rate';

@connectToStores(['objects'])
@exportable({ entity: 'maintenance_rate' })
@staticProps({
  entity: 'maintenance_rate',
  permissions,
  listName: 'maintenanceRateList',
  tableComponent: MaintenanceRateTable,
  formComponent: MaintenanceRateFormWrap,
  operations: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
})
class MaintenanceRateDirectory extends ElementsList {
  constructor(props, context) {
    super(props);
    this.removeElementAction = context.flux.getActions('objects').deleteMaintenanceRate.bind(this, props.type);

    this.setExportType(props.type);
  }

  setExportType(type) {
    this.exportPayload = { type };
  }

  init() {
    const { flux } = this.context;
    this.props.maintenanceRateGet(this.props.type);
    // flux.getActions('objects').getMaintenanceRate(this.props.type); // redux
    flux.getActions('objects').getMaintenanceWork();
    flux.getActions('objects').getCleanCategories();
    flux.getActions('technicalOperation').getTechnicalOperations();
  }

  removeElementAction = (...arg) => (
    this.props.maintenanceRateDelete(this.props.type, ...arg)
  );

  componentDidUpdate(prevProps) {
    const { type } = this.props;

    if (prevProps.type !== type) {
      this.setExportType(type);
      this.props.maintenanceRateGet(type);
    }
  }
}

class MaintenanceRate extends Component {
  state = {
    type: 'odh',
  }

  render() {
    const {
      type,
    } = this.state;
    return (
      <div>
        <div className="cleaning-rate-header">
          <ButtonGroup>
            <Button active={this.state.type === 'odh'} onClick={() => this.setState({ type: 'odh' })}>ОДХ</Button>
            <Button disabled active={this.state.type === 'dt'} onClick={() => this.setState({ type: 'dt' })}>ДТ</Button>
          </ButtonGroup>
        </div>
        <MaintenanceRateDirectory type={type} {...this.props} />
      </div>
    );
  }
}

export default compose(
  withPreloader({
    page: loadingPageName,
    typePreloader: 'mainpage',
  }),
  connect(
    state => ({
      maintenanceRateList: state.maintenanceRate.maintenanceRateList,
    }),
    dispatch => ({
      maintenanceRateGet: type => (
        dispatch(
          maintenanceRateGet(MAINTENANCE_RATE_SET_DATA, type),
        )
      ),
      maintenanceRateDelete: (type, id) => (
        dispatch(
          maintenanceRateDelete(MAINTENANCE_RATE_SET_DATA, type, id),
        )
      ),
    }),
  ),
)(MaintenanceRate);

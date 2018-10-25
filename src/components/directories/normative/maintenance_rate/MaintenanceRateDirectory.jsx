import React, { Component } from 'react';
import * as Button from 'react-bootstrap/lib/Button';
import * as ButtonGroup from 'react-bootstrap/lib/ButtonGroup';

import ElementsList from 'components/ElementsList';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import MaintenanceRateFormWrap from 'components/directories/normative/maintenance_rate/MaintenanceRateFormWrap';
import MaintenanceRateTable from 'components/directories/normative/maintenance_rate/MaintenanceRateTable';
import permissions from 'components/directories/normative/maintenance_rate/config-data/permissions';

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
    flux.getActions('objects').getMaintenanceRate(this.props.type);
    flux.getActions('objects').getMaintenanceWork();
    flux.getActions('objects').getCleanCategories();
    flux.getActions('technicalOperation').getTechnicalOperations();
  }

  removeElementAction = (...arg) => (
    this.context.flux.getActions('objects').deleteMaintenanceRate(this.props.type, ...arg)
  );

  componentDidUpdate(prevProps) {
    const { type } = this.props;

    if (prevProps.type !== type) {
      this.setExportType(type);
      this.context.flux.getActions('objects').getMaintenanceRate(type);
    }
  }
}

export default class MaintenanceRate extends Component {
  state = {
    type: 'odh',
  }

  render() {
    const { type } = this.state;
    return (
      <div>
        <div className="cleaning-rate-header">
          <ButtonGroup>
            <Button active={this.state.type === 'odh'} onClick={() => this.setState({ type: 'odh' })}>ОДХ</Button>
            <Button disabled active={this.state.type === 'dt'} onClick={() => this.setState({ type: 'dt' })}>ДТ</Button>
          </ButtonGroup>
        </div>
        <MaintenanceRateDirectory type={type} />
      </div>
    );
  }
}

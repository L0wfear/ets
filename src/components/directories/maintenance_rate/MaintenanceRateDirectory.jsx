import React, { Component } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps } from 'utils/decorators';
import MaintenanceRateFormWrap from './MaintenanceRateFormWrap.jsx';
import MaintenanceRateTable from './MaintenanceRateTable.jsx';

@connectToStores(['objects'])
// @exportable({ entity: 'cleaning_rate' })
@staticProps({
  entity: 'maintenance_rate',
  listName: 'maintenanceRateList',
  tableComponent: MaintenanceRateTable,
  formComponent: MaintenanceRateFormWrap,
  operations: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
})
class MaintenanceRateDirectory extends ElementsList {

  constructor(props, context) {
    super(props);
    this.removeElementAction = context.flux.getActions('objects').deleteMaintenanceRate.bind(this, props.type);
  }

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('objects').getMaintenanceRate(this.props.type);
    flux.getActions('objects').getMaintenanceWork();
    flux.getActions('objects').getCleanCategories();
    flux.getActions('technicalOperation').getTechnicalOperations();
  }

  inheritedComponentWillReceiveProps(props) {
    if (props.type !== this.props.type) {
      this.context.flux.getActions('objects').getMaintenanceRate(props.type);
      this.removeElementAction = this.context.flux.getActions('objects').deleteMaintenanceRate.bind(this, props.type);
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

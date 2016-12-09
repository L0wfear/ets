import React, { Component } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps } from 'utils/decorators';
import CleaningRateFormWrap from './CleaningRateFormWrap.jsx';
import CleaningRateTable from './CleaningRateTable.jsx';

@connectToStores(['objects'])
// @exportable({ entity: 'cleaning_rate' })
@staticProps({
  entity: 'cleaning_rate',
  listName: 'cleaningRateList',
  tableComponent: CleaningRateTable,
  formComponent: CleaningRateFormWrap,
  operations: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
})
class CleaningRateDirectory extends ElementsList {

  constructor(props, context) {
    super(props);
    this.removeElementAction = context.flux.getActions('objects').deleteCleaningRate.bind(this, props.type);
  }

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('objects').getCleaningRate(this.props.type);
    flux.getActions('technicalOperation').getTechnicalOperations();
    flux.getActions('odh').getMeasureUnits();
  }

  inheritedComponentWillReceiveProps(props) {
    if (props.type !== this.props.type) {
      this.context.flux.getActions('objects').getCleaningRate(props.type);
      this.removeElementAction = this.context.flux.getActions('objects').deleteCleaningRate.bind(this, props.type);
    }
  }
}

export default class CleaningRate extends Component {
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
            <Button active={this.state.type === 'dt'} onClick={() => this.setState({ type: 'dt' })}>ДТ</Button>
          </ButtonGroup>
        </div>
        <CleaningRateDirectory type={type} key={type} />
      </div>
    );
  }
}

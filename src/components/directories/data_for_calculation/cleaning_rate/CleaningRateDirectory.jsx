import React, { Component } from 'react';
import * as Button from 'react-bootstrap/lib/Button';
import * as ButtonGroup from 'react-bootstrap/lib/ButtonGroup';

import ElementsList from 'components/ElementsList';
import { connectToStores, exportable, staticProps } from 'utils/decorators';
import CleaningRateFormWrap from 'components/directories/data_for_calculation/cleaning_rate/CleaningRateFormWrap';
import CleaningRateTable from 'components/directories/data_for_calculation/cleaning_rate/CleaningRateTable';
import permissions from 'components/directories/data_for_calculation/cleaning_rate/config-data/permissions';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { getSessionState } from 'redux-main/reducers/selectors';

@connectToStores(['objects'])
@exportable({ entity: 'cleaning_rate' })
@staticProps({
  entity: 'cleaning_rate',
  permissions,
  listName: 'cleaningRateList',
  tableComponent: CleaningRateTable,
  formComponent: CleaningRateFormWrap,
  operations: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
})
class CleaningRateDirectory extends ElementsList {
  constructor(props, context) {
    super(props);

    this.exportPayload = {
      type: props.type,
    };
    this.removeElementAction = context.flux
      .getActions('objects')
      .deleteCleaningRate.bind(this, props.type);
  }

  init() {
    const { flux } = this.context;
    flux.getActions('objects').getCleaningRate(this.props.type);
    flux.getActions('technicalOperation').getTechnicalOperations();
    flux.getActions('odh').getMeasureUnits();
  }

  removeElementAction = (...arg) =>
    this.context.flux
      .getActions('objects')
      .deleteCleaningRate(this.props.type, ...arg);

  componentDidUpdate(prevProps) {
    const { type } = this.props;

    if (prevProps.type !== type) {
      this.context.flux.getActions('objects').getCleaningRate(type);

      this.exportPayload = {
        type: this.props.type,
      };
    }
  }
}

const CleaningRateDirectoryWithUserData = compose(
  connect((state) => ({
    userData: getSessionState(state).userData,
  })),
)(CleaningRateDirectory);

export default class CleaningRate extends Component {
  state = {
    type: 'odh',
  };

  render() {
    const { type } = this.state;
    return (
      <div>
        <div className="cleaning-rate-header">
          <ButtonGroup>
            <Button
              active={this.state.type === 'odh'}
              onClick={() => this.setState({ type: 'odh' })}>
              ОДХ
            </Button>
            <Button
              active={this.state.type === 'dt'}
              onClick={() => this.setState({ type: 'dt' })}>
              ДТ
            </Button>
          </ButtonGroup>
        </div>
        <CleaningRateDirectoryWithUserData type={type} key={type} />
      </div>
    );
  }
}

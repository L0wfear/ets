import * as React from 'react';

import { hiddeColumns } from 'components/ui/table/utils';
import BatteryRegTable from 'components/directories/autobase/battery_registry/BatteryRegistryTable';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getAutobaseState } from 'redux-main/reducers/selectors';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import { StatePropsBatteryTab, DispatchPropsBatteryTab, OwnPropsBatteryTab, PropsBatteryTab } from './index.h';

const schemaMakers = {
  name_org: hiddeColumns,
  battery__serial_number: hiddeColumns,
  todo_pr_date_install: hiddeColumns,
  car__gov_number: hiddeColumns,
  battery_manufacturer__name: (schema) => ({ ...schema, orderNum: 0 }),
  battery__released_at: (schema) => ({ ...schema, orderNum: 2 }),
  battery_on_car__installed_at: (schema) => ({ ...schema, orderNum: 3 }),
};

class BatteryTab extends React.PureComponent<PropsBatteryTab, {}> {
  componentDidMount() {
    this.loadActualBatteriesOnCar(this.props.car_id);
  }
  componentDidUpdate(prevProps) {
    const { car_id } = this.props;
    if (car_id !== prevProps.car_id) {
      this.loadActualBatteriesOnCar(
        car_id,
      );
    }

  }

  loadActualBatteriesOnCar(car_id) {
    this.props.actualBatteriesOnCarGetAndSetInStore(car_id);
  }

  render() {
    const { actualBatteriesOnCarList } = this.props;

    return (
      <BatteryRegTable
        title="Реестр аккумуляторов"
        results={actualBatteriesOnCarList}
        schemaMakers={schemaMakers}
        initialSort="battery_on_car__installed_at"
        noFilter
      />
    );
  }
}

export default connect<StatePropsBatteryTab, DispatchPropsBatteryTab, OwnPropsBatteryTab, ReduxState>(
  (state) => ({
    actualBatteriesOnCarList: getAutobaseState(state).actualBatteriesOnCarList,
  }),
  (dispatch, { page, path }) => ({
    actualBatteriesOnCarGetAndSetInStore: (car_id: number) => (
      dispatch(
        autobaseActions.actualBatteriesOnCarGetAndSetInStore(
          { car_id },
          { page, path },
        ),
      )
    ),
  }),
)(BatteryTab);

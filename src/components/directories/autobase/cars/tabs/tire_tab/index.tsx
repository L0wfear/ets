import * as React from 'react';

import { hiddeColumns } from 'components/ui/table/utils';
import TireTable from 'components/directories/autobase/tire/TireTable';

import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getAutobaseState } from 'redux-main/reducers/selectors';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import { StatePropsTireTab, DispatchPropsTireTab, OwnPropsTireTab, PropsTireTab } from './index.h';

const schemaMakers = {
  gov_number: hiddeColumns,
  company_id: hiddeColumns,
  comment: hiddeColumns,
  company_name: hiddeColumns,
  cloneButton: hiddeColumns,
  tire_size_id: (schema) => ({ ...schema, name: 'tire_size_name', displayName: 'Размер шины' }),
  tire_model_id: (schema) => ({ ...schema, name: 'tire_model_name' }),
  installed_at: (schema) => ({ ...schema, orderNum: 1 }),
};

class TireTab extends React.PureComponent<PropsTireTab, {}> {
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
    this.props.actualTiresOnCarGetAndSetInStore(car_id);
  }

  render() {
    const { actualTiresOnCarList } = this.props;

    return (
      <TireTable
        title="Реестр шин"
        results={actualTiresOnCarList}
        schemaMakers={schemaMakers}
        initialSort="installed_at"
        noFilter
      />
    );
  }
}

export default connect<StatePropsTireTab, DispatchPropsTireTab, OwnPropsTireTab, ReduxState>(
  (state) => ({
    actualTiresOnCarList: getAutobaseState(state).actualTiresOnCarList,
  }),
  (dispatch, { page, path }) => ({
    actualTiresOnCarGetAndSetInStore: (car_id: number) => (
      dispatch(
        autobaseActions.actualTiresOnCarGetAndSetInStore(
          { car_id },
          { page, path },
        ),
      )
    ),
  }),
)(TireTab);

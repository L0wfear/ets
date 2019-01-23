import FuelRateFormWrap from 'components/directories/normative/fuel_rates/FuelRateFormWrap';
import FuelRatesTable from 'components/directories/normative/fuel_rates/FuelRatesTable';
import ElementsList from 'components/ElementsList';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import { fuelRateSchema } from 'components/directories/normative/fuel_rates/fuelRateSchema';
import permissions from 'components/directories/normative/fuel_rates/config-data/permissions';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { getSessionState } from 'redux-main/reducers/selectors';

@connectToStores(['odh', 'fuelRates', 'objects'])
@exportable({ entity: 'fuel_consumption_rates' })
@staticProps({
  entity: 'fuel_consumption_rate',
  permissions,
  listName: 'rates',
  schema: fuelRateSchema,
  tableComponent: FuelRatesTable,
  formComponent: FuelRateFormWrap,
  operations: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
})
class FuelRatesDirectory extends ElementsList {
  constructor(props, context) {
    super(props);
    this.removeElementAction = context.flux.getActions('fuelRates').deleteFuelRate;
  }

  init() {
    const { flux } = this.context;
    flux.getActions('fuelRates').getFuelOperations();
    flux.getActions('fuelRates').getFuelRates();
    flux.getActions('odh').getMeasureUnits({ type: 'operation' });
  }
}

export default compose(
  connect(
    state => ({
      userData: getSessionState(state).userData,
    }),
  ),
)(FuelRatesDirectory);

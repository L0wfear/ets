import FuelRateFormWrap from 'components/directories/normative/fuel_rates/FuelRateForm/FuelRateFormWrap.tsx';
import FuelRatesTable from 'components/directories/normative/fuel_rates/FuelRatesTable';
import ElementsList from 'components/ElementsList';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import { fuelRateSchema } from 'components/directories/normative/fuel_rates/FuelRateForm/fuelRateSchema';
import permissions from 'components/directories/normative/fuel_rates/config-data/permissions';

import { connect } from 'react-redux';
import {
  FuelRatesGet,
  FuelRateDelete,
} from 'redux-main/reducers/modules/fuel_rates/actions-fuelRates';
import {
  FUEL_RATES_SET_DATA,
} from 'redux-main/reducers/modules/fuel_rates/fuelRates';
import { compose } from 'recompose';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

const loadingPageName = 'fuel-rates';

@connectToStores(['odh', 'fuelRates', 'objects', 'session'])
@exportable({ entity: 'fuel_consumption_rates' })
@staticProps({
  entity: 'fuel_consumption_rate',
  permissions,
  listName: 'fuelRatesList',
  schema: fuelRateSchema,
  tableComponent: FuelRatesTable,
  formComponent: FuelRateFormWrap,
  operations: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
})
class FuelRatesDirectory extends ElementsList {
  constructor(props) {
    super(props);
    this.removeElementAction = this.props.FuelRateDelete;
  }

  init() {
    const { flux } = this.context; // del
    try {
      this.props.FuelOperationsGet();
      this.props.FuelRatesGet();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
    flux.getActions('fuelRates').getFuelOperations(); // переделать
    flux.getActions('odh').getMeasureUnits({ type: 'operation' });
  }
}

export default compose(
  withPreloader({
    page: loadingPageName,
    typePreloader: 'mainpage',
  }),
  connect(
    state => ({
      fuelRatesList: state.fuelRates.fuelRatesList,
      fuelRateOperations: state.fuelRates.fuelRateOperations,
    }),
    dispatch => ({
      FuelOperationsGet: () => (
        dispatch(
          FuelOperationsGet(FUEL_RATES_SET_DATA),
        )
      ),
      FuelRatesGet: () => (
        dispatch(
          FuelRatesGet(FUEL_RATES_SET_DATA),
        )
      ),
      FuelRateDelete: id => (
        dispatch(
          FuelRateDelete(FUEL_RATES_SET_DATA, id),
        )
      ),
    }),
  ),
)(FuelRatesDirectory);

import FuelRateFormWrap from 'components/directories/normative/fuel_rates/FuelRateForm/FuelRateFormWrap.tsx';
import FuelRatesTable from 'components/directories/normative/fuel_rates/FuelRatesTable';
import ElementsList from 'components/ElementsList';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import { fuelRateSchema } from 'components/directories/normative/fuel_rates/FuelRateForm/fuelRateSchema';
import permissions from 'components/directories/normative/fuel_rates/config-data/permissions';

import { connect } from 'react-redux';
import {
  fuelRatesGetAndSetInStore,
  fuelRateDelete,
} from 'redux-main/reducers/modules/fuel_rates/actions-fuelRates';

import { compose } from 'recompose';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import {
  getSessionState,
  getFuelRatesState,
} from 'redux-main/reducers/selectors';

const loadingPageName = 'fuel-rates';

@connectToStores(['odh', 'objects'])
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

  removeElementAction = async (id) => {
    try {
      await this.props.fuelRateDelete(id);
      this.init();
    } catch (e) {
      //
    }
  }

  init() {
    const { flux } = this.context;

    this.props.fuelRatesGetAndSetInStore();

    flux.getActions('odh').getMeasureUnits({ type: 'operation' });
  }

  onFormHide = (isSubmitted) => {
    const changeState = {
      showForm: false,
    };

    if (isSubmitted) {
      this.init();
      changeState.selectedElement = null;
    }

    this.setState(changeState);
  }
}

export default compose(
  withPreloader({
    page: loadingPageName,
    typePreloader: 'mainpage',
  }),
  connect(
    state => ({
      fuelRatesList: getFuelRatesState(state).fuelRatesList,
      userData: getSessionState(state).userData,
    }),
    dispatch => ({
      fuelRatesGetAndSetInStore: () => (
        dispatch(
          fuelRatesGetAndSetInStore(
            {},
            {
              page: loadingPageName,
            },
          ),
        )
      ),
      fuelRateDelete: id => (
        dispatch(
          fuelRateDelete(id),
        )
      ),
    }),
  ),
)(FuelRatesDirectory);

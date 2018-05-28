import FuelRateFormWrap from 'components/directories/normative/fuel_rates/FuelRateFormWrap.jsx';
import FuelRatesTable from 'components/directories/normative/fuel_rates/FuelRatesTable.tsx';
import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import { fuelRateSchema } from 'components/directories/normative/fuel_rates/fuelRateSchema.js';
import permissions from 'components/directories/normative/fuel_rates/config-data/permissions';

@connectToStores(['fuelRates', 'objects', 'session', 'companyStructure'])
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
export default class FuelRatesDirectory extends ElementsList {

  constructor(props, context) {
    super(props);
    this.removeElementAction = context.flux.getActions('fuelRates').deleteFuelRate;
  }

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('fuelRates').getFuelOperations();
    flux.getActions('fuelRates').getFuelRates();
    flux.getActions('companyStructure').getCompanyStructure();
  }
}

import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList';
import BatteryManufacturerFormWrap from 'components/directories/autobase/battery_manufacturer/BatteryManufacturerForm/BatteryManufacturerFormWrap';
import BatteryManufacturerTable from 'components/directories/autobase/battery_manufacturer/BatteryManufacturerTable';
import permissions from 'components/directories/autobase/battery_manufacturer/config-data/permissions';
import { connect } from 'react-redux';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import { compose } from 'recompose';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

const loadingPageName = 'battery-manufacturer';

@connectToStores(['autobase', 'session'])
@exportable({ entity: `autobase/${AUTOBASE.batteryManufacturer}` })
@staticProps({
  entity: 'autobase_battery_manufacturer',
  permissions,
  listName: 'batteryManufacturerList',
  tableComponent: BatteryManufacturerTable,
  formComponent: BatteryManufacturerFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
class BatteryManufacturerList extends ElementsList {
  removeElementAction = async (id) => {
    try {
      await this.props.autobaseRemoveBatteryBrand(id);
      this.init();
    } catch (e) {
      //
    }
  }

  init() {
    this.props.batteryBrandGetAndSetInStore();
  }

  componentWillUnmount() {
    this.props.autobaseResetSetBatteryBrand();
  }

  onFormHide = (isSubmited) => {
    if (isSubmited) {
      this.init();
    }

    this.setState({
      showForm: false,
      selectedElement: null,
    });
  }

  getAdditionalProps() {
    return {
      loadingPageName,
    };
  }
}

export default compose(
  withPreloader({
    page: loadingPageName,
    typePreloader: 'mainpage',
  }),
  connect(
    state => ({
      batteryManufacturerList: state.autobase.batteryManufacturerList,
    }),
    dispatch => ({
      batteryBrandGetAndSetInStore: () => (
        dispatch(
          autobaseActions.batteryManufacturerGetAndSetInStore(
            {},
            {
              page: loadingPageName,
            },
          ),
        )
      ),
      autobaseResetSetBatteryBrand: () => (
        dispatch(
          autobaseActions.autobaseResetSetBatteryManufacturer(),
        )
      ),
      autobaseRemoveBatteryBrand: id => (
        dispatch(
          autobaseActions.autobaseRemoveBatteryManufacturer(
            id,
            {
              page: loadingPageName,
            },
          ),
        )
      ),
    }),
  ),
)(BatteryManufacturerList);

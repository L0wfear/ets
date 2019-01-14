import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList';
import BatteryBrandFormWrap from 'components/directories/autobase/battery_brand/BatteryBrandForm/BatteryBrandFormWrap';
import BatteryBrandTable from 'components/directories/autobase/battery_brand/BatteryBrandTable';
import permissions from 'components/directories/autobase/battery_brand/config-data/permissions';
import { connect } from 'react-redux';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import { compose } from 'recompose';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import { getAutobaseState } from 'redux-main/reducers/selectors';

const loadingPageName = 'battery-brand';

@connectToStores(['session'])
@exportable({ entity: `autobase/${AUTOBASE.batteryBrand}` })
@staticProps({
  entity: 'autobase_battery_brand',
  permissions,
  listName: 'batteryBrandList',
  tableComponent: BatteryBrandTable,
  formComponent: BatteryBrandFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
class BatteryBrandList extends ElementsList {
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
    const changeState = {
      showForm: false,
    };

    if (isSubmited) {
      this.init();
      changeState.selectedElement = null;
    }

    this.setState(changeState);
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
      batteryBrandList: getAutobaseState(state).batteryBrandList,
    }),
    dispatch => ({
      batteryBrandGetAndSetInStore: () => (
        dispatch(
          autobaseActions.batteryBrandGetAndSetInStore(
            {},
            {
              page: loadingPageName,
            },
          ),
        )
      ),
      autobaseResetSetBatteryBrand: () => (
        dispatch(
          autobaseActions.autobaseResetSetBatteryBrand(),
        )
      ),
      autobaseRemoveBatteryBrand: id => (
        dispatch(
          autobaseActions.autobaseRemoveBatteryBrand(
            id,
            {
              page: loadingPageName,
            },
          ),
        )
      ),
    }),
  ),
)(BatteryBrandList);

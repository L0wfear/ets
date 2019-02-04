import { staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'redux-main/reducers/modules/autobase/constants';
import ElementsList from 'components/ElementsList';
import BatteryManufacturerFormWrap from 'components/directories/autobase/battery_manufacturer/BatteryManufacturerForm/BatteryManufacturerFormWrap';
import BatteryManufacturerTable from 'components/directories/autobase/battery_manufacturer/BatteryManufacturerTable';
import permissions from 'components/directories/autobase/battery_manufacturer/config-data/permissions';
import { connect } from 'react-redux';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import { compose } from 'recompose';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import { getAutobaseState, getSessionState } from 'redux-main/reducers/selectors';

const loadingPageName = 'battery-manufacturer';

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
      await this.props.autobaseRemoveBatteryManufacturer(id);
      this.init();
    } catch (e) {
      //
    }
  }

  init() {
    this.props.batteryManufacturerGetAndSetInStore();
  }

  componentWillUnmount() {
    this.props.autobaseResetSetBatteryManufacturer();
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

  getAdditionalFormProps() {
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
      batteryManufacturerList: getAutobaseState(state).batteryManufacturerList,
      userData: getSessionState(state).userData,
    }),
    dispatch => ({
      batteryManufacturerGetAndSetInStore: () => (
        dispatch(
          autobaseActions.batteryManufacturerGetAndSetInStore(
            {},
            {
              page: loadingPageName,
            },
          ),
        )
      ),
      autobaseResetSetBatteryManufacturer: () => (
        dispatch(
          autobaseActions.autobaseResetSetBatteryManufacturer(),
        )
      ),
      autobaseRemoveBatteryManufacturer: id => (
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

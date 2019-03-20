import { staticProps, exportable } from 'utils/decorators';

import AUTOBASE from 'redux-main/reducers/modules/autobase/constants';
import ElementsList from 'components/ElementsList';
import BatteryRegistryFormWrap from 'components/directories/autobase/battery_registry/BatteryRegistryForm/BatteryRegistryFormWrap';
import BatteryRegistryTable from 'components/directories/autobase/battery_registry/BatteryRegistryTable';
import permissions from 'components/directories/autobase/battery_registry/config-data/permissions';
import { connect } from 'react-redux';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import { compose } from 'recompose';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import {
  getAutobaseState,
  getSessionState,
} from 'redux-main/reducers/selectors';

const loadingPageName = 'battery-registry';

@exportable({ entity: `autobase/${AUTOBASE.batteryRegistry}` })
@staticProps({
  entity: 'autobase_battery',
  permissions,
  listName: 'batteryRegistryList',
  tableComponent: BatteryRegistryTable,
  formComponent: BatteryRegistryFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
class BatteryRegList extends ElementsList {
  removeElementAction = async (id) => {
    try {
      await this.props.autobaseRemoveBatteryRegistry(id);
      this.init();
    } catch (e) {
      //
    }
  };

  init() {
    this.props.batteryRegistryGetAndSetInStore();
  }

  componentWillUnmount() {
    this.props.autobaseResetSetBatteryRegistry();
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
  };

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
    (state) => ({
      batteryRegistryList: getAutobaseState(state).batteryRegistryList,
      userData: getSessionState(state).userData,
    }),
    (dispatch) => ({
      batteryRegistryGetAndSetInStore: () =>
        dispatch(
          autobaseActions.batteryRegistryGetAndSetInStore(
            {},
            {
              page: loadingPageName,
            },
          ),
        ),
      autobaseResetSetBatteryRegistry: () =>
        dispatch(autobaseActions.autobaseResetSetBatteryRegistry()),
      autobaseRemoveBatteryRegistry: (id) =>
        dispatch(
          autobaseActions.autobaseRemoveBatteryRegistry(id, {
            page: loadingPageName,
          }),
        ),
    }),
  ),
)(BatteryRegList);

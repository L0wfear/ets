import { staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'redux-main/reducers/modules/autobase/constants';
import ElementsList from 'components/ElementsList';
import TechMaintOrderFormWrap from 'components/directories/autobase/tech_maintenance_order_registry/TechMaintOrderForm/TechMaintOrderFormWrap';
import TechMaintOrderTable from 'components/directories/autobase/tech_maintenance_order_registry/TechMaintOrderTable';
import permissions from 'components/directories/autobase/tech_maintenance_order_registry/config-data/permissions';
import { connect } from 'react-redux';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import { compose } from 'recompose';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import {
  getAutobaseState,
  getSessionState,
} from 'redux-main/reducers/selectors';

const loadingPageName = 'tech_maintenance_order';

@exportable({ entity: `autobase/${AUTOBASE.techMaintOrder}` })
@staticProps({
  entity: 'autobase_tech_maintenance_order',
  permissions,
  listName: 'techMaintOrderList',
  tableComponent: TechMaintOrderTable,
  formComponent: TechMaintOrderFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
class TechMaintOrderList extends ElementsList {
  removeElementAction = async (id) => {
    try {
      await this.props.autobaseRemoveTechMaintOrder(id);
      this.loadMainData();
    } catch (e) {
      //
    }
  };

  init() {
    const { car_id } = this.props;

    this.loadMainData();

    if (car_id) {
      this.exportPayload = { car_id };
    }
  }

  loadMainData() {
    const { car_id } = this.props;

    if (!car_id) {
      this.props.techMaintOrderGetAndSetInStore();
    } else {
      this.props.techMaintOrderGetAndSetInStore({ car_id });
    }
  }

  componentWillUnmount() {
    this.props.autobaseResetSetTechMaintOrder();
  }

  createElement = () => {
    const { car_id = null } = this.props;

    this.setState({
      showForm: true,
      selectedElement: {
        car_id,
      },
    });
  };

  onFormHide = (isSubmitted) => {
    const changeState = {
      showForm: false,
    };

    if (isSubmitted) {
      this.loadMainData();
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
      techMaintOrderList: getAutobaseState(state).techMaintOrderList,
      userData: getSessionState(state).userData,
    }),
    (dispatch) => ({
      carGetAndSetInStore: () =>
        dispatch(autobaseActions.carGetAndSetInStore()),
      techMaintOrderGetAndSetInStore: (payload = {}) =>
        dispatch(
          autobaseActions.techMaintOrderGetAndSetInStore(payload, {
            page: loadingPageName,
          }),
        ),
      autobaseResetSetTechMaintOrder: () =>
        dispatch(autobaseActions.autobaseResetSetTechMaintOrder()),
      autobaseRemoveTechMaintOrder: (id) =>
        dispatch(
          autobaseActions.autobaseRemoveTechMaintOrder(id, {
            page: loadingPageName,
          }),
        ),
    }),
  ),
)(TechMaintOrderList);

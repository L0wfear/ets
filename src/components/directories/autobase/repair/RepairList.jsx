import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'redux-main/reducers/modules/autobase/constants';
import ElementsList from 'components/ElementsList';
import RepairFormWrap from 'components/directories/autobase/repair/RepairForm/RepairFormWrap';
import RepairTable, { tableMeta } from 'components/directories/autobase/repair/RepairTable';
import permissions from 'components/directories/autobase/repair/config-data/permissions';
import { connect } from 'react-redux';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import { compose } from 'recompose';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import { getAutobaseState } from 'redux-main/reducers/selectors';

const loadingPageName = 'repair';

@connectToStores(['session'])
@exportable({ entity: `autobase/${AUTOBASE.repair}` })
@staticProps({
  entity: 'autobase_repair',
  permissions,
  listName: 'repairList',
  tableComponent: RepairTable,
  formComponent: RepairFormWrap,
  formMeta: tableMeta(),
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
class RepareList extends ElementsList {
  removeElementAction = async (id) => {
    try {
      await this.props.autobaseRemoveRepair(id);
      this.loadMainData();
    } catch (e) {
      //
    }
  }

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
      this.props.repairGetAndSetInStore();
    } else {
      this.props.repairGetAndSetInStore({ car_id });
    }
  }

  componentWillUnmount() {
    this.props.autobaseResetSetRepair();
  }

  createElement = () => {
    const { car_id = null } = this.props;

    this.setState({
      showForm: true,
      selectedElement: {
        car_id,
      },
    });
  }

  onFormHide = (isSubmited) => {
    const changeState = {
      showForm: false,
    };

    if (isSubmited) {
      this.loadMainData();
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
      repairList: getAutobaseState(state).repairList,
    }),
    dispatch => ({
      carGetAndSetInStore: () => (
        dispatch(
          autobaseActions.carGetAndSetInStore(),
        )
      ),
      repairGetAndSetInStore: (payload = {}) => (
        dispatch(
          autobaseActions.repairGetAndSetInStore(
            payload,
            {
              page: loadingPageName,
            },
          ),
        )
      ),
      autobaseResetSetRepair: () => (
        dispatch(
          autobaseActions.autobaseResetSetRepair(),
        )
      ),
      autobaseRemoveRepair: id => (
        dispatch(
          autobaseActions.autobaseRemoveRepair(
            id,
            {
              page: loadingPageName,
            },
          ),
        )
      ),
    }),
  ),
)(RepareList);

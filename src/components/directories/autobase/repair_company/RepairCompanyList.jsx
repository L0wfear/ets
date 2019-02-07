import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'redux-main/reducers/modules/autobase/constants';
import ElementsList from 'components/ElementsList';
import RepairCompanyTable from 'components/directories/autobase/repair_company/RepairCompanyTable';
import RepairCompanyFormWrap from 'components/directories/autobase/repair_company/RepairCompanyForm/RepairCompanyFormWrap';
import permissions from 'components/directories/autobase/repair_company/config-data/permissions';
import { connect } from 'react-redux';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import { compose } from 'recompose';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import { getAutobaseState } from 'redux-main/reducers/selectors';

const loadingPageName = 'repair-company';

@connectToStores(['session'])
@exportable({ entity: `autobase/${AUTOBASE.repairCompany}` })
@staticProps({
  entity: 'autobase_company',
  permissions,
  listName: 'repairCompanyList',
  formComponent: RepairCompanyFormWrap,
  tableComponent: RepairCompanyTable,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
class RepairCompanyList extends ElementsList {
  removeElementAction = async (id) => {
    try {
      await this.props.autobaseRemoveRepairCompany(id);
      this.init();
    } catch (e) {
      //
    }
  }

  init() {
    this.props.repairCompanyGetAndSetInStore();
  }

  componentWillUnmount() {
    this.props.autobaseResetSetRepairCompany();
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
      repairCompanyList: getAutobaseState(state).repairCompanyList,
    }),
    dispatch => ({
      repairCompanyGetAndSetInStore: () => (
        dispatch(
          autobaseActions.repairCompanyGetAndSetInStore(
            {},
            {
              page: loadingPageName,
            },
          ),
        )
      ),
      autobaseResetSetRepairCompany: () => (
        dispatch(
          autobaseActions.autobaseResetSetRepairCompany(),
        )
      ),
      autobaseRemoveRepairCompany: id => (
        dispatch(
          autobaseActions.autobaseRemoveRepairCompany(
            id,
            {
              page: loadingPageName,
            },
          ),
        )
      ),
    }),
  ),
)(RepairCompanyList);

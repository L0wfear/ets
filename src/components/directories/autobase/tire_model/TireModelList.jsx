import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'redux-main/reducers/modules/autobase/constants';
import ElementsList from 'components/ElementsList';
import TireModelFormWrap from 'components/directories/autobase/tire_model/TireModelForm/TireModelFormWrap';
import TireModelTable from 'components/directories/autobase/tire_model/TireModelTable';
import permissions from 'components/directories/autobase/tire_model/config-data/permissions';

import { connect } from 'react-redux';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import { compose } from 'recompose';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import { getAutobaseState, getSessionState } from 'redux-main/reducers/selectors';

const loadingPageName = 'tire-model';

@connectToStores(['session'])
@exportable({ entity: `autobase/${AUTOBASE.tireModel}` })
@staticProps({
  entity: 'autobase_tire_model',
  listName: 'tireModelList',
  permissions,
  tableComponent: TireModelTable,
  formComponent: TireModelFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
class TireBrandList extends ElementsList {
  removeElementAction = async (id) => {
    try {
      await this.props.autobaseRemoveTireModel(id);
      this.init();
    } catch (e) {
      //
    }
  }

  init() {
    this.props.tireModelGetAndSetInStore();
  }

  componentWillUnmount() {
    this.props.autobaseResetSetTireModel();
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
      tireModelList: getAutobaseState(state).tireModelList,
      userData: getSessionState(state).userData,
    }),
    dispatch => ({
      tireModelGetAndSetInStore: () => (
        dispatch(
          autobaseActions.tireModelGetAndSetInStore(
            {},
            {
              page: loadingPageName,
            },
          ),
        )
      ),
      autobaseResetSetTireModel: () => (
        dispatch(
          autobaseActions.autobaseResetSetTireModel(),
        )
      ),
      autobaseRemoveTireModel: id => (
        dispatch(
          autobaseActions.autobaseRemoveTireModel(
            id,
            {
              page: loadingPageName,
            },
          ),
        )
      ),
    }),
  ),
)(TireBrandList);

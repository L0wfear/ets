import { staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'redux-main/reducers/modules/autobase/constants';
import ElementsList from 'components/ElementsList';
import TireFormWrap from 'components/directories/autobase/tire/TireForm/TireFormWrap';
import TireTable from 'components/directories/autobase/tire/TireTable';
import permissions from 'components/directories/autobase/tire/config-data/permissions';
import { connect } from 'react-redux';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import { compose } from 'recompose';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import { getAutobaseState, getSessionState } from 'redux-main/reducers/selectors';

const loadingPageName = 'tire';


@exportable({ entity: `autobase/${AUTOBASE.tire}` })
@staticProps({
  entity: 'autobase_tire',
  permissions,
  listName: 'tireList',
  tableComponent: TireTable,
  formComponent: TireFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
class TireList extends ElementsList {
  removeElementAction = async (id) => {
    try {
      await this.props.autobaseRemoveTire(id);
      this.init();
    } catch (e) {
      //
    }
  }

  init() {
    this.props.tireGetAndSetInStore();
  }

  componentWillUnmount() {
    this.props.autobaseResetSetTire();
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

  handleClickClone = async (id) => {
    try {
      await this.props.autobaseCloneTire(id);
      this.init();
    } catch (e) {
      console.warn(e); //eslint-disable-line
    }
  }

  getAdditionalProps() {
    return {
      loadingPageName,
      onCloneClick: this.handleClickClone,
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
      tireList: getAutobaseState(state).tireList,
      userData: getSessionState(state).userData,
    }),
    dispatch => ({
      tireGetAndSetInStore: () => (
        dispatch(
          autobaseActions.tireGetAndSetInStore(
            {},
            {
              page: loadingPageName,
            },
          ),
        )
      ),
      autobaseResetSetTire: () => (
        dispatch(
          autobaseActions.autobaseResetSetTire(),
        )
      ),
      autobaseCloneTire: tireId => (
        dispatch(
          autobaseActions.autobaseCloneTire(
            tireId,
            {
              page: loadingPageName,
            },
          ),
        )
      ),
      autobaseRemoveTire: id => (
        dispatch(
          autobaseActions.autobaseRemoveTire(
            id,
            {
              page: loadingPageName,
            },
          ),
        )
      ),
    }),
  ),
)(TireList);

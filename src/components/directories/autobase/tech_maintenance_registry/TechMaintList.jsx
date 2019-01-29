import { staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'redux-main/reducers/modules/autobase/constants';
import ElementsList from 'components/ElementsList';
import TechMaintFormWrap from 'components/directories/autobase/tech_maintenance_registry/TechMaintForm/TechMaintFormWrap';
import TechMaintTable from 'components/directories/autobase/tech_maintenance_registry/TechMaintTable';
import permissions from 'components/directories/autobase/tech_maintenance_registry/config-data/permissions';
import { connect } from 'react-redux';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import { compose } from 'recompose';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import { getAutobaseState, getSessionState } from 'redux-main/reducers/selectors';

const loadingPageName = 'tech_maint';


@exportable({ entity: `autobase/${AUTOBASE.techMaint}` })
@staticProps({
  entity: 'autobase_tech_maintenance',
  permissions,
  listName: 'techMaintList',
  tableComponent: TechMaintTable,
  formComponent: TechMaintFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
class TechMaintList extends ElementsList {
  removeElementAction = async (id) => {
    try {
      await this.props.autobaseRemoveTechMaint(id);
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
      this.props.techMaintGetAndSetInStore();
    } else {
      this.props.techMaintGetAndSetInStore({ car_id });
    }
  }

  componentWillUnmount() {
    this.props.autobaseResetSetTechMaint();
  }

  createElement = () => {
    const {
      car_id = null,
      car_model_id,
      gov_number,
    } = this.props;

    this.setState({
      showForm: true,
      selectedElement: {
        car_id,
        car_model_id,
        gov_number,
      },
    });
  }

  onFormHide = (isSubmitted) => {
    const changeState = {
      showForm: false,
    };

    if (isSubmitted) {
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
      techMaintList: getAutobaseState(state).techMaintList,
      userData: getSessionState(state).userData,
    }),
    dispatch => ({
      carGetAndSetInStore: () => (
        dispatch(
          autobaseActions.carGetAndSetInStore(),
        )
      ),
      techMaintGetAndSetInStore: (payload = {}) => (
        dispatch(
          autobaseActions.techMaintGetAndSetInStore(
            payload,
            {
              page: loadingPageName,
            },
          ),
        )
      ),
      autobaseResetSetTechMaint: () => (
        dispatch(
          autobaseActions.autobaseResetSetTechMaint(),
        )
      ),
      autobaseRemoveTechMaint: id => (
        dispatch(
          autobaseActions.autobaseRemoveTechMaint(
            id,
            {
              page: loadingPageName,
            },
          ),
        )
      ),
    }),
  ),
)(TechMaintList);

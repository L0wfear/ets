import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'redux-main/reducers/modules/autobase/constants';
import ElementsList from 'components/ElementsList';
import TechInspectionFormWrap from 'components/directories/autobase/tech_inspection/TechInspectionForm/TechInspectionFormWrap';
import TechInspectionTable, { tableMeta } from 'components/directories/autobase/tech_inspection/TechInspectionTable';
import permissions from 'components/directories/autobase/tech_inspection/config-data/permissions';
import { connect } from 'react-redux';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import { compose } from 'recompose';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import { getAutobaseState } from 'redux-main/reducers/selectors';

const loadingPageName = 'tech_inspection';

@connectToStores(['session'])
@exportable({ entity: `autobase/${AUTOBASE.techInspection}` })
@staticProps({
  entity: 'autobase_tech_inspection',
  permissions,
  listName: 'techInspectionList',
  tableComponent: TechInspectionTable,
  formComponent: TechInspectionFormWrap,
  formMeta: tableMeta(),
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
class TechInspectionList extends ElementsList {
  removeElementAction = async (id) => {
    try {
      await this.props.autobaseRemoveTechInspection(id);
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
      this.props.techInspectionGetAndSetInStore();
    } else {
      this.props.techInspectionGetAndSetInStore({ car_id });
    }
  }

  componentWillUnmount() {
    this.props.autobaseResetSetTechInspection();
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
      techInspectionList: getAutobaseState(state).techInspectionList,
    }),
    dispatch => ({
      carGetAndSetInStore: () => (
        dispatch(
          autobaseActions.carGetAndSetInStore(),
        )
      ),
      techInspectionGetAndSetInStore: (payload = {}) => (
        dispatch(
          autobaseActions.techInspectionGetAndSetInStore(
            payload,
            {
              page: loadingPageName,
            },
          ),
        )
      ),
      autobaseResetSetTechInspection: () => (
        dispatch(
          autobaseActions.autobaseResetSetTechInspection(),
        )
      ),
      autobaseRemoveTechInspection: id => (
        dispatch(
          autobaseActions.autobaseRemoveTechInspection(
            id,
            {
              page: loadingPageName,
            },
          ),
        )
      ),
    }),
  ),
)(TechInspectionList);

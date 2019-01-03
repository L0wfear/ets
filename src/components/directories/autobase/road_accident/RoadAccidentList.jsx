import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'redux-main/reducers/modules/autobase/constants';
import ElementsList from 'components/ElementsList';
import RoadAccidentFormWrap from 'components/directories/autobase/road_accident/RoadAccidentForm/RoadAccidentFormWrap';
import RoadAccidentTable from 'components/directories/autobase/road_accident/RoadAccidentTable';
import permissions from 'components/directories/autobase/road_accident/config-data/permissions';
import { connect } from 'react-redux';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import { compose } from 'recompose';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import { getAutobaseState } from 'redux-main/reducers/selectors';

const loadingPageName = 'road-accident';

@connectToStores(['session'])
@exportable({ entity: `autobase/${AUTOBASE.roadAccidentRegistry}` })
@staticProps({
  entity: 'autobase_road_accident',
  permissions,
  listName: 'roadAccidentList',
  tableComponent: RoadAccidentTable,
  formComponent: RoadAccidentFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
class RoadAccidentList extends ElementsList {
  removeElementAction = async (id) => {
    try {
      await this.props.autobaseRemoveRoadAccident(id);
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
      this.props.roadAccidentGetAndSetInStore();
    } else {
      this.props.roadAccidentGetAndSetInStore({ car_id });
    }
  }

  componentWillUnmount() {
    this.props.autobaseResetSetRoadAccident();
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
      roadAccidentList: getAutobaseState(state).roadAccidentList,
    }),
    dispatch => ({
      carGetAndSetInStore: () => (
        dispatch(
          autobaseActions.carGetAndSetInStore(),
        )
      ),
      roadAccidentGetAndSetInStore: (payload = {}) => (
        dispatch(
          autobaseActions.roadAccidentGetAndSetInStore(
            payload,
            {
              page: loadingPageName,
            },
          ),
        )
      ),
      autobaseResetSetRoadAccident: () => (
        dispatch(
          autobaseActions.autobaseResetSetRoadAccident(),
        )
      ),
      autobaseRemoveRoadAccident: id => (
        dispatch(
          autobaseActions.autobaseRemoveRoadAccident(
            id,
            {
              page: loadingPageName,
            },
          ),
        )
      ),
    }),
  ),
)(RoadAccidentList);

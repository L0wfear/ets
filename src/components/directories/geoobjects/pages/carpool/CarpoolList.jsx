import { get } from 'lodash';
import CarpoolTable, { tableMeta } from 'components/directories/geoobjects/pages/carpool/CarpoolTable';
import ElementsList from 'components/ElementsList';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import CarpoolFormWrap from 'components/directories/geoobjects/pages/carpool/form/CarpoolFormWrap';
import permissions from 'components/directories/geoobjects/pages/carpool/config-data/permissions';
import { connect } from 'react-redux';
import { getGeoobjectState } from 'redux-main/reducers/selectors';
import geoobjectActions from 'redux-main/reducers/modules/geoobject/actions';

const loadingPageName = 'company-structure';

@connectToStores(['session'])
@exportable({ path: 'geozones', entity: 'carpool' })
@staticProps({
  path: 'geozones',
  entity: 'carpool',
  permissions,
  listName: 'carpoolList',
  tableComponent: CarpoolTable,
  formComponent: CarpoolFormWrap,
  formMeta: tableMeta(),
  operations: ['READ'],
})
class CarpoolList extends ElementsList {
  init() {
    return this.props.getCarpool();
  }

  onFormHide = async (isSubmited) => {
    if (isSubmited) {
      this.init();
    } else {
      this.setState({
        showForm: false,
        selectedElement: null,
      });
    }
  }

  getAdditionalFormProps() {
    return {
      loadingPageName,
      refreshList: this.init,
    };
  }
}

export default connect(
  state => ({
    carpoolList: getGeoobjectState(state).carpoolList,
  }),
  dispatch => ({
    getCarpool: () => (
      dispatch(
        geoobjectActions.actionGetAndSetInStoreCarpool(
          {},
          { page: loadingPageName },
        ),
      )
    ),
  }),
)(CarpoolList);

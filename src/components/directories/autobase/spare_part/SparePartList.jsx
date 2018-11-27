import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList';
import SparePartTable from 'components/directories/autobase/spare_part/SparePartTable';
import SparePartFormWrap from 'components/directories/autobase/spare_part/SparePartForm/SparePartFormWrap';
import permissions from 'components/directories/autobase/spare_part/config-data/permissions';
import { connect } from 'react-redux';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import { compose } from 'recompose';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

const loadingPageName = 'spare-part';

@connectToStores(['session'])
@exportable({ entity: `autobase/${AUTOBASE.sparePart}` })
@staticProps({
  entity: 'autobase_spare_part',
  permissions,
  listName: 'sparePartList',
  formComponent: SparePartFormWrap,
  tableComponent: SparePartTable,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
class SparePartList extends ElementsList {
  removeElementAction = async (id) => {
    try {
      await this.props.autobaseRemoveSparePart(id);
      this.init();
    } catch (e) {
      //
    }
  }

  init() {
    this.props.sparePartGetAndSetInStore();
  }

  componentWillUnmount() {
    this.props.autobaseResetSetSparePart();
  }

  onFormHide = (isSubmited) => {
    if (isSubmited) {
      this.init();
    }

    this.setState({
      showForm: false,
      selectedElement: null,
    });
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
      sparePartList: state.autobase.sparePartList,
    }),
    dispatch => ({
      sparePartGetAndSetInStore: () => (
        dispatch(
          autobaseActions.sparePartGetAndSetInStore(
            {},
            {
              page: loadingPageName,
            },
          ),
        )
      ),
      autobaseResetSetSparePart: () => (
        dispatch(
          autobaseActions.autobaseResetSetSparePart(),
        )
      ),
      autobaseRemoveSparePart: id => (
        dispatch(
          autobaseActions.autobaseRemoveSparePart(
            id,
            {
              page: loadingPageName,
            },
          ),
        )
      ),
    }),
  ),
)(SparePartList);

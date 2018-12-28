import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList';
import InsurancePolicyFormWrap from 'components/directories/autobase/insurance_policy/InsurancePolicyForm/InsurancePolicyFromWrap';
import InsurancePolicyTable from 'components/directories/autobase/insurance_policy/InsurancePolicyTable';
import permissions from 'components/directories/autobase/insurance_policy/config-data/permissions';
import { connect } from 'react-redux';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import { compose } from 'recompose';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import { getAutobaseState } from 'redux-main/reducers/selectors';

const loadingPageName = 'insurance-policy';

@connectToStores(['session'])
@exportable({ entity: `autobase/${AUTOBASE.insurancePolicy}` })
@staticProps({
  entity: 'autobase_insurance_policy',
  permissions,
  listName: 'insurancePolicyList',
  tableComponent: InsurancePolicyTable,
  formComponent: InsurancePolicyFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
class InsurancePolicyList extends ElementsList {
  removeElementAction = async (id) => {
    try {
      await this.props.autobaseRemoveInsurancePolicy(id);
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
      this.props.insurancePolicyGetAndSetInStore();
    } else {
      this.props.insurancePolicyGetAndSetInStore({ car_id });
    }
  }

  componentWillUnmount() {
    this.props.autobaseResetSetInsurancePolicy();
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
      insurancePolicyList: getAutobaseState(state).insurancePolicyList,
    }),
    dispatch => ({
      carGetAndSetInStore: () => (
        dispatch(
          autobaseActions.carGetAndSetInStore(),
        )
      ),
      insurancePolicyGetAndSetInStore: (payload = {}) => (
        dispatch(
          autobaseActions.insurancePolicyGetAndSetInStore(
            payload,
            {
              page: loadingPageName,
            },
          ),
        )
      ),
      autobaseResetSetInsurancePolicy: () => (
        dispatch(
          autobaseActions.autobaseResetSetInsurancePolicy(),
        )
      ),
      autobaseRemoveInsurancePolicy: id => (
        dispatch(
          autobaseActions.autobaseRemoveInsurancePolicy(
            id,
            {
              page: loadingPageName,
            },
          ),
        )
      ),
    }),
  ),
)(InsurancePolicyList);

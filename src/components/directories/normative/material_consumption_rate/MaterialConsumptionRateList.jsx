import ElementsList from 'components/ElementsList';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import MaterialConsumptionRateFormWrap from 'components/directories/normative/material_consumption_rate/MaterialConsumptionRateForm/MaterialConsumptionRateFormWrap';

import MaterialConsumptionRateTable from 'components/directories/normative/material_consumption_rate/MaterialConsumptionRateTable';
import permissions from 'components/directories/normative/material_consumption_rate/config-data/permissions';

import { connect } from 'react-redux';
import {
  materialConsumptionRateGetAndSetInStore,
  materialConsumptionRateDelete,
} from 'redux-main/reducers/modules/material_consumption_rate/actions-materialConsumptionRate';

import { compose } from 'recompose';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

import {
  getSessionState,
  getMaterialConsumptionRateState,
} from 'redux-main/reducers/selectors';

const loadingPageName = 'consumption-rate';

@connectToStores(['objects'])
@exportable({ entity: 'material_consumption_rate' })
@staticProps({
  entity: 'material_consumption_rate',
  permissions,
  listName: 'materialConsumptionRateList',
  tableComponent: MaterialConsumptionRateTable,
  formComponent: MaterialConsumptionRateFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
class MaterialConsumptionRateDirectory extends ElementsList {
  constructor(props) {
    super(props);
  }

  removeElementAction = async (id) => {
    try {
      await this.props.materialConsumptionRateDelete(id);
      this.init();
    } catch (e) {
      //
    }
  };

  init() {
    this.props.materialConsumptionRateGetAndSetInStore(this.props.type);
    // flux.getActions('objects').getMaterialConsumptionRate();
    // flux.getActions('objects').getCleanCategories();
    // flux.getActions('technicalOperation').getTechnicalOperations();
    // flux.getActions('odh').getODHNorm();
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
  };
}

export default compose(
  withPreloader({
    page: loadingPageName,
    typePreloader: 'mainpage',
  }),
  connect(
    (state) => ({
      materialConsumptionRateList: getMaterialConsumptionRateState(state)
        .materialConsumptionRateList,
      userData: getSessionState(state).userData,
    }),
    (dispatch) => ({
      materialConsumptionRateGetAndSetInStore: (type) =>
        dispatch(
          materialConsumptionRateGetAndSetInStore(
            { type },
            {
              page: loadingPageName,
            },
          ),
        ),
      materialConsumptionRateDelete: (id) =>
        dispatch(materialConsumptionRateDelete(id)),
    }),
  ),
)(MaterialConsumptionRateDirectory);

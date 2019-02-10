import { staticProps, exportable } from 'utils/decorators';
import ElementsList from 'components/ElementsList';
import FuelCardsTable from 'components/directories/autobase/fuel_cards/FuelCardsTable';
import FuelCardsFormWrap from 'components/directories/autobase/fuel_cards/FuelCardsForm/FuelCardsFormWrap';
import permissions from 'components/directories/autobase/fuel_cards/config-data/permissions';
import { connect } from 'react-redux';
import * as fuelCardsActions from 'redux-main/reducers/modules/autobase/fuel_cards/actions-fuelcards';
import { compose } from 'recompose';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import {
  getSessionState,
  getAutobaseState,
} from 'redux-main/reducers/selectors';

const loadingPageName = 'fuel_cards';

@exportable({ entity: 'fuel_cards' })
@staticProps({
  entity: 'fuel_cards',
  permissions,
  listName: 'fuelCardsList',
  formComponent: FuelCardsFormWrap,
  tableComponent: FuelCardsTable,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE'],
})
class FuelCardsList extends ElementsList {
  removeElementAction = () => {
    console.log('нельзя удалить элемент из реестра'); // eslint-disable-line
  };

  init() {
    this.props.fuelCardsGetAndSetInStore();
  }

  componentWillUnmount() {
    this.props.resetSetFuelCards();
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
  };

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
    (state) => ({
      fuelCardsList: getAutobaseState(state).fuelCardsList,
      userData: getSessionState(state).userData,
    }),
    (dispatch) => ({
      fuelCardsGetAndSetInStore: () =>
        dispatch(
          fuelCardsActions.fuelCardsGetAndSetInStore(
            {},
            {
              page: loadingPageName,
            },
          ),
        ),
      resetSetFuelCards: () => dispatch(fuelCardsActions.resetSetFuelCards()),
    }),
  ),
)(FuelCardsList);

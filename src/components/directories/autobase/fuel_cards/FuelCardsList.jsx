import { staticProps, exportable } from 'utils/decorators';
import ElementsList from 'components/ElementsList';
import FuelCardsTable from 'components/directories/autobase/fuel_cards/FuelCardsTable';
import FuelCardsFormWrap from 'components/directories/autobase/fuel_cards/FuelCardsForm/FuelCardsFormWrap';
import permissions from 'components/directories/autobase/fuel_cards/config-data/permissions';
import { connect } from 'react-redux';
import * as fuelCardsActions from 'redux-main/reducers/modules/autobase/fuel_cards/actions-fuelcards';
import { compose } from 'recompose';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import { getFuelCardsState, getSessionState } from 'redux-main/reducers/selectors';

const loadingPageName = 'fuelcards';


@exportable({ entity: 'fuelcards' })
@staticProps({
  entity: 'fuel_cards',
  permissions,
  listName: 'fuelCardsList',
  formComponent: FuelCardsFormWrap,
  tableComponent: FuelCardsTable,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
class FuelCardsList extends ElementsList {
  removeElementAction = () => {
    console.log('нельзя удалить элемент из реестра');
  }

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
      fuelCardsList: getFuelCardsState(state).fuelCardsList,
      userData: getSessionState(state).userData, // выпилить???
    }),
    dispatch => ({
      fuelCardsGetAndSetInStore: () => (
        dispatch(
          fuelCardsActions.fuelCardsGetAndSetInStore(
            {},
            {
              page: loadingPageName,
            },
          ),
        )
      ),
      resetSetFuelCards: () => (
        dispatch(
          fuelCardsActions.resetSetFuelCards(),
        )
      ),
    }),
  ),
)(FuelCardsList);

import * as React from 'react';
import { findDOMNode } from 'react-dom';

import { connect } from 'react-redux';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { monitorPageChangeFilter } from 'components/old/monitor/redux-main/models/actions-monitor-page';

import {
  PropsCarFieldBytextInput,
} from 'components/old/monitor/tool-bar/car-data/car-filters/car-filter-by-text/car-field-by-text-input/CarFieldBytextInput.h';

import {
  DivNone,
} from 'global-styled/global-styled';
import { ReduxState } from 'redux-main/@types/state';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { compose } from 'recompose';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';

const placeholder = {
  reg_number: 'рег. номер',
  garage_number: 'гар. номер',
  name: 'Наименование',
  short_name: 'Краткое наименование',
  full_name: 'Полное наименование',
  address: 'Адресная привязка',
  object: 'объекта',
};
const CarFieldBytextInput: React.FC<PropsCarFieldBytextInput> = React.memo(
  ({carFilterText, changeCarFilterText, resetCarFilterText, handleFocusOnCar, canFocusOnCar, geoobjectsFilter}) => {

    const focusOn = React.useCallback((node) => {
      const element: any = findDOMNode(node);
      if (element) {
        (element.querySelector('.form-control') as HTMLInputElement).focus();
      }
    }, []);

    const placeholderText = React.useMemo(() => {
      if (geoobjectsFilter === 'cars') {
        return `${placeholder.reg_number}/${placeholder.garage_number}`;
      }
      if (geoobjectsFilter === 'dt' || geoobjectsFilter === 'odh') {
        return `${placeholder.name} ${placeholder.object}`;
      }
      if (geoobjectsFilter === 'ssp' || geoobjectsFilter === 'msp') {
        return `${placeholder.full_name}/${placeholder.short_name}`;
      }
      if (geoobjectsFilter === 'carpool' || geoobjectsFilter === 'fueling_water') {
        return placeholder.full_name;
      }
      if (geoobjectsFilter === 'danger_zone') {
        return placeholder.address;
      }
      return placeholder.name;
    }, [geoobjectsFilter]);

    return (
      <div className="car_text_filter-container">
        <ExtField
          ref={focusOn}
          label={false}
          type="string"
          value={carFilterText}
          onChange={changeCarFilterText}
          placeholder={placeholderText}
        />
        <div className="input_text_action-wrap">
          {carFilterText ? (
            <div
              className="input_text_action remove"
              onClick={resetCarFilterText}
            >
              <EtsBootstrap.Glyphicon glyph="remove" />
            </div>
          ) : (
            <DivNone />
          )}
          {canFocusOnCar ? (
            <div
              className="input_text_action show_tc"
              onClick={handleFocusOnCar}
            >
              <EtsBootstrap.Glyphicon glyph="screenshot" />
              <span>Показать</span>
            </div>
          ) : (
            <DivNone />
          )}
        </div>
      </div>
    );
  }
);

const mapStateToProps = (state) => {
  const carsToShow = Object.entries(state.monitorPage.filters.filtredCarGpsCode)
    .filter(([gps_code, show]) => (
      show
      && gps_code !== state.monitorPage.carInfo.gps_code
    ));

  return {
    carFilterText: state.monitorPage.filters.data.carFilterText,
    carsGpsCodeShowList: carsToShow[0],
    canFocusOnCar: carsToShow.length === 1,
    carActualGpsNumberIndex: state.monitorPage.carActualGpsNumberIndex,
    geoobjectsFilter: state.monitorPage.geoobjectsFilter,
  };
};

const mapDispatchToProps = (dispatch) => ({
  resetCarFilterText: () => (
    dispatch(
      monitorPageChangeFilter('carFilterText', ''),
    )
  ),
  changeCarFilterText: (value) => (
    dispatch(
      monitorPageChangeFilter('carFilterText', value),
    )
  ),
  dispatch,
});

const mergeProps = ({ carsGpsCodeShowList, carActualGpsNumberIndex, ...stateProps }, dispatchProps, ownerProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownerProps,
  handleFocusOnCar: () => {
    const [gps_code] = carsGpsCodeShowList;

    if (carActualGpsNumberIndex[gps_code]) {
      ownerProps.setParams({
        gov_number: carActualGpsNumberIndex[gps_code].gov_number,
      });
    }
  },
});

export default compose(
  withSearch,
  connect<any, any, any, ReduxState>(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  ),
)(CarFieldBytextInput);

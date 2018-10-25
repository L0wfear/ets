import * as React from 'react';
import { findDOMNode } from 'react-dom';

import { connect } from 'react-redux';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { ExtField } from 'components/ui/new/field/ExtField';
import { monitorPageChangeFilter } from 'components/monitor/redux-main/models/actions-monitor-page';
import { carInfoSetGpsNumber } from 'components/monitor/info/car-info/redux-main/modules/actions-car-info';

import {
  PropsCarFieldBytextInput,
  StateCarFieldBytextInput,
} from 'components/monitor/tool-bar/car-data/car-filters/car-filter-by-text/car-field-by-text-input/CarFieldBytextInput.h';

import {
  DivNone,
} from 'global-styled/global-styled';

class CarFieldBytextInput extends React.Component<PropsCarFieldBytextInput, StateCarFieldBytextInput> {
  focusOn = node => {
    const element: any = findDOMNode(node);
    if (element) {
      (element.querySelector('.form-control') as HTMLInputElement).focus();
    }
  }

  render() {
    return (
      <div className="car_text_filter-container">
        <ExtField
          ref={this.focusOn}
          label={false}
          type="string"
          value={this.props.carFilterText}
          onChange={this.props.changeCarFilterText}
          placeholder="рег.номер/гар.номер/БНСО"
        />
        {
          this.props.canFocusOnCar ?
            <div className="input_text_action-wrap">
              <div className="input_text_action" onClick={this.props.handleFocusOnCar}>
                <Glyphicon glyph="screenshot" />
                <span>Показать</span>
              </div>
            </div>
          :
            <DivNone />
        }
      </div>
    )
  }
}
const mapStateToProps = state => {
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
  };
};

const mapDispatchToProps = dispatch => ({
  changeCarFilterText: ({ target: { value } }) => (
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

    carActualGpsNumberIndex[gps_code] &&
    dispatchProps.dispatch(
      carInfoSetGpsNumber(gps_code, carActualGpsNumberIndex[gps_code].gov_number),
    )
  },
});

 export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
 )(CarFieldBytextInput);

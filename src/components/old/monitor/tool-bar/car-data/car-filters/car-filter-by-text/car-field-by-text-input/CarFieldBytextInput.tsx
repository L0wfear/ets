import * as React from 'react';
import { findDOMNode } from 'react-dom';

import { connect } from 'react-redux';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { monitorPageChangeFilter } from 'components/old/monitor/redux-main/models/actions-monitor-page';

import {
  PropsCarFieldBytextInput,
  StateCarFieldBytextInput,
} from 'components/old/monitor/tool-bar/car-data/car-filters/car-filter-by-text/car-field-by-text-input/CarFieldBytextInput.h';

import {
  DivNone,
} from 'global-styled/global-styled';
import { ReduxState } from 'redux-main/@types/state';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { compose } from 'recompose';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';

class CarFieldBytextInput extends React.Component<PropsCarFieldBytextInput, StateCarFieldBytextInput> {
  focusOn = (node) => {
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
        <div className="input_text_action-wrap">
        {
          this.props.carFilterText ?
            <div className="input_text_action remove" onClick={this.props.resetCarFilterText}>
              <EtsBootstrap.Glyphicon glyph="remove" />
            </div>
          :
          <DivNone />
        }
        {
          this.props.canFocusOnCar ?
            <div className="input_text_action show_tc" onClick={this.props.handleFocusOnCar}>
              <EtsBootstrap.Glyphicon glyph="screenshot" />
              <span>Показать</span>
            </div>
          :
            <DivNone />
        }
        </div>
      </div>
    );
  }
}
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
  };
};

const mapDispatchToProps = (dispatch) => ({
  resetCarFilterText: () => (
    dispatch(
      monitorPageChangeFilter('carFilterText', ''),
    )
  ),
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

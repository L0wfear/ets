import * as React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import ExtField from 'components/@next/@ui/renderFields/Field';
import { monitorPageChangeFilter } from 'components/old/monitor/redux-main/models/actions-monitor-page';

import { ReduxState } from 'redux-main/@types/state';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';

type Props = {
  carFilterText: string;
  canFocusOnCar: boolean;
  changeCarFilterText: any;
  resetCarFilterText: React.MouseEventHandler<any>;
  handleFocusOnCar: React.MouseEventHandler<HTMLDivElement>;
};

const CarFieldBytextInput: React.FC<Props> = React.memo(
  (props) => {
    return (
      <div className="car_text_filter-container">
        <ExtField
          label={false}
          type="string"
          value={props.carFilterText}
          onChange={props.changeCarFilterText}
          placeholder="рег.номер/гар.номер/БНСО"
        />
        <div className="input_text_action-wrap">
          {
            props.carFilterText && (
              <div className="input_text_action remove" onClick={props.resetCarFilterText}>
                <EtsBootstrap.Glyphicon glyph="remove" />
              </div>
            )
          }
          {
            props.canFocusOnCar && (
              <div className="input_text_action show_tc" onClick={props.handleFocusOnCar}>
                <EtsBootstrap.Glyphicon glyph="screenshot" />
                <span>Показать</span>
              </div>
            )
          }
        </div>
      </div>
    );
  }
);

const mapStateToProps = (state: ReduxState) => {
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

import * as React from 'react';
import Overlay from 'components/new/ui/map/overlay/Overlay';
import * as moment from 'moment';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { carInfoSetFuelEventPoint } from 'components/monitor/info/car-info/redux-main/modules/actions-car-info';
import { secondsToTime, makeDate, makeTime, getDateWithMoscowTzByTimestamp } from 'utils/dates';

import {
  OverlayLineInfoContainer,
} from 'components/new/ui/map/overlay/styled/styled';

const getTitleByType = (event_type) => {
  switch (event_type) {
    case 'leak' : return 'Слив топлива:';
    case 'refill' : return 'Заправка топлива:';
    default: return '';
  }
};

const OverlayFuelEventPoint: React.FC<any> = (props) => {
  const { fuelEventPoint } = props;

  if (!fuelEventPoint) {
    return (
      <Overlay map={props.map} hidePopup={props.hidePopup} />
    );
  }

  const {
    event_type,
    sensor_id,
    value,
    start_coords_msk,
    started_at_msk,
    finished_at_msk,
  } = fuelEventPoint;
  const sp_timestamp = moment(started_at_msk).unix();
  const ep_timestamp = moment(finished_at_msk).unix();

  const moscowSpTimetamp = getDateWithMoscowTzByTimestamp(sp_timestamp * 1000);

  const start = `${makeDate(moscowSpTimetamp)} ${makeTime(moscowSpTimetamp, true)}`;
  const diff = secondsToTime(ep_timestamp - sp_timestamp);

  return (
    <Overlay title={getTitleByType(event_type)} map={props.map} coordsMsk={start_coords_msk} hidePopup={props.hidePopup} >
      <OverlayLineInfoContainer>
        <span className="font-bold">Датчик: </span><span>{sensor_id}</span>
      </OverlayLineInfoContainer>
      <OverlayLineInfoContainer>
        <span className="font-bold">Кол-во: </span><span>{value}</span>
      </OverlayLineInfoContainer>
      <OverlayLineInfoContainer>
        <span className="font-bold">Дата и время: </span><span>{start}</span>
      </OverlayLineInfoContainer>
      <OverlayLineInfoContainer>
        <span className="font-bold">Потраченное время: </span><span>{diff}</span>
      </OverlayLineInfoContainer>
    </Overlay>
  );
};

const mapStateToProps = (state) => ({
  fuelEventPoint: state.monitorPage.carInfo.popups.fuelEventPoint,
});

const mapDispatchToProps = (dispatch) => ({
  hidePopup: () => (
    dispatch(
      carInfoSetFuelEventPoint(),
    )
  ),
});

export default compose<any, any>(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(OverlayFuelEventPoint);

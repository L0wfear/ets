import * as React from 'react';
import Overlay from 'components/map/new/overlay/Overlay';
import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { connect } from 'react-redux';
import { carInfoSetFuelEventPoint } from 'components/monitor/new/info/car-info/redux/modules/actions-car-info';
import { secondsToTime, makeDate, makeTime, getDateWithMoscowTz } from 'utils/dates';

const getTitleByType = (event_type) => {
  switch (event_type) {
    case 'leak' : return 'Слив топлива:';
    case 'refill' : return 'Заправка топлива:';
    default: return '';
  }
}

const OverlayFuelEventPoint: React.SFC<any> = props => {
  const { fuelEventPoint } = props;

  if (!fuelEventPoint) {
    return (
      <Overlay map={props.map} hidePopup={props.hidePopup} />
    );
  }

  const {
    event_type,
    sensor_id,
    event_val,

    start_point: {
      coords_msk,
      timestamp: sp_timestamp,
    },
    end_point: { timestamp: ep_timestamp },
  } = fuelEventPoint;

  const moscowSpTimetamp = getDateWithMoscowTz(sp_timestamp * 1000);

  const start = `${makeDate(moscowSpTimetamp)} ${makeTime(moscowSpTimetamp, true)}`;
  const diff = secondsToTime(ep_timestamp - sp_timestamp);

  return (
    <Overlay title={getTitleByType(event_type)} map={props.map} coordsMsk={coords_msk} hidePopup={props.hidePopup} >
      <div className="overlay-line-info">
        <span className="font-bold">Датчик: </span><span>{sensor_id}</span>
      </div>
      <div className="overlay-line-info">
        <span className="font-bold">Кол-во: </span><span>{event_val} л.</span>
      </div>
      <div className="overlay-line-info">
        <span className="font-bold">Дата и время: </span><span>{start}</span>
      </div>
      <div className="overlay-line-info">
        <span className="font-bold">Потраченное время: </span><span>{diff}</span>
      </div>
    </Overlay>
  );
}

const mapStateToProps = state => ({
  fuelEventPoint: state.monitorPage.carInfo.popups.fuelEventPoint,
});

const mapDispatchToProps = dispatch => ({
  hidePopup: () => (
    dispatch(
      carInfoSetFuelEventPoint(),
    )
  ),
});

export default hocAll(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )
)(OverlayFuelEventPoint);


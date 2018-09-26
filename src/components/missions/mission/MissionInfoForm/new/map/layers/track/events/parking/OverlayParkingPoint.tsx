import * as React from 'react';
import Overlay from 'components/map/new/overlay/Overlay';
import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { connect } from 'react-redux';
import { carInfoSetParkingPoint } from 'components/monitor/new/info/car-info/redux-main/modules/actions-car-info';
import { secondsToTime, makeDate, makeTime, getDateWithMoscowTz } from 'utils/dates';

import {
  OverlayLineInfoContainer,
} from 'components/map/new/overlay/styled/styled';

const OverlayTrackPoint: React.SFC<any> = props => {
  const { parkingPoint } = props;

  if (!parkingPoint) {
    return (
      <Overlay map={props.map} hidePopup={props.hidePopup} />
    );
  }

  const {
    start_point: {
      coords_msk,
      timestamp: sp_timestamp,
    },
    end_point: { timestamp: ep_timestamp },
  } = parkingPoint;

  const moscowSpTimetamp = getDateWithMoscowTz(sp_timestamp * 1000);
  const moscowEpTimetamp = getDateWithMoscowTz(sp_timestamp * 1000);

  const start = `${makeDate(moscowSpTimetamp)} ${makeTime(moscowSpTimetamp, true)}`;
  const end = `${makeDate(moscowEpTimetamp)} ${makeTime(moscowEpTimetamp, true)}`;
  const diff = secondsToTime(ep_timestamp - sp_timestamp);

  return (
    <Overlay title="Зона стоянки:" map={props.map} coordsMsk={coords_msk} hidePopup={props.hidePopup} >
      <OverlayLineInfoContainer>
        <span className="font-bold">Начало: </span><span>{start}</span>
      </OverlayLineInfoContainer>
      <OverlayLineInfoContainer>
        <span className="font-bold">Конец: </span><span>{end}</span>
      </OverlayLineInfoContainer>
      <OverlayLineInfoContainer>
        <span className="font-bold">Время стоянки: </span><span>{diff}</span>
      </OverlayLineInfoContainer>
    </Overlay>
  );
}

const mapStateToProps = state => ({
  parkingPoint: state.monitorPage.carInfo.popups.parkingPoint,
});

const mapDispatchToProps = dispatch => ({
  hidePopup: () => (
    dispatch(
      carInfoSetParkingPoint(),
    )
  ),
});

export default hocAll(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )
)(OverlayTrackPoint);


import * as React from 'react';
import Overlay from 'components/map/new/overlay/Overlay';
import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { connect } from 'react-redux';
import { monitorPageSetFuelEventsLeakOverlayData } from 'components/monitor/new/redux/models/actions-monitor-page';
import { getFormattedDateTime } from 'utils/dates';

const OverlayFuelEventLeakPoint: React.SFC<any> = props => {
  const { overlayData } = props;

  if (!overlayData) {
    return (
      <Overlay map={props.map} hidePopup={props.hidePopup} />
    );
  }

  const {
    gov_number,
    sensor_id,
    value,
    started_at,
    duration,
    shape: { coordinates },
  } = overlayData;
  const started_at_format = getFormattedDateTime(started_at);

  return (
    <Overlay title="Слив топлива:" map={props.map} coordsMsk={coordinates} hidePopup={props.hidePopup} >
      <div className="overlay-line-info">
        <span className="font-bold">Рег номер: </span><span>{gov_number}</span>
      </div>
      <div className="overlay-line-info">
        <span className="font-bold">Датчик: </span><span>{sensor_id}</span>
      </div>
      <div className="overlay-line-info">
        <span className="font-bold">Кол-во: </span><span>{`${value} л.`}</span>
      </div>
      <div className="overlay-line-info">
        <span className="font-bold">Дата и время: </span><span>{started_at_format}</span>
      </div>
      <div className="overlay-line-info">
        <span className="font-bold">Потраченное время: </span><span>{duration}</span>
      </div>
    </Overlay>
  );
}

const mapStateToProps = state => ({
  overlayData: state.monitorPage.fuelEvents.leak.overlayData,
});

const mapDispatchToProps = dispatch => ({
  hidePopup: () => (
    dispatch(
      monitorPageSetFuelEventsLeakOverlayData(),
    )
  ),
});

export default hocAll(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )
)(OverlayFuelEventLeakPoint);


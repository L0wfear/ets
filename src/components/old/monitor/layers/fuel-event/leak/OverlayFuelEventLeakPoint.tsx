import * as React from 'react';
import Overlay from 'components/new/ui/map/overlay/Overlay';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { monitorPageSetFuelEventsLeakOverlayData } from 'components/old/monitor/redux-main/models/actions-monitor-page';
import { getFormattedDateTime } from 'components/@next/@utils/dates/dates';

import {
  OverlayLineInfoContainer,
} from 'components/new/ui/map/overlay/styled/styled';

const OverlayFuelEventLeakPoint: React.FC<any> = (props) => {
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
    started_at_msk,
    duration,
    shape: { coordinates },
  } = overlayData;
  const started_at_msk_format = getFormattedDateTime(started_at_msk);

  return (
    <Overlay title="Слив топлива:" map={props.map} coordsMsk={coordinates} hidePopup={props.hidePopup} >
      <OverlayLineInfoContainer>
        <span className="font-bold">Рег номер: </span><span>{gov_number}</span>
      </OverlayLineInfoContainer>
      <OverlayLineInfoContainer>
        <span className="font-bold">Датчик: </span><span>{sensor_id}</span>
      </OverlayLineInfoContainer>
      <OverlayLineInfoContainer>
        <span className="font-bold">Кол-во: </span><span>{`${value} л.`}</span>
      </OverlayLineInfoContainer>
      <OverlayLineInfoContainer>
        <span className="font-bold">Дата и время: </span><span>{started_at_msk_format}</span>
      </OverlayLineInfoContainer>
      <OverlayLineInfoContainer>
        <span className="font-bold">Потраченное время: </span><span>{duration}</span>
      </OverlayLineInfoContainer>
    </Overlay>
  );
};

const mapStateToProps = (state) => ({
  overlayData: state.monitorPage.fuelEvents.leak.overlayData,
});

const mapDispatchToProps = (dispatch) => ({
  hidePopup: () => (
    dispatch(
      monitorPageSetFuelEventsLeakOverlayData(),
    )
  ),
});

export default compose<any, any>(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(OverlayFuelEventLeakPoint);

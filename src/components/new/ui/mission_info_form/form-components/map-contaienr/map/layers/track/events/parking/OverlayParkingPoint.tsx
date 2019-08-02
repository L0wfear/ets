import * as React from 'react';
import Overlay from 'components/new/ui/map/overlay/Overlay';
import { secondsToTime, makeDate, makeTime, getDateWithMoscowTzByTimestamp } from 'components/@next/@utils/dates/dates';

import {
  OverlayLineInfoContainer,
} from 'components/new/ui/map/overlay/styled/styled';

const OverlayTrackPoint: React.FC<any> = (props) => {
  const {
    start_point: {
      coords_msk,
      timestamp: sp_timestamp,
    },
    end_point: { timestamp: ep_timestamp },
  } = props.parkingPoint;

  const moscowSpTimetamp = getDateWithMoscowTzByTimestamp(sp_timestamp * 1000);
  const moscowEpTimetamp = getDateWithMoscowTzByTimestamp(ep_timestamp * 1000);

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
};

export default OverlayTrackPoint;

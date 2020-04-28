import * as React from 'react';
import InfoCard from 'components/new/pages/dashboard/menu/cards/_default-card-component/info-card/InfoCard';

import styled from 'styled-components';
import { getClassNameByType } from './utils';
import { getMonitorPageState } from 'redux-main/reducers/selectors';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

const NotInMapItemStyled = styled.div`position: relative;`;

type Props = {};

export const NotInMapItem: React.FC<Props> = (props) => {
  const carsByStatus = etsUseSelector(
    (state) => getMonitorPageState(state).carsByStatus,
  );
  const carActualNotInMap = etsUseSelector(
    (state) => getMonitorPageState(state).carActualNotInMap,
  );

  const [showInfoCard, setShowInfoCard] = React.useState(false);

  const notInMapValue = carsByStatus['not_in_map'];
  const infoCardTitle = `Нет на карте: ${notInMapValue}`;

  const handleShowInfoCard = React.useCallback(() => {
    setShowInfoCard(!showInfoCard);
  }, [showInfoCard]);
  const handleCloseInfoCard = React.useCallback(() => {
    setShowInfoCard(false);
  }, [showInfoCard]);

  let govNumbersListStr = '';
  carActualNotInMap.forEach((car) => govNumbersListStr += `${car.gov_number}, ` );

  return  (
    <NotInMapItemStyled key={'not_in_map'} className={getClassNameByType(props, 'not_in_map')}>
      <div className={`car_data-color not_in_map`}></div>
      <div onClick={handleShowInfoCard}>
      Нет на карте {`(${notInMapValue})`}
      </div>
      {
        Boolean(showInfoCard && notInMapValue) && (
          <InfoCard title={infoCardTitle} handleClose={handleCloseInfoCard}>
            {govNumbersListStr.slice(0, -2)}
          </InfoCard>
        )
      } 
    </NotInMapItemStyled>
  );
};

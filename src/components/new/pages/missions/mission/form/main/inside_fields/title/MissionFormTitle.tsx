import * as React from 'react';
import { PropsMissionFormTitle } from './MissionFormTitle.h';
import { MISSION_STATUS_LABELS } from 'redux-main/reducers/modules/missions/mission/constants';
import EtsBootstrap from 'components/new/ui/@bootstrap';

const MissionFormTitle: React.FC<PropsMissionFormTitle> = (props) => {
  if (props.IS_CREATING || !props.number) {
    return (
      <React.Fragment>
        <span>Создание задания</span>
        {
          !Boolean(props.MISSION_IS_ORDER_SOURCE) && (
            <EtsBootstrap.BackgroundLabel bsStyle="error">
              Данное задание не будет учитываться по централизованным заданиям
            </EtsBootstrap.BackgroundLabel>
          )
        }
      </React.Fragment>
    );
  }

  let title = `Задание № ${props.number_text}`;

  if (props.column_id) {
    title = `${title} . Колонна № ${props.column_id}`;
  }

  return (
    <React.Fragment>
      <span>{title}</span>
      <EtsBootstrap.BackgroundLabel bsStyle="default">
        {MISSION_STATUS_LABELS[props.status]}
      </EtsBootstrap.BackgroundLabel>
    </React.Fragment>
  );
};

export default React.memo(MissionFormTitle);

import * as React from 'react';
import { PropsMissionFormTitle } from './MissionFormTitle.h';
import { MISSION_STATUS_LABELS } from 'constants/dictionary';
import EtsBootstrap from 'components/new/ui/@bootstrap';

const MissionFormTitle: React.FC<PropsMissionFormTitle> = (props) => {
  if (props.IS_CREATING) {
    return (
      <React.Fragment>
        <span>Создание задания</span>
        {
          !Boolean(props.MISSION_IS_ORDER_SOURCE) && (
            <span style={{ marginLeft: 10, color: '#a94442' }}>
              Данное задание не будет учитываться по централизованным заданиям
            </span>
          )
        }
      </React.Fragment>
    );
  }

  let title = `Задание № ${props.number}`;

  if (props.column_id) {
    title = `${title} . Колонна № ${props.column_id}`;
  }

  return (
    <React.Fragment>
      <span>{title}</span>
      <EtsBootstrap.Label bsStyle="default" style={{ marginLeft: 10 }}>
        {MISSION_STATUS_LABELS[props.status]}
      </EtsBootstrap.Label>
    </React.Fragment>
  );
};

export default React.memo(MissionFormTitle);

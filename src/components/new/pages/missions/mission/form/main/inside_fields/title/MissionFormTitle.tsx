import * as React from 'react';
import { PropsMissionFormTitle } from "./MissionFormTitle.h";
import { DivNone } from "global-styled/global-styled";
import { MISSION_STATUS_LABELS } from 'constants/dictionary';
import { Label } from 'react-bootstrap';

const MissionFormTitle: React.FC<PropsMissionFormTitle> = (props) => {
  if (props.IS_CREATING) {
    return (
      <div>
        <span>Создание задания</span>
        {
          !props.MISSION_IS_ORDER_SOURCE
            ? (
              <span style={{ marginLeft: 10, color: 'red' }}>
                Данное задание не будет учитываться по централизованным заданиям
              </span>
            )
            : (
              <DivNone />
            )
        }
      </div>
    );
  }

  let title = `Задание № ${props.number}`;

  if (props.column_id) {
    title = `${title} . Колонна № ${props.column_id}`;
  }

  return (
    <>
      <span>{title}</span>
      <Label bsStyle="default" style={{ marginLeft: 10 }}>
        {MISSION_STATUS_LABELS[props.status]}
      </Label>
    </>
  );
};

export default React.memo(MissionFormTitle);

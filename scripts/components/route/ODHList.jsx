import React from 'react';
import { polyState } from 'constants/polygons.js';
import { Button } from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';
import each from 'lodash/each';

export default (props) => {
  const ODHS = [];
  const ODHS_FAIL = [];

  each(props.odh_list, (odh, index) => {
    if (props.showSelectable || odh.state !== polyState.SELECTABLE) {
      const speed_type = odh.state === polyState.IDLE ? 'холостой' : 'рабочий';
      ODHS.push(<li key={index}>{`${odh.name || odh.object_name} (${speed_type} ход)`}</li>);
    }
  });

  each(props.odh_fail_list, (odh, index) => {
    ODHS_FAIL.push(<li key={index}>{`${odh.name || odh.odh_name}`}</li>);
  });

  return (
    <Div>
      <Div hidden={!props.checkRoute}>
        <Button onClick={props.checkRoute} style={{ marginTop: 11 }}>Проверить маршрут</Button>
      </Div>
      <Div hidden={!props.odh_list || !!!props.odh_list.length} className="odh-list">
        <h4>Список ОДХ/ДТ</h4>
        <ul>{ODHS}</ul>
      </Div>
      <Div hidden={!props.odh_fail_list || !!!props.odh_fail_list.length} className="odh-list">
        <h4>Список непокрытых ОДХ</h4>
        <ul>{ODHS_FAIL}</ul>
      </Div>
    </Div>
  );
};

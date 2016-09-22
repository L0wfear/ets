import React, { PropTypes } from 'react';
import { polyState } from 'constants/polygons.js';
import { Button } from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';
import each from 'lodash/each';
import uniqBy from 'lodash/uniqBy';

export default function ODHList(props) {
  const { showSelectable, checkRoute } = props;
  let { odh_list = [], odh_fail_list = [] } = props;
  const ODHS = [];
  const ODHS_FAIL = [];
  odh_list = uniqBy(odh_list, 'object_id');
  odh_fail_list = uniqBy(odh_fail_list, 'object_id');

  each(odh_list, (odh, index) => {
    if (showSelectable || odh.state !== polyState.SELECTABLE) {
      const speed_type = odh.state === polyState.IDLE ? 'холостой' : 'рабочий';
      ODHS.push(<li key={index}>{`${odh.name || odh.object_name} (${speed_type} ход)`}</li>);
    }
  });

  each(odh_fail_list, (odh, index) => {
    ODHS_FAIL.push(<li key={index}>{`${odh.name || odh.odh_name}`}</li>);
  });

  return (
    <Div>
      <Div hidden={!checkRoute}>
        <Button onClick={checkRoute} style={{ marginTop: 11 }}>Проверить маршрут</Button>
      </Div>
      <Div hidden={!odh_list.length} className="odh-list">
        <h4>Список ОДХ/ДТ</h4>
        <ul>{ODHS}</ul>
      </Div>
      <Div hidden={!odh_fail_list.length} className="odh-list">
        <h4>Список непокрытых ОДХ</h4>
        <ul>{ODHS_FAIL}</ul>
      </Div>
    </Div>
  );
}

ODHList.propTypes = {
  odh_list: PropTypes.array,
  odh_fail_list: PropTypes.array,
  checkRoute: PropTypes.func,
  showSelectable: PropTypes.bool,
};

import React, { PropTypes } from 'react';
import { polyState } from 'constants/polygons.js';
import { Button } from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';
import each from 'lodash/each';
import uniqBy from 'lodash/uniqBy';

export default function ODHList(props) {
  const { checkRoute } = props;
  let { odh_list = [], odh_fail_list = [] } = props;

  const ODHS = odh_list.map((odh, index) => {
    const speed_type = odh.state === polyState.IDLE ? 'холостой' : 'рабочий';
    return <li key={index}>{`${odh.odh_name} (${speed_type} ход)`}</li>
  });
  const ODHS_FAIL = odh_fail_list.map((odh, index) => <li key={index}>{`${odh.odh_name}`}</li>);

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

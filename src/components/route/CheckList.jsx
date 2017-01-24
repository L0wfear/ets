import React, { PropTypes } from 'react';
import { polyState } from 'constants/polygons.js';
import { Button } from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';
import each from 'lodash/each';
import uniqBy from 'lodash/uniqBy';

export default function ODHList(props) {
  const { checkRoute, name } = props;
  let { list = [], fail_list = [], draw_list = [] } = props;
  const LIST = list.map((odh, index) => {
    const speed_type = odh.state === polyState.IDLE ? 'холостой' : 'рабочий';
    return <li key={index}>{`${odh.name || odh.odh_name || odh.object_name} (${speed_type} ход)`}</li>
  });
  const DRAW_LIST = draw_list.map((odh, index) => {
    const speed_type = odh.state === polyState.IDLE ? 'холостой' : 'рабочий';
    return <li key={index}>{`${odh.name || odh.odh_name || odh.object_name} (${speed_type} ход)`}</li>
  });
  const FAIL = fail_list.map((odh, index) => <li key={index}>{`${odh.name || odh.odh_name || odh.object_name}`}</li>);

  return (
    <Div>
      <Div hidden={!checkRoute}>
        <Button onClick={checkRoute} style={{ marginTop: 11 }}>Проверить маршрут</Button>
      </Div>
      <Div hidden={!list.length} className="odh-list">
        <h4>Список {name} {DRAW_LIST.length ? '(Выбор из ОДХ)' : ''}</h4>
        <ul>{LIST}</ul>
      </Div>
      <Div hidden={!DRAW_LIST.length} className="odh-list">
        <h4>Список {name} (Вручную)</h4>
        <ul>{DRAW_LIST}</ul>
      </Div>
      <Div hidden={!fail_list.length} className="odh-list">
        <h4>Список непокрытых {name}</h4>
        <ul>{FAIL}</ul>
      </Div>
    </Div>
  );
}

ODHList.propTypes = {
  list: PropTypes.array,
  fail_list: PropTypes.array,
  checkRoute: PropTypes.func,
  showSelectable: PropTypes.bool,
};

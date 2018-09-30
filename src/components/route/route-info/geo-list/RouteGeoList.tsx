import * as React from 'react';
import { PropsRouteGeoList } from 'components/route/route-info/geo-list/RouteGeoList.h';
import { Button } from 'react-bootstrap';
import { uniqBy } from 'lodash';

import {
  RouteGeoListContainer,
  NameListLineContainer,
} from 'components/route/route-info/geo-list/styled/styled';
import { DivNone } from 'global-styled/global-styled';
import { routeTypesByKey } from 'constants/route';

import { polyState } from 'components/missions/mission/MissionInfoForm/form-components/map-contaienr/map/layers/geoobjects/feature-style';

const makeNameByProps = (type: PropsRouteGeoList['type']) => {
  const title = routeTypesByKey[type] ? routeTypesByKey[type].title : '';

  let nameObjectList = `Список ${title}`;
  const nameDrawObjectList = `Список ${title} Вручную`;
  const nameFailList = `Список непокрытых ${title}`;

  if (type !== 'points') {
    nameObjectList = `${nameObjectList}  (Выбор из ${title})`;
  }


  return {
    nameObjectList,
    nameDrawObjectList,
    nameFailList,
  };
}

class RouteGeoList extends React.PureComponent<PropsRouteGeoList, {}> {
  render() {
    const { props } = this;
    const {
      object_list,
      draw_object_list,
      fail_list,
    } = props;

    const {
      nameObjectList,
      nameDrawObjectList,
      nameFailList,
    } = makeNameByProps(props.type);

    console.log(this.props)

    return (
      <RouteGeoListContainer>
        {
          props.checkRoute
          ? (
            <Button
              id="check-routes"
              disabled={props.disabledCheckRoute}
              onClick={props.checkRoute}
            >
              Проверить маршрут
            </Button>
          )
          : (
            <DivNone />
          )
        }
        {
          object_list && object_list.length
          ? (
            <div>
              <NameListLineContainer>
              <h4>{nameObjectList}</h4>
                {
                  object_list.map(({ type, ...data }, index) => {
                    let title = data.name;
                    let key = data.object_id;

                    if (type === 'dt' || type === 'odh') {
                      title = `${title} (${data.state === polyState.IDLE ? 'холостой' : 'рабочий'} ход)`;
                    } 
                    if (type === 'points') {
                      title = `Пункт назначения №${index + 1} (${title})`;
                      key = index;
                    }

                    return (
                      <li key={key}>
                        {title}
                      </li>
                    )
                  })
                }
              </NameListLineContainer>
            </div>
          )
          : (
            <DivNone />
          )
        }
        {
          draw_object_list && draw_object_list.length
          ? (
            <div>
              <NameListLineContainer>
              <h4>{nameDrawObjectList}</h4>
                {
                  uniqBy(draw_object_list, o => o.name + o.state).map(({type, ...data }, index) => {
                    let title = data.name;
                    let key = index;

                    if (type === 'dt' || type === 'odh') {
                      title = `${title} (${data.state === polyState.IDLE ? 'холостой' : 'рабочий'} ход)`;
                    } 
                    if (type === 'points') {
                      title = `Пункт назначения №${index + 1} (${title})`;
                    }

                    return (
                      <li key={key}>
                        {title}
                      </li>
                    )
                  })
                }
              </NameListLineContainer>
            </div>
          )
          : (
            <DivNone />
          )
        }
        {
          fail_list && fail_list.length
          ? (
            <div>
              <NameListLineContainer>
              <h4>{nameFailList}</h4>
                {
                  fail_list.map((data, index) => (
                    <li key={index}>
                      {data.name}
                    </li>
                  ))
                }
              </NameListLineContainer>
            </div>
          )
          : (
            <DivNone />
          )
        }
      </RouteGeoListContainer>
    )
  }
}

export default RouteGeoList;

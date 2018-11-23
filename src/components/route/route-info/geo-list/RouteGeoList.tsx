import * as React from 'react';
import { PropsRouteGeoList } from 'components/route/route-info/geo-list/RouteGeoList.h';
import * as Button from 'react-bootstrap/lib/Button';
import { uniqBy } from 'lodash';

import {
  RouteGeoListContainer,
  NameListLineContainer,
  TitleList,
} from 'components/route/route-info/geo-list/styled/styled';
import { DivNone } from 'global-styled/global-styled';
import { routeTypesByKey } from 'constants/route';

import { polyState } from 'constants/polygons';

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
};

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
              <TitleList>{nameObjectList}</TitleList>
                {
                  object_list.map(({ type, ...data }, index) => {
                    let title = data.name;
                    let key = data.object_id;

                    if (type === 'dt' || type === 'odh') {
                      title = `${title} (${data.state === polyState.SELECTED_IDLING ? 'холостой' : 'рабочий'} ход)`;
                    }

                    if (type === 'points') {
                      const pnNumber = `Пункт назначения №${index + 1}`;
                      if (title) {
                        title = `${pnNumber} (${title})`;
                      } else {
                        title = pnNumber;
                      }
                      key = index;
                    }

                    return (
                      <li key={key}>
                        {title}
                      </li>
                    );
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
              <TitleList>{nameDrawObjectList}</TitleList>
                {
                  uniqBy(draw_object_list, (o) => o.name + o.state).map(({type, ...data }, key) => {
                    let title = data.name;

                    if (type === 'dt' || type === 'odh') {
                      title = `${title} (${data.state === polyState.SELECTED_IDLING ? 'холостой' : 'рабочий'} ход)`;
                    }

                    if (type === 'points') {
                      title = `Пункт назначения №${key + 1} (${title})`;
                    }

                    return (
                      <li key={key}>
                        {title}
                      </li>
                    );
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
              <TitleList>{nameFailList}</TitleList>
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
    );
  }
}

export default RouteGeoList;

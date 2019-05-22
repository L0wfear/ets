import * as React from 'react';
import { PropsRouteGeoList } from 'components/new/pages/routes_list/route-info/geo-list/RouteGeoList.h';
import { get, uniqBy } from 'lodash';

import {
  RouteGeoListContainer,
  NameListLineContainer,
  TitleList,
  LiRouteManual,
} from 'components/new/pages/routes_list/route-info/geo-list/styled/styled';
import { DivNone } from 'global-styled/global-styled';
import { routeTypesByKey } from 'constants/route';
import { keyBy } from 'lodash';

import { polyState } from 'constants/polygons';
import { isArray } from 'util';

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

const RouteGeoList: React.FC<PropsRouteGeoList> = React.memo(
  (props) => {
    const { object_list, makeFailList } = props;

    const {
      nameObjectList,
      nameDrawObjectList,
      nameFailList,
    } = makeNameByProps(props.type);

    const fail_list: any = React.useMemo(
      () => {
        if (makeFailList && isArray(object_list)) {
          const objectIndex = keyBy(object_list, 'object_id');
          const drawObjectListIndex = keyBy(draw_object_list, 'object_id');

          return Object.values(props.polys).filter(
            ({ id }) => !objectIndex[id] && !drawObjectListIndex[id],
          );
        }

        return null;
      },
      [props.polys],
    );

    const draw_object_list = React.useMemo(
      () => {
        return props.draw_object_list.map((objectData) => ({
          ...objectData,
          isInvalid: !get(props.polys, `${objectData.objectData}.is_valid_company_structure`, true),
        }));
      },
      [props.polys, props.draw_object_list],
    );

    return (
      <RouteGeoListContainer height={props.height}>
        {object_list && object_list.length ? (
          <div>
            <NameListLineContainer>
              <TitleList>{nameObjectList}</TitleList>
              {object_list.map(({ type, ...data }, index) => {
                let title = data.name;
                let key = data.object_id;

                if (type === 'dt' || type === 'odh') {
                  title = `${title} (${
                    data.state === polyState.SELECTED_IDLING
                      ? 'холостой'
                      : 'рабочий'
                  } ход)`;
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

                return <li key={key}>{title}</li>;
              })}
            </NameListLineContainer>
          </div>
        ) : (
          <>
            <TitleList>Объекты отсутствуют в маршруте</TitleList>
            <DivNone />
          </>
        )}
        {draw_object_list && draw_object_list.length ? (
          <div>
            <NameListLineContainer>
              <TitleList>{nameDrawObjectList}</TitleList>
              {uniqBy(draw_object_list, (o) => o.name + o.state).map(
                ({ type, ...data }, key) => {
                  let title = data.name;

                  if (type === 'dt' || type === 'odh') {
                    title = `${title} (${
                      data.state === polyState.SELECTED_IDLING
                        ? 'холостой'
                        : 'рабочий'
                    } ход)`;
                  }
                  if (type === 'points') {
                    title = `Пункт назначения №${key + 1} (${title})`;
                  }

                  return <LiRouteManual key={key} isInvalid={data.isInvalid}>{title}</LiRouteManual>;
                },
              )}
            </NameListLineContainer>
          </div>
        ) : (
          <DivNone />
        )}
        {fail_list ? (
          <div>
            <NameListLineContainer>
              <TitleList>{nameFailList}</TitleList>
              {fail_list.map((data) => (
                <li key={data.id}>{data.name}</li>
              ))}
            </NameListLineContainer>
          </div>
        ) : (
          <DivNone />
        )}
      </RouteGeoListContainer>
    );
  },
);

export default RouteGeoList;

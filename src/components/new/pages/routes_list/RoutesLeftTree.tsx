import * as React from 'react';

import {
  map,
  get,
  cloneDeep,
} from 'lodash';

import {
  SidebarListContainer,
  SpanTitleRouteGroup,
} from 'components/new/pages/routes_list/styled/styled';

import { EMPTY_STUCTURE } from 'components/new/pages/routes_list/utils/utils';
import {
  RouteTreeContainer,
  RouteTreeH4,
  RouteTreeMenu,
  RouteTreeMenuArrow,
  TreeDivChildren,
  LiRouteName,
} from 'components/new/pages/routes_list/styled/styled';
import { onChangeWithKeys } from 'components/old/compositions/hoc';
import withMergeProps from 'components/old/compositions/vokinda-hoc/with-merge-props/WithMergeProps';
import { DivNone } from 'global-styled/global-styled';

const ExtRouteTreeMenu: any = onChangeWithKeys(
  withMergeProps(
    ({ boundKeys, ...props }) => props,
  )(RouteTreeMenu as any),
);

const LiRouteNameWrap: any = onChangeWithKeys(
  withMergeProps(
    ({ boundKeys, ...props }) => props,
  )(LiRouteName as any),
);

class RoutesLeftTree extends React.PureComponent<any, any> {
  handleDropdown = (name) => {
    const { showId: showIdOld } = this.props;
    const showId = cloneDeep(showIdOld);

    if (!showId.has(name)) {
      showId.add(name);
    } else {
      showId.delete(name);
    }

    this.props.changeShowId(showId);
  };

  renderItem = (collection, parentName) => {
    if (Array.isArray(collection)) {
      const selectedRouteId = get(this.props.selectedRoute, 'id', null);
      return collection.map((r) => {
        return (
          <LiRouteNameWrap
            key={r.id}
            active={r.id === selectedRouteId}
            onClick={this.props.selectRoute}
            boundKeys={r.id}
          >
            {r.name}
          </LiRouteNameWrap>
        );
      });
    }
    if (collection) {
      const [...arg] = Object.entries(collection);
      if (arg.length === 1 && arg[0][0] === EMPTY_STUCTURE) {
        return (
          <>
            {
              this.renderItem(arg[0][1], parentName + EMPTY_STUCTURE)
            }
          </>
        );
      }
    }

    return map(collection, (childrenCollection, name) => {
      const hidden = !this.props.showId.has(parentName + name);

      return (
        <div key={name}>
          <h5>
            <ExtRouteTreeMenu onClick={this.handleDropdown} boundKeys={`${parentName}${name}`}>
              {name}
              <RouteTreeMenuArrow>
                {!hidden ? ' \u25BC' : ' \u25BA'}
              </RouteTreeMenuArrow>
            </ExtRouteTreeMenu>
          </h5>
          {
            !hidden
              ? (
                <TreeDivChildren>
                  { this.renderItem(childrenCollection, parentName + name) }
                </TreeDivChildren>
              )
              : (
                <DivNone />
              )
          }
        </div>
      );
    });
  };

  render() {
    const {
      ROUTES,
    } = this.props;

    return (
      <RouteTreeContainer>
        <RouteTreeH4>
            Список маршрутов
        </RouteTreeH4>
        <SidebarListContainer>
          <div>
            <SpanTitleRouteGroup>Основные:</SpanTitleRouteGroup>
            {this.renderItem(ROUTES.main, 'main')}
          </div>
          <div>
            <SpanTitleRouteGroup className="second">Дополнительные:</SpanTitleRouteGroup>
            {this.renderItem(ROUTES.other, 'other')}
          </div>
        </SidebarListContainer>
      </RouteTreeContainer>
    );
  }
}

export default RoutesLeftTree;

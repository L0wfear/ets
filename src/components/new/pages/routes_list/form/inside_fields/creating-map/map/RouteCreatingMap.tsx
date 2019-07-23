import * as React from 'react';
import MapEts from 'components/new/ui/map/MapEts';

import LayerEditGeoobjRoute from 'components/new/pages/routes_list/form/inside_fields/creating-map/map/layers/layer-edit-geoobj-route/LayerEditGeoobjRoute';
import LayerShowPointsRoute from 'components/new/pages/routes_list/form/inside_fields/creating-map/map/layers/layer-show-points-route/LayerShowPointsRoute';
import LayerEditDrawRoute from 'components/new/pages/routes_list/form/inside_fields/creating-map/map/layers/layer-edit-draw-route/LayerEditDrawRoute';
import LayerBridgesRoute from 'components/new/pages/routes_list/form/inside_fields/creating-map/map/layers/layer-bridges-route/LayerBridgesRoute';

import { MapEtsContainer } from 'components/new/pages/routes_list/form/inside_fields/creating-map/map/styled/styled';

import { MapEtsConsumer } from 'components/new/ui/map/context/MapetsContext';
import { DivNone } from 'global-styled/global-styled';

import LayerDraw from 'components/new/ui/map/layers/default/layer-draw/LayerDraw';
import { checkRouteHasObjectLineByBegCoor } from 'components/new/pages/routes_list/form/inside_fields/creating-map/map/utils/utils';
import { CACHE_ROUTE_DRAW_STYLES } from 'components/new/pages/routes_list/form/inside_fields/creating-map/map/utils/draw-styles';

import RouteDrawButtons from 'components/new/pages/routes_list/form/inside_fields/creating-map/map/draw-buttons/RouteDrawButtons';
import { ModifyBridgesForRoute } from 'components/new/pages/routes_list/form/RouteForm.h';

/**
 * @todo описать polys
 * @todo нормально описать пропсы
 */
type PropsRouteCreatingMap = {
  bridges?: ModifyBridgesForRoute;
  disabled?: boolean;
  handleFeatureClick: any;
  handleDrawFeatureClick: any;
  drawObjectList: {
    object_id: number,
    shape: object,
    type: 'odh' | 'dt' | 'points',
  }[],
  objectsType: 'mixed' | 'simple_dt' | 'points',
  objectList: {
    frontId?: number,
    object_id: number | void;
    shape: object;
    type: 'odh' | 'dt' | 'points',
  }[];
  manual?: boolean;
  handleClickOnStartDraw: () => any;
  canDraw: boolean;
  [key: string]: any;
};

type StatePropsRouteCreatingMap = {
};

class RouteCreatingMap extends React.PureComponent<PropsRouteCreatingMap, StatePropsRouteCreatingMap> {
  handleClickOnRemove = () => {
    this.props.handleRemoveLastDrawFeature();
  }

  handleEndDraw = (coordinatesArr, distance, type, lines) => {
    const { objectsType } = this.props;

    if (objectsType === 'mixed') {
      const { drawObjectList } = this.props;
      let index = drawObjectList ? drawObjectList.length : 1;

      const drawLines = [];

      lines.forEach((coordinates) => {
        const routeHasObject = checkRouteHasObjectLineByBegCoor(drawObjectList, coordinates);

        if (!routeHasObject) {
          drawLines.push({
            begin: { x_msk: coordinates[0][0], y_msk: coordinates[0][1] },
            end: { x_msk: coordinates[1][0], y_msk: coordinates[1][1] },
            state: 2,
            object_id: index,
            distance,
            shape: {
              type,
              coordinates,
            },
          });

          index += 1;
        }
      });

      if (drawLines.length) {
        this.props.handleAddDrawLines(drawLines);
      }
    }
    if (objectsType === 'points') {
      const newPointObject = {
        shape: {
          type,
          coordinates: coordinatesArr,
        },
        coordinates: coordinatesArr,
        name: '',
      };

      this.props.handlePointAdd({ newPointObject });
    }
  }

  render() {
    const { props } = this;
    const {
      objectsType,
      objectList,
      drawObjectList,
      disabled,
      manual,
      canDraw,
    } = props;

    return (
      <MapEtsContainer>
        <MapEtsConsumer>
        {
          ({ setMapToContext, removeMapToContext }) => (
            <MapEts
              enableInteractions={!disabled}
              disabledMouseSingleClick={disabled || manual}
              setMapToContext={setMapToContext}
              removeMapToContext={removeMapToContext}
              mapKey="routeCreatingForm"
            >
              {
                ({ map, centerOn }) => (
                  <>
                    {
                      objectsType === 'mixed' || objectsType === 'simple_dt'
                      ? (
                        <LayerEditGeoobjRoute
                          focusOnSelectedGeo={this.props.focusOnSelectedGeo}
                          map={map}
                          geoobjects={props.polys}
                          centerOn={centerOn}
                          handleFeatureClick={props.handleFeatureClick}
                        />
                      )
                      : (
                        <DivNone />
                      )
                    }
                    {
                      objectsType === 'points'
                      ? (
                        <LayerShowPointsRoute
                          map={map}
                          objectList={objectList}
                          centerOn={centerOn}
                          handleFeatureClick={props.handleFeatureClick}
                        />
                      )
                      : (
                        <DivNone />
                      )
                    }
                    <LayerEditDrawRoute
                      map={map}
                      drawObjectList={drawObjectList}
                      handleDrawFeatureClick={props.handleDrawFeatureClick}
                    />
                    {
                      manual && objectsType === 'mixed' || objectsType === 'points'
                      ? (
                        <LayerDraw
                          map={map}
                          type={objectsType === 'mixed' ? 'LineString' : 'Point'}
                          inDraw={manual}
                          handleEndDraw={this.handleEndDraw}
                          styled={CACHE_ROUTE_DRAW_STYLES.blue}
                        />
                      )
                      : (
                        <DivNone />
                      )
                    }
                    {
                      objectsType === 'mixed' && canDraw
                      ? (
                        <RouteDrawButtons
                          disabledDraw={disabled}
                          disabledRemove={disabled || !drawObjectList || !drawObjectList.length || manual}
                          hidden={this.props.disabled || this.props.objectsType === 'points' || !objectList || !objectList.length}
                          handleClickOnStartDraw={this.props.handleClickOnStartDraw}
                          handleClickOnRemove={this.handleClickOnRemove}
                        />
                      )
                      : (
                        <DivNone />
                      )
                    }
                    <LayerBridgesRoute
                      map={map}
                      bridges={props.bridges}
                    />
                  </>
                )
              }
            </MapEts>
          )
        }
        </MapEtsConsumer>
      </MapEtsContainer>
    );
  }
}

export default RouteCreatingMap;

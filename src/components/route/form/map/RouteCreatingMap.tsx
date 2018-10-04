import * as React from 'react';
import MapEts from 'components/map/MapEts';
/*
import LayerMeasure from 'components/map/layers/measure/LayerMeasure';
*/

import LayerEditGeoobjRoute from 'components/route/form/map/layers/layer-edit-geoobj-route/LayerEditGeoobjRoute';
import LayerShowPointsRoute from 'components/route/form/map/layers/layer-show-points-route/LayerShowPointsRoute';
import LayerEditDrawRoute from 'components/route/form/map/layers/layer-edit-draw-route/LayerEditDrawRoute';

import { MapEtsContainer } from 'components/route/form/map/styled/styled';

import { MapEtsConsumer } from 'components/map/context/MapetsContext';
import { DivNone } from 'global-styled/global-styled';

import LayerDraw from 'components/map/layers/default/layer-draw/LayerDraw';
import { checkRouteHasObjectLineByBegCoor } from 'components/route/form/map/utils/utils';
import { CACHE_ROUTE_DRAW_STYLES } from 'components/route/form/map/utils/draw-styles';

import RouteDrawButtons from 'components/route/form/map/draw-buttons/RouteDrawButtons';

/**
 * @todo описать polys
 * @todo нормально описать пропсы
 */
type PropsRouteCreatingMap = {
  disabled?: boolean;
  polys: object;
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
  [key: string]: any;
};

type StatePropsRouteCreatingMap = {
  inDraw: boolean;
};

class RouteCreatingMap extends React.PureComponent<PropsRouteCreatingMap, StatePropsRouteCreatingMap> {
  state = {
    inDraw: false,
  }

  static getDerivedStateFromProps(nextProps) {
    const {
      objectsType,
      drawObjectList,
      manual,
    } = nextProps;

    if ((objectsType === 'points' || objectsType === 'mixed') && manual) {
      if (!drawObjectList || !drawObjectList.length) {
        return {
          inDraw: true,
        };
      }
    }

    return null;
  }

  handleClickOnStartDraw = () => {
    this.setState({ inDraw: !this.state.inDraw });
  }

  handleClickOnRemove = () => {
    this.props.handleRemoveLastDrawFeature();
  }

  handleEndDraw = (coordinatesArr, distance, type, lines) => {
    const { objectsType } = this.props;

    if (objectsType === 'mixed') {
      const { drawObjectList } = this.props;
      let index = drawObjectList ? drawObjectList.length : 1;

      const drawLines = [];

      lines.forEach(coordinates => {
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
      this.setState({ inDraw: false });
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
    } = props;
    const {
      inDraw,
    } = this.state;

    return (
      <MapEtsContainer>
        <MapEtsConsumer>
        {
          ({ setMapToContext, removeMapToContext }) => (
            <MapEts
              enableInteractions={!disabled}
              disabledMouseSingleClick={disabled || inDraw}
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
                      manual && (objectsType === 'mixed' || objectsType === 'points')
                      ? (
                        <LayerDraw
                          map={map}
                          type={objectsType === 'mixed' ? 'LineString' : 'Point'}
                          inDraw={this.state.inDraw}
                          handleEndDraw={this.handleEndDraw}
                          styled={CACHE_ROUTE_DRAW_STYLES.blue}
                        />
                      ): (
                        <DivNone />
                      )
                    }
                    {
                      objectsType === 'mixed' && manual
                      ? (
                        <RouteDrawButtons
                          disabledDraw={disabled || !drawObjectList || !drawObjectList.length}
                          disabledRemove={disabled || !drawObjectList || !drawObjectList.length || inDraw}
                          hidden={this.props.disabled || this.props.objectsType === 'points' || !objectList || !objectList.length}
                          handleClickOnStartDraw={this.handleClickOnStartDraw}
                          handleClickOnRemove={this.handleClickOnRemove}
                        />
                      )
                      : (
                        <DivNone />
                      )
                    }
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

export default RouteCreatingMap

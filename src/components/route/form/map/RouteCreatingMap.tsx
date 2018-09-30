import * as React from 'react';
import { cloneDeep } from 'lodash';
import MapEts from 'components/map/new/MapEts';
/*
import LayerMeasure from 'components/map/new/layers/measure/LayerMeasure';
*/

import LayerEditGeoobjRoute from 'components/route/form/map/layers/layer-edit-geoobj-route/LayerEditGeoobjRoute';
import LayerShowPointsRoute from 'components/route/form/map/layers/layer-show-points-route/LayerShowPointsRoute';
import LayerEditDrawRoute from 'components/route/form/map/layers/layer-edit-draw-route/LayerEditDrawRoute';

import { MapEtsContainer } from 'components/route/form/map/styled/styled';

import { MapEtsConsumer } from 'components/map/new/context/MapetsContext';
import { DivNone } from 'global-styled/global-styled';

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
};

class RouteCreatingMap extends React.PureComponent<PropsRouteCreatingMap, StatePropsRouteCreatingMap> {
  render() {
    const { props } = this;

    console.log(cloneDeep(props));
    return (
      <MapEtsContainer>
        <MapEtsConsumer>
        {
          ({ setMapToContext, removeMapToContext }) => (
            <MapEts
              enableInteractions={!props.disabled}
              setMapToContext={setMapToContext}
              removeMapToContext={removeMapToContext}
              mapKey="routeCreatingForm"
            >
              {
                ({ map, centerOn }) => (
                  <>
                    <LayerEditGeoobjRoute
                      map={map}
                      geoobjects={props.polys}
                      handleFeatureClick={props.handleFeatureClick}
                      centerOn={centerOn}
                      />
                    {
                      props.objectsType === 'points'
                      ? (
                        <LayerShowPointsRoute
                          map={map}
                          objectList={props.objectList}
                          handleFeatureClick={props.handleFeatureClick}
                          centerOn={centerOn}
                        />
                      )
                      : (
                        <DivNone />
                      )
                    }
                    
                    <LayerEditDrawRoute
                      map={map}
                      drawObjectList={props.drawObjectList}
                      handleDrawFeatureClick={props.handleDrawFeatureClick}
                    />
                  {
                    /*
                    <LayerMeasure map={map} />
                    */
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

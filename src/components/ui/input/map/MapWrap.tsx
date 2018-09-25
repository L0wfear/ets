import * as React from 'react';

import { FluxContext } from 'utils/decorators';

import { IMapWrapProps, IMapWrapState } from 'components/ui/input/map/@types/MapWrap.h';

import {
  getNextStateForFeatureByState,
  checkRouteHasObjectByBegCoor,
  findIndexDrawObjectById,
} from 'components/ui/input/map/utils/index';

import { polyState } from 'constants/polygons';

import DrawMap from 'components/map/DrawMap';
import PolyMap from 'components/map/PolyMap';

const DrawMapTSX: any = DrawMap;
const PolyMapTSX: any = PolyMap;

@FluxContext
class MapWrap extends React.Component<IMapWrapProps, IMapWrapState> {
  constructor(props, context) {
    super(props);

    const sessionStore = context.flux.getStore('session');

    this.state = {
      zoom: sessionStore.getCurrentUser().getCompanyMapConfig().zoom,
      center: sessionStore.getCurrentUser().getCompanyMapConfig().coordinates,
    };
  }

  startDraw = () => {
    if (typeof this.props.startDraw === 'function') {
      this.props.startDraw();
    }
  }

  onFeatureClick = feature => {
    const { id, name, state } = feature.getProperties();
    const { polys } = this.props;

    if (polys[id] && state) {
      const nextState = getNextStateForFeatureByState(state);

      try {
        this.props.handleFeatureClick({ id, name, nextState });
      } catch ({ error_text }) {
        /* tslint:disable:no-console */
        console.warn('define handleFeatureClick in father');
        console.warn(error_text);
        /* tslint:enable */
      }
    }
  }
  onPointAdd = coordinates => {
    try {
      const newPointObject = {
        coordinates,
        name: '',
      };

      this.props.handlePointAdd({ newPointObject });
    } catch (e) {
      /* tslint:disable:no-console */
      console.warn('define handlePointAdd in father');
      /* tslint:enable */
    }
  }
  onDrawFeatureAdd = (feature, coordinates, distance) => {
    const { id } = feature.getProperties();
    const { drawObjectList } = this.props;

    const routeHasObject = checkRouteHasObjectByBegCoor(drawObjectList, coordinates);

    if (!routeHasObject) {
      const drawObjectNew = {
        begin: { x_msk: coordinates[0][0], y_msk: coordinates[0][1] },
        end: { x_msk: coordinates[1][0], y_msk: coordinates[1][1] },
        state: 2,
        object_id: id,
        distance,
      };

      try {
        this.props.handleDrawFeatureAdd({ drawObjectNew });
      } catch (e) {
        /* tslint:disable:no-console */
        console.warn('define handleDrawFeatureAdd in father');
        /* tslint:enable */
      }
    }
  }
  onDrawFeatureClick = feature => {
    const { id, state } = feature.getProperties();

    if (state) {
      const { drawObjectList = [] } = this.props;

      const { index, isFind } = findIndexDrawObjectById(drawObjectList, id);

      if (isFind) {
        const nextState = getNextStateForFeatureByState(state, {
          ENABLED: polyState.IDLE,
          IDLE: polyState.ENABLED,
        });

        try {
          this.props.handleDrawFeatureClick({ index, nextState });
        } catch (e) {
          /* tslint:disable:no-console */
          console.warn('define handleDrawFeatureClick in father');
          /* tslint:enable */
        }
      }
    }

  }
  removeLastDrawFeature = (...arg) => {
    try {
      this.props.handleRemoveLastDrawFeature();
    } catch (e) {
      /* tslint:disable:no-console */
      console.warn('define removeLastDrawFeature in father');
      /* tslint:enable */
    }
  }

  render() {
    const {
      zoom,
      center,
    } = this.state;

    const {
      disabled = false,
      objectsType,
      manual,
      polys,
      objectList,
      drawObjectList,
    } = this.props;

    if (manual) {
      return (
        <DrawMapTSX
          disabled={disabled}
          polys={polys}
          object_list={objectList}
          objectsType={objectsType}
          startDraw={this.startDraw}
          onPointAdd={this.onPointAdd}
          draw_object_list={drawObjectList}
          onDrawFeatureAdd={this.onDrawFeatureAdd}
          onDrawFeatureClick={this.onDrawFeatureClick}
          removeLastDrawFeature={this.removeLastDrawFeature}
        />
      );
    }

    return (
      <PolyMapTSX
        disabled={disabled}
        zoom={zoom}
        polys={polys}
        center={center}
        objectsType={objectsType}
        draw_object_list={drawObjectList}
        onFeatureClick={this.onFeatureClick}
      />
    );
  }
}

export default MapWrap;

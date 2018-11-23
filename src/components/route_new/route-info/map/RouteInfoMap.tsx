import * as React from 'react';
import { connect } from 'react-redux';

import { loadGeozones } from 'redux-main/trash-actions/geometry/geometry';

import MapEts from 'components/map/MapEts';

import { MapEtsContainer } from 'components/route_new/route-info/map/styled/styled';

import {
  PropsMapGeoobjectWrap,
  StateMapGeoobjectWrap,
} from 'components/route_new/route-info/map/RouteInfoMap.h';
import { GEOOBJECTS_OBJ } from 'constants/geoobjects-new';
import { routeTypesByKey } from 'constants/route';

import LayerRouteInfoGeometry from 'components/route_new/route-info/map/layers/layer-route-info-geometry/LayerRouteInfoGeometry';
import { isNumber } from 'util';

import { MapEtsConsumer } from 'components/map/context/MapetsContext';

const makeObjectListWithShape = (object_list) => (
  object_list.map((data) => ({
    ...data,
    object_id: isNumber(data.frontId) || data.frontId ? data.frontId : data.object_id,
    original_object_id: data.object_id,
    shape: data.shape || null,
  }))
);

class MapGeoobjectWrap extends React.PureComponent<PropsMapGeoobjectWrap, StateMapGeoobjectWrap> {
  state = {
    object_list: [],
    objectList: [],
  };

  static getDerivedStateFromProps(nextProps: PropsMapGeoobjectWrap, prevState: StateMapGeoobjectWrap) {
    const { object_list } = nextProps;

    if (object_list !== prevState.object_list) {
      return {
        object_list,
        objectList: makeObjectListWithShape(object_list),
      };
    }

    return null;
  }

  componentDidMount() {
    const { type } = this.props;

    if (type === 'mixed' || type === 'simple_dt') {
      this.loadByGeometryType(type);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.object_list !== this.props.object_list) {
      const { type } = this.props;

      if (type === 'mixed' || type === 'simple_dt') {
        this.loadByGeometryType(type);
      }
    }
  }

  loadByGeometryType(type: 'mixed' | 'simple_dt') {
    const { serverName } = GEOOBJECTS_OBJ[routeTypesByKey[type].slug];

    this.props.loadGeozones(serverName).then(({ payload: { [serverName]: geoData} }) => {
      this.setState({
        objectList: this.state.objectList.map((data) => ({
          ...data,
          shape: geoData[`${serverName}/${data.object_id}`].shape,
        })),
      });
    });
  }

  render() {
    const { props } = this;

    return (
      <MapEtsContainer width={props.width} height={props.height}>
        <MapEtsConsumer>
        {
          ({ setMapToContext, removeMapToContext }) => (
            <MapEts
              enableInteractions
              setMapToContext={setMapToContext}
              removeMapToContext={removeMapToContext}
              mapKey={this.props.mapKey}
              rotationAngle={this.props.rotationAngle}
            >
              {
                ({ map, centerOn }) => (
                  <>
                    <LayerRouteInfoGeometry
                      map={map}
                      centerOn={centerOn}
                      geoobjectsArr={this.state.objectList}
                      inputLines={this.props.input_lines}
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

const mapDispatchToProps = (dispatch) => ({
  loadGeozones: (serverName) => (
    dispatch(
      loadGeozones(
        'none',
        serverName,
        {
          promise: true,
          page: 'any',
          path: 'routeInfo',
        },
      ),
    )
  ),
});

export default connect(
  null,
  mapDispatchToProps,
)(MapGeoobjectWrap);

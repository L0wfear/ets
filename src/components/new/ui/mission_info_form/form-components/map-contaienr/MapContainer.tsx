import * as React from 'react';

import MapMissionInfoWrap from 'components/new/ui/mission_info_form/form-components/map-contaienr/map/MapMissionInfoWrap';
import ToolBar from 'components/new/ui/mission_info_form/form-components/map-contaienr/tool-bar/ToolBar';

import { MapContainerDiv } from 'components/new/ui/mission_info_form/form-components/map-contaienr/styled/styled';

import {
  PropsMapContainer,
  StateMapContainer,
} from 'components/new/ui/mission_info_form/form-components/map-contaienr/MapContainer.h';

class MapContainer extends React.PureComponent<PropsMapContainer, StateMapContainer> {
  state = {
    SHOW_GEOOBJECTS: true,
    SHOW_TRACK: true,
    geoobjects: this.props.geoobjects,
    inputLines: this.props.inputLines,
    track: this.props.track,
    front_parkings: this.props.front_parkings,
  };

  static getDerivedStateFromProps(nextProps: PropsMapContainer, state: StateMapContainer) {
    const {
      SHOW_TRACK,
      SHOW_GEOOBJECTS,
    } = state;

    const changeStateObj: any = {};

    if (SHOW_TRACK) {
      changeStateObj.track = nextProps.track;
      changeStateObj.front_parkings = nextProps.front_parkings;
    }

    if (SHOW_GEOOBJECTS) {
      changeStateObj.geoobjects = nextProps.geoobjects;
      changeStateObj.inputLines = nextProps.inputLines;
    }

    return changeStateObj;
  }

  toggleStatusShow = (key: 'SHOW_TRACK' | 'SHOW_GEOOBJECTS') => {
    const changeStateObj = {
      ...this.state,
    };

    if (key === 'SHOW_TRACK') {
      const SHOW_TRACK = !changeStateObj.SHOW_TRACK;

      changeStateObj.track = SHOW_TRACK ? this.props.track : [];
      changeStateObj.front_parkings = SHOW_TRACK ? this.props.front_parkings : [];
      changeStateObj.SHOW_TRACK = SHOW_TRACK;
    }

    if (key === 'SHOW_GEOOBJECTS') {
      const SHOW_GEOOBJECTS = !changeStateObj.SHOW_GEOOBJECTS;

      changeStateObj.geoobjects = SHOW_GEOOBJECTS ? this.props.geoobjects : {};
      changeStateObj.inputLines = SHOW_GEOOBJECTS ? this.props.inputLines : [];
      changeStateObj.SHOW_GEOOBJECTS = SHOW_GEOOBJECTS;
    }

    this.setState({ ...changeStateObj });
  }

  render() {
    const {
      state, props,
      props: { speed_limits },
    } = this;

    return (
      <MapContainerDiv>
        <MapMissionInfoWrap
          gov_number={props.gov_number}
          gps_code={props.gps_code}
          geoobjects={state.geoobjects}
          inputLines={state.inputLines}
          track={state.track}
          parkings={state.front_parkings}
          speed_lim={speed_limits.speed_lim}
          mkad_speed_lim={speed_limits.mkad_speed_lim}
          cars_sensors={props.cars_sensors}
          missionNumber={props.missionNumber}
        />
        <ToolBar
          SHOW_TRACK={state.SHOW_TRACK}
          SHOW_GEOOBJECTS={state.SHOW_GEOOBJECTS}
          toggleStatusShow={this.toggleStatusShow}
          has_mkad={props.has_mkad}
          object_type_name={props.object_type_name}
          speed_limits={speed_limits}
        />
      </MapContainerDiv>
    );
  }
}

export default MapContainer;

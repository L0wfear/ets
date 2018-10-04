import * as React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';
import config from 'config';
import Preloader from 'components/ui/new/preloader/Preloader';
import { getMaxSpeedToLegend } from 'components/monitor/info/car-info/car-main-data-block/utils';
import { carInfoToggleStatusTCFollowOnCar } from 'components/monitor/info/car-info/redux-main/modules/actions-car-info';
import {
  CAR_INFO_SET_TRACK_CACHING,
} from 'components/monitor/info/car-info/redux-main/modules/car-info';

type PropsCarMainDataBlock = {
  maxSpeed: number;
  type_image_name: string;
  STATUS_TC_FOLLOW_ON_CAR: boolean;
  disabledFollow: boolean;
  disabledShowTrack: boolean;
  carInfoToggleStatusTCFollowOnCar: any;
  carInfoToggleStatusTCShowTrack: any;
};

const CarMainDataBlock: React.SFC<PropsCarMainDataBlock> = ({ type_image_name, maxSpeed, STATUS_TC_FOLLOW_ON_CAR, ...props }) => (
  <div className="car_info-main_data_container">
    <div className="car_info_block">
      <div>
        <div className="legend-color">
          <div className="car_info-legend-color red"></div>
          <div>{`0-${maxSpeed} км/ч`}</div>
        </div>
        <div className="legend-color">
          <div className="car_info-legend-color green"></div>
          <div>{`+${maxSpeed + 1} км/ч`}</div>
        </div>
      </div>
      <div className="car_info-img">
      {
        type_image_name !== '' ?
        <img role="presentation" className="car-info-image" src={!!type_image_name ? `${config.images}${type_image_name}` : ''} />
        :
        <Preloader typePreloader="field" />
      }
      </div>
      <div>
        <Button disabled={props.disabledFollow} active={STATUS_TC_FOLLOW_ON_CAR} onClick={props.carInfoToggleStatusTCFollowOnCar} className="all-width" title="Следить за машиной">
          <Glyphicon glyph="screenshot" className="car_info-main_block-button inverse" />
          {STATUS_TC_FOLLOW_ON_CAR ? 'Следим' : 'Следить'}
        </Button>
        <Button disabled={STATUS_TC_FOLLOW_ON_CAR || props.disabledShowTrack} onClick={props.carInfoToggleStatusTCShowTrack} className="all-width">
          <Glyphicon glyph="resize-full" className="car_info-main_block-button" />
          Трек
        </Button>
      </div>
    </div>
  </div>
);

const mapStateToProps = state => ({
  type_image_name: (state.monitorPage.carActualGpsNumberIndex[state.monitorPage.carInfo.gps_code] || { type_image_name: ''}).type_image_name,
  STATUS_TC_FOLLOW_ON_CAR: state.monitorPage.carInfo.statusTC.FOLLOW_ON_CAR,
  maxSpeed: getMaxSpeedToLegend(state.monitorPage.carInfo),
  disabledFollow: state.monitorPage.carInfo.playTrack.status !== 'stop', 
  disabledShowTrack: state.monitorPage.carInfo.playTrack.status === 'play' || state.loading.loadingTypes.includes(CAR_INFO_SET_TRACK_CACHING) ? true : state.monitorPage.carInfo.trackCaching.track.length <= 1,
});

const mapDispatchToProps = (dispatch, props) => ({
  carInfoToggleStatusTCFollowOnCar: () => (
    dispatch(
      carInfoToggleStatusTCFollowOnCar(),
    )
  ),
  carInfoToggleStatusTCShowTrack: () => {
    props.map.getLayers().forEach((layer) => {
      if (layer.get('id') === 'TrackLines') {
        props.centerOn({ extent: layer.getSource().getExtent() });
      }
    });
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CarMainDataBlock);

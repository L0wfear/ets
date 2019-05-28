import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { connect } from 'react-redux';
import config from 'config';
import PreloadNew from 'components/ui/new/preloader/PreloadNew';

import { getMaxSpeedToLegend } from 'components/monitor/info/car-info/car-main-data-block/utils';
import { carInfoToggleStatusTCFollowOnCar } from 'components/monitor/info/car-info/redux-main/modules/actions-car-info';
import {
  BtnGroupWrapper,
  BtnPart,
} from 'global-styled/global-styled';
import { CarInfoBlock } from 'components/monitor/styled';
import { CarInfoMainDataContainer } from '.';

type PropsCarMainDataBlock = {
  maxSpeed: number;
  type_image_name: string;
  STATUS_TC_FOLLOW_ON_CAR: boolean;
  disabledFollow: boolean;
  disabledShowTrack: boolean;
  carInfoToggleStatusTCFollowOnCar: any;
  carInfoToggleStatusTCShowTrack: any;
};

class CarMainDataBlock extends React.Component<PropsCarMainDataBlock, {}> {
  render() {
    const {
      type_image_name,
      maxSpeed,
      STATUS_TC_FOLLOW_ON_CAR,
      ...props
    } = this.props;

    return (
      <CarInfoMainDataContainer>
        <CarInfoBlock>
          <div>
            <div className="legend-color">
              <div className="car_info-legend-color green"></div>
              <div>{`0-${maxSpeed} км/ч`}</div>
            </div>
            <div className="legend-color">
              <div className="car_info-legend-color red"></div>
              <div>{`+${maxSpeed + 1} км/ч`}</div>
            </div>
          </div>
          <div className="car_info-img">
          {
            type_image_name !== '' ?
            <img role="presentation" className="car-info-image" src={!!type_image_name ? `${config.images}${type_image_name}` : ''} />
            :
            <PreloadNew typePreloader="field" />
          }
          </div>
          <div>
            <BtnGroupWrapper vertical={true}>
              <BtnPart>
                <EtsBootstrap.Button disabled={props.disabledFollow} active={STATUS_TC_FOLLOW_ON_CAR} onClick={props.carInfoToggleStatusTCFollowOnCar} className="all-width" title="Следить за машиной">
                  <EtsBootstrap.Glyphicon glyph="screenshot" className="car_info-main_block-button inverse" />
                  {STATUS_TC_FOLLOW_ON_CAR ? 'Следим' : 'Следить'}
                </EtsBootstrap.Button>
              </BtnPart>
              <BtnPart>
                <EtsBootstrap.Button disabled={STATUS_TC_FOLLOW_ON_CAR || props.disabledShowTrack} onClick={props.carInfoToggleStatusTCShowTrack} className="all-width">
                  <EtsBootstrap.Glyphicon glyph="resize-full" className="car_info-main_block-button" />
                  Трек
                </EtsBootstrap.Button>
              </BtnPart>
            </BtnGroupWrapper>
          </div>
        </CarInfoBlock>
      </CarInfoMainDataContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  type_image_name: (state.monitorPage.carActualGpsNumberIndex[state.monitorPage.carInfo.gps_code] || { type_image_name: ''}).type_image_name,
  STATUS_TC_FOLLOW_ON_CAR: state.monitorPage.carInfo.statusTC.FOLLOW_ON_CAR,
  maxSpeed: getMaxSpeedToLegend(state.monitorPage.carInfo),
  disabledFollow: state.monitorPage.carInfo.playTrack.status !== 'stop',
  disabledShowTrack: state.monitorPage.carInfo.playTrack.status === 'play' || state.monitorPage.carInfo.trackCaching.track.length <= 1 || state.monitorPage.carInfo.trackCaching.error,
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CarMainDataBlock);

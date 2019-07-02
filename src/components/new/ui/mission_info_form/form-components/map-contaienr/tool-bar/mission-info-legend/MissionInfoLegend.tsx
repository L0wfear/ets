import * as React from 'react';
import * as cx from 'classnames';
import { getClassNameByType } from 'components/monitor/tool-bar/car-data/car-legend-status/utils';
import { DivNone } from 'global-styled/global-styled';
import { TrackTitleContainer, TrackLegentContainer } from './styled';

class MissionInfoLegend extends React.PureComponent<any, any> {
  handleClick: React.MouseEventHandler<HTMLDivElement> = ({ currentTarget: { dataset: { type } } }) => {
    this.props.toggleStatusShow(type);
  }

  render() {
    const {
      has_mkad,
      object_type_name,
      speed_limits: {
        mkad_speed_lim,
        speed_lim,
      },
    } = this.props;

    return (
      <span>
        <div className="tool_bar-block">
          <div className="default_cube">
            <div data-type="SHOW_TRACK" className={getClassNameByType(this.props, 'SHOW_TRACK')} onClick={this.handleClick}>
              <TrackTitleContainer>Трек:</TrackTitleContainer>
            </div>
            <TrackLegentContainer>
              <div className="car_block_legend left">
                <div className="legen_option not_allow">
                  <div className={`car_data-color track_green`}></div>
                  <div>{`0 - ${speed_lim} км/ч    ${object_type_name}`}</div>
                </div>
                <div className="legen_option not_allow">
                  <div className={`car_data-color track_red`}></div>
                  <div>{`${speed_lim}+ км/ч`}</div>
                </div>
                {
                  has_mkad ?
                  (
                    <>
                      <div key="devider">---------------------------</div>
                      <div className="legen_option not_allow">
                        <div className={`car_data-color track_green`}></div>
                        <div>{`0 - ${mkad_speed_lim} км/ч`}</div>
                        <div>{`${mkad_speed_lim}+ км/ч`}</div>
                      </div>
                      <div className="legen_option not_allow">
                        <div className={`car_data-color track_red`}></div>
                        <div>{`${mkad_speed_lim}+ км/ч`}</div>
                      </div>
                    </>
                  )
                  :
                  (
                    <DivNone />
                  )
                }
              </div>
            </TrackLegentContainer>
            <div data-type="SHOW_GEOOBJECTS" className={getClassNameByType(this.props, 'SHOW_GEOOBJECTS')} onClick={this.handleClick}>
              <div className={`car_data-color geoobject_un_select`}></div>
              <div>Маршрут</div>
            </div>
            <div className={cx(getClassNameByType(this.props, 'SHOW_GEOOBJECTS'), 'none-event')}>
              <div className={`car_data-color geoobject_mission_select`}></div>
              <div>ОДХ/ДТ</div>
            </div>
          </div>
        </div>
      </span>
    );
  }
}

export default MissionInfoLegend;

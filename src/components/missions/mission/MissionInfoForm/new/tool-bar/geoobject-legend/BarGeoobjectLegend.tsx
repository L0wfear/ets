import * as React from 'react';
import * as cx from 'classnames';
import { getClassNameByType } from 'components/monitor/new/tool-bar/car-data/car-legend-status/utils'

class BarGeoobjectLegend extends React.Component<any, any> {
  handleClick: React.MouseEventHandler<HTMLDivElement> = ({ currentTarget: { dataset: { type } } }) => {
    this.props.toggleStatusShow(type)
  }

  render() {
    return (
      <span>
        <div className="tool_bar-block">
          <div className="default_cube dark">
            <div data-type="SHOW_TRACK" className={getClassNameByType(this.props, 'SHOW_TRACK')} onClick={this.handleClick}>
              <div className={`car_data-color track_green`}></div>
              <div>Трек</div>
            </div>
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

export default BarGeoobjectLegend;

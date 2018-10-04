import * as React from 'react';
import { connect } from 'react-redux';
import * as cx from 'classnames';
import { monitorPageToggleStatusGeo } from 'components/monitor/redux-main/models/actions-monitor-page';

const getClassNameByType = (props, type) => (
  cx(
    'legen_option',
    'with_checkbox',
    {
      off: !props[type],
    }
  )
);

class BarGeoobjectLegend extends React.Component<any, any> {
  render() {
    return (
      <span>
        <div className="tool_bar-block">
          <div className="default_cube dark">
            <div data-type="SHOW_TRACK" onClick={this.props.toggleShowStatus} className={getClassNameByType(this.props, "SHOW_TRACK")}>
              <input readOnly type="checkbox" checked={this.props.SHOW_TRACK} />
              <div>Трек</div>
            </div>
            <div data-type="SHOW_GEOOBJECTS" onClick={this.props.toggleShowStatus} className={getClassNameByType(this.props, "SHOW_GEOOBJECTS")}>
              <input readOnly type="checkbox" checked={this.props.SHOW_GEOOBJECTS} />
              <div>Геообъекты</div>
            </div>
          </div>
        </div>
      </span>
    );
  }
}

const mapStateToProps = state => ({
  ...state.monitorPage.statusGeo,
});

const mapDispatchToProps = dispatch => ({
  toggleShowStatus: ({ currentTarget: { dataset: { type } } }) => (
    dispatch(
      monitorPageToggleStatusGeo([type]),
    )
  ),
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)
(BarGeoobjectLegend);

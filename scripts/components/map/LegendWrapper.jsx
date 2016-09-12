import React, { PropTypes } from 'react';
import { TRACK_COLORS } from 'constants/track.js';
import cx from 'classnames';

let ControlComponent = (props) =>
  <span>
    {props.control.color ? <button className={'status-filter-icon'} onClick={props.onClick} style={{ backgroundColor: props.control.color}}></button> : null}
    {props.control.title}
  </span>
;

/**
 * Легенда на карте
 */
export default class LegendWrapper extends React.Component {

  static propTypes = {
    zoom: PropTypes.number, // перенести
  }

  getControls() {
    let controls = [
      {
        title: 'Трек',
        color: this.props.zoom > 6 ? TRACK_COLORS.green : TRACK_COLORS.blue,
        type: 'track'
      },
      {
        title: 'Маршрут',
        color: TRACK_COLORS.red,
        type: 'route'
      },
      {
        title: 'ОДХ/ДТ',
        color: "#e67e22",
        type: 'element'
      }
    ];
    let finalControls = [];
    if (this.props.controls) {
      controls.map((c, i) => {
        if (this.props.controls.indexOf(c.type) > -1) {
          finalControls.push(c);
        }
      });
    } else {
      finalControls = controls;
    }
    return finalControls;
  }

  isComponentActive(type) {
    if ((type === 'track' && this.props.showTrack) ||
        (type === 'route' && this.props.showPolygons) ||
        (type === 'element' && this.props.showSelectedElement)) {
          return true;
        }
    return false;
  }

  toggleSettingsControl(type) {
    const { flux } = this.props;
    const settingsActions = flux.getActions('settings');
    switch (type) {
      case 'track':
        settingsActions.setShowTrack(!this.props.showTrack);
        break;
      case 'route':
        settingsActions.setShowPolygons(!this.props.showPolygons);
        break;
      case 'element':
        settingsActions.setShowSelectedElement(!this.props.showSelectedElement);
        break;
    }
  }

  render() {
    const { className = "legend-wrapper app-toolbar-fill controls-legend-wrapper",
      controlTitles = {} } = this.props;
    let marker = this.props.marker();
    let items = this.getControls()
      .map((control, i) => {
        let controllClassName = cx('control-element', {'half-visible': !this.isComponentActive(control.type)});
        control.title = controlTitles[control.type] || control.title;
        return (
          <li key={i} className={controllClassName} >
            <ControlComponent control={control}
                onClick={this.toggleSettingsControl.bind(this, control.type)}/>
            {this.props.zoom > 6 && control.type === 'track' && marker && marker.track ? marker.track.getLegend() : ''}
          </li>
        );
      });

    return (
      <div className={className}>
        <ul style={{paddingLeft: 0}}>
          {items}
        </ul>
      </div>
    );
  }
}

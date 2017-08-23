import * as React from 'react';

import { GEOOBJECTS_TYPES, GEOOBJECTS_TYPES_LABELS } from 'constants/geoobjects';

const BASE_GEOOBJECTS_LIST = [
  'dt',
  'odh',
  'ssp',
  'msp',
  'carpool',
  'fueling_water',
  'danger_zone',
  'pgm_store',
  'snow_storage',
];

const GORMOST_GEOOBJECTS_LIST = [
  'bridges',
];

const GEOOBJECTS_LIST = [
  ...BASE_GEOOBJECTS_LIST,
  ...GORMOST_GEOOBJECTS_LIST,
];

class ShowGeoobjectsCheckbox extends React.Component<any, any> {
  setSelectedPolysType(type) {
    const { selectedPolysTypes } = this.props;
    const alreadyChecked = selectedPolysTypes.indexOf(GEOOBJECTS_TYPES[type]) > -1;

    if (!alreadyChecked) {
      if (GORMOST_GEOOBJECTS_LIST.includes(type)) {
        this.props.flux.getActions('geoObjects').getGeozoneByTypeWithGeometry(type, 'GormostService', {});
      } else {
        this.props.flux.getActions('geoObjects').getGeozoneByTypeWithGeometry(type);
      }
    }

    this.props.flux.getActions('geoObjects').setSelectedPolysType(GEOOBJECTS_TYPES[type]);
  }
  setShowGeoobjects(show) {
    this.props.flux.getActions('geoObjects').setSelectedPolysType(null);
    this.props.flux.getActions('settings').setShowGeoobjects(show);
  }

  selectAllGeoobjects(checked) {
    const { selectedPolysTypes } = this.props;

    GEOOBJECTS_LIST
      .filter(g => checked
        ? selectedPolysTypes.indexOf(GEOOBJECTS_TYPES[g]) === -1
        : selectedPolysTypes.indexOf(GEOOBJECTS_TYPES[g]) > -1)
      .forEach(g => this.setSelectedPolysType(g));
  }
  render() {
    const { selectedPolysTypes } = this.props;
    const showGeoobjectsList = this.props.showGeoobjects;
    const listStyle: any = {};
    if (!showGeoobjectsList) {
      listStyle.display = 'none';
    }

    const allSelected = selectedPolysTypes.length === Object.keys(GEOOBJECTS_TYPES).length - 1;
    const geoObjectsList = GEOOBJECTS_LIST.map((type, index) =>
      <li key={index}>
        <div className="checkbox">
          <label style={{ fontSize: 13, fontWeight: 200 }}>
            <input
              type="checkbox"
              checked={selectedPolysTypes.indexOf(GEOOBJECTS_TYPES[type]) > -1}
              onChange={() => this.setSelectedPolysType(type)}
            />
            {GEOOBJECTS_TYPES_LABELS[type]}
          </label>
        </div>
      </li>,
    );

    return (
      <div className="app-toolbar-fill app-toolbar-show-geoobjects" >
        <div className="checkbox">
          <input
            style={{ marginLeft: 0 }}
            type="checkbox"
            checked={allSelected}
            onChange={e => this.selectAllGeoobjects(e.target.checked)}
          />
          <label
            style={{ fontSize: 13, fontWeight: 200, paddingLeft: 0, marginLeft: 20 }}
            onClick={() => this.setShowGeoobjects(!this.props.showGeoobjects)}
          >
            Объекты
            <span style={{ fontSize: 10, marginLeft: 3 }}>{this.props.showGeoobjects ? ' \u25BC' : ' \u25BA'}</span>
          </label>
        </div>
        <ul style={listStyle}>
          {geoObjectsList}
        </ul>
      </div>
    );
  }
}

export default ShowGeoobjectsCheckbox;

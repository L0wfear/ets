import * as React from 'react';

import { connectToStores } from 'utils/decorators';
import { GEOOBJECTS_TYPES, GEOOBJECTS_TYPES_LABELS, GEOOBJECTS_LIST, GORMOST_GEOOBJECTS_LIST } from 'constants/geoobjects';

export interface IPropsGeoObjectListItem {
  key: number;
  polysObjects: any[];
  type: string;
  onChange(e): void;
}

const GeoObjectListItem: React.SFC<IPropsGeoObjectListItem> = ({
  key,
  polysObjects,
  type,
  onChange,
}) =>
  <li key={key}>
  <div className="checkbox">
    <label style={{ fontSize: 13, fontWeight: 200 }}>
      <input
        type="checkbox"
        checked={polysObjects.indexOf(GEOOBJECTS_TYPES[type]) > -1}
        onChange={onChange}
      />
      {GEOOBJECTS_TYPES_LABELS[type]}
    </label>
  </div>
  </li>;

const gormostFilter = userPermissions => type =>
  GORMOST_GEOOBJECTS_LIST.includes(type) ? userPermissions.includes(`${type}.list`) : true;

const getGeoobjectTypes = userPermissions => Object.keys(GEOOBJECTS_TYPES)
  .filter(gormostFilter(userPermissions))
  .reduce((prev, curr) => ({
    ...prev,
    [curr]: GEOOBJECTS_TYPES[curr],
  }), {});

@connectToStores('session')
class ShowGeoobjectsCheckbox extends React.Component<any, any> {
  setSelectedPolysType(type) {
    const { polysObjects, userPermissions = [] } = this.props;
    const geoobjectTypes = getGeoobjectTypes(userPermissions);
    const alreadyChecked = polysObjects.indexOf(geoobjectTypes[type]) > -1;

    if (!alreadyChecked) {
      if (GORMOST_GEOOBJECTS_LIST.includes(type)) {
        this.props.flux.getActions('geoObjects').getGeozoneByTypeWithGeometry(type, 'GormostService', {});
      } else {
        this.props.flux.getActions('geoObjects').getGeozoneByTypeWithGeometry(type);
      }
    }

    this.props.flux.getActions('geoObjects').setSelectedPolysType(geoobjectTypes[type]);
  }
  setShowGeoobjects(show) {
    this.props.flux.getActions('geoObjects').setSelectedPolysType(null);
    this.props.flux.getActions('settings').setShowGeoobjects(show);
  }

  selectAllGeoobjects(checked) {
    const { polysObjects, userPermissions = [] } = this.props;
    const geoobjectTypes = getGeoobjectTypes(userPermissions);
    const geoObjectList = GEOOBJECTS_LIST.filter(gormostFilter(userPermissions));

    geoObjectList
      .filter(type => checked
        ? polysObjects.indexOf(geoobjectTypes[type]) === -1
        : polysObjects.indexOf(geoobjectTypes[type]) > -1)
      .forEach(type => this.setSelectedPolysType(type));
  }
  render() {
    const { polysObjects, userPermissions = [] } = this.props;
    const showGeoobjectsList = this.props.showGeoobjects;
    const geoObjectList = GEOOBJECTS_LIST.filter(gormostFilter(userPermissions));
    const geoobjectTypes = getGeoobjectTypes(userPermissions);
    const listStyle: any = {};
    if (!showGeoobjectsList) {
      listStyle.display = 'none';
    }

    const allSelected = polysObjects.length === Object.keys(geoobjectTypes).length - 1;
    const geoObjectsList = geoObjectList.map((type, index) =>
      <GeoObjectListItem
        key={index}
        polysObjects={polysObjects}
        type={type}
        onChange={() => this.setSelectedPolysType(type)}
      />,
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

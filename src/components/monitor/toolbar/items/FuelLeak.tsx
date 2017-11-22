import * as React from 'react';

import { connectToStores } from 'utils/decorators';

import { GEOOBJECTS_TYPES } from 'constants/geoobjects';
import { getStartOfToday, createValidDateTime } from 'utils/dates';

import { ExtField } from 'components/ui/Field.jsx';

@connectToStores(['objects', 'session'])
class FuelLeak extends React.Component<any, any> {
  state = {
    checkedShowLeak: false,
    showDateInterval: false,
    date_from: null,
    date_to: null,
  };

  selectAllGeoobjects = ({ target: { checked } }) => {
    const {
      date_from,
      date_to,
    } = this.state;

    this.setState({
      checkedShowLeak: checked,
    });
    if (checked) {
      if (!this.state.showDateInterval) {
        this.setShowGeoobjects(checked);
      }
      this.getData({ date_from: date_from || getStartOfToday(), date_to: date_to || new Date() });
    }
    console.log('select type', GEOOBJECTS_TYPES.leak);
    // возможно не верно
    // выбираешь что отображать
    // this.props.flux.getActions('geoObjects').setSelectedPolysType(GEOOBJECTS_TYPES.leak);
  }
  setShowGeoobjects = e => {
    this.setState({
      showDateInterval: !this.state.showDateInterval,
      date_from: getStartOfToday(),
      date_to: new Date(),
    });
  }

  handleChange = (key, val) => {
    const newDataInState = {
      [key]: val,
    };

    const {
      date_from,
      date_to,
      checkedShowLeak,
    } = this.state;

    const payload = {
      date_from,
      date_to,
      ...newDataInState,
    };

    this.setState(newDataInState);

    if (checkedShowLeak && !Object.keys(payload).some(d => !d)) {
      this.getData(payload);
    }
  }

  getData({ date_from, date_to }) {
    const type = '';
    const servicesApi = 'FuelEvent';
    const payload = {
      date_from: createValidDateTime(date_from),
      date_to: createValidDateTime(date_to),
      type: 'leak',
    };
    console.log(type, servicesApi, payload);
    // запрос на получение данных по сливам
    // getGeozoneByTypeWithGeometryNoJSONShape - её нет, можешь назвать по другому
    // this.props.flux.getActions('geoObjects').getGeozoneByTypeWithGeometryNoJSONShape(type, servicesApi, payload);
  }

  render() {
    const {
      checkedShowLeak = false,
      showDateInterval = false,
    } = this.state;
    return (
      <div className={`app-toolbar-fill app-toolbar-show-fuelleak ${showDateInterval ? 'active' : ''}`} >
        <div className="checkbox">
          <input
            style={{ marginLeft: 0 }}
            type="checkbox"
            checked={checkedShowLeak}
            onChange={this.selectAllGeoobjects}
          />
          <label
            style={{ fontSize: 13, fontWeight: 200, paddingLeft: 0, marginLeft: 20 }}
            onClick={this.setShowGeoobjects}
          >
            Сливы
            <span style={{ fontSize: 10, marginLeft: 3 }}>{showDateInterval ? ' \u25BC' : ' \u25BA'}</span>
          </label>
          {
            showDateInterval &&
            <div className="date-interval">
              <ExtField
                type="date"
                label="C"
                date={this.state.date_from}
                onChange={this.handleChange}
                boundKeys={['date_from']}
                className="inline-date-fuelleak"
              />
              <ExtField
                type="date"
                label="По"
                date={this.state.date_to}
                onChange={this.handleChange}
                boundKeys={['date_to']}
                className="inline-date-fuelleak"
              />
            </div>
          }
        </div>
      </div>
    );
  }
}

export default FuelLeak;

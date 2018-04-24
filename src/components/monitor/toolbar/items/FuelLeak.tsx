import * as React from 'react';

import { connectToStores } from 'utils/decorators';

import { getStartOfToday, createValidDateTime, diffDates } from 'utils/dates';

import { ExtField } from 'components/ui/Field.jsx';

@connectToStores(['objects', 'session'])
class FuelLeak extends React.Component<any, any> {
  state = {
    checkedShowLeak: false,
    showDatePicker: false,
    disableCheckbox: false,
    date_from: null,
    date_to: null,
    permitGetData: true,
  };

  clickOnLeaksCheckbox = ({ target: { checked } }) => {
    const { date_from, date_to, permitGetData } = this.state;

    this.setState({
      checkedShowLeak: checked,
    });

    if (!(date_from && date_to)) {
    this.setDefaultDates(date_from, date_to);
    }

    this.toggleDatePicker(checked);

    if (checked && permitGetData) {
      this.getData({ date_from: date_from || getStartOfToday(), date_to: date_to || new Date() });
    }

    this.props.flux.getActions('geoObjects').setSelectedPolysType('leak');
  }

  setDefaultDates = (date_from, date_to) => {
    this.setState({
      date_from: getStartOfToday(),
      date_to: new Date(),
    });
  }

  toggleDatePicker = booleanArgument => {
    this.setState({
      showDatePicker: booleanArgument,
    });
  }

  clickOnTriangle = () => {
    const { date_from, date_to, showDatePicker } = this.state;

    if (!(date_from && date_to)) {
      this.setDefaultDates(date_from, date_to);
    }
    this.toggleDatePicker(!showDatePicker);
  }

  handleChangeDate = (key, val) => {
    const newDataInState = { [key]: val };
    const { date_from, date_to, checkedShowLeak } = this.state;
    const actualDates = { date_from, date_to, ...newDataInState };

    if (diffDates(actualDates.date_from, actualDates.date_to) > 0) {
      this.setState({
        disableCheckbox: true,
        ...newDataInState,
      });

      global.NOTIFICATION_SYSTEM.notify({
        title: 'Внимание! Неправильно указан временной интервал.',
        message: 'Укажите, пожалуйста, время окончания позже времени начала, чтобы обновились объекты на карте',
        level: 'warning',
        dismissible: true,
        autoDismiss: 20,
      });
      return;
    }

    const payload = { date_from, date_to, ...newDataInState };

    this.setState({
      disableCheckbox: false,
      ...newDataInState,
    });

    if (checkedShowLeak && !Object.keys(payload).some(d => !d)) {
      this.getData(payload);
    }
  }

  getData({ date_from, date_to }) {
    const type = '';
    const payload = {
      date_from: createValidDateTime(date_from),
      date_to: createValidDateTime(date_to),
    };

    // запрос на получение данных по сливам
    this.props.flux.getActions('geoObjects').getGeozoneByTypeWithGeometryLeak(type, payload);
    this.setState({ permitGetData: false });
  }

  render() {
    const {
      checkedShowLeak = false,
      showDatePicker = false,
      disableCheckbox = false,
    } = this.state;
    return (
      <div className={`app-toolbar-fill app-toolbar-show-fuelleak ${showDatePicker ? 'active' : ''}`} >
        <div className="checkbox">
          <input
            style={{ marginLeft: 0 }}
            type="checkbox"
            checked={checkedShowLeak}
            disabled={disableCheckbox}
            onChange={this.clickOnLeaksCheckbox}
          />
          <label
            style={{ fontSize: 13, fontWeight: 200, paddingLeft: 0, marginLeft: 20 }}
            onClick={this.clickOnTriangle}
          >
            Сливы
            <span style={{ fontSize: 10, marginLeft: 3 }}>{showDatePicker ? ' \u25BC' : ' \u25BA'}</span>
          </label>
          {
            showDatePicker &&
            <div className="date-interval">
              <ExtField
                type="date"
                label="C"
                date={this.state.date_from}
                onChange={this.handleChangeDate}
                boundKeys={['date_from']}
                className="inline-date-fuelleak"
              />
              <ExtField
                type="date"
                label="По"
                date={this.state.date_to}
                onChange={this.handleChangeDate}
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

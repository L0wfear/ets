import * as moment from 'moment';
import * as _configure from 'react-widgets/lib/configure';
moment.locale('ru');

/**
 * based on react-widget-moment
 */

function getMoment(culture, value, format?) {
  return culture ? moment(value, format).locale(culture) : moment(value, format);
}

function endOfDecade(date) {
  return moment(date).add(10, 'year').add(-1, 'millisecond').toDate();
}

function endOfCentury(date) {
  return moment(date).add(100, 'year').add(-1, 'millisecond').toDate();
}

function momentLocalizer() {
  const localizer = {
    formats: {
      date: 'L',
      time: 'LT',
      default: 'lll',
      header: 'MMMM YYYY',
      footer: 'LL',
      weekday: 'dd',
      dayOfMonth: 'DD',
      month: 'MMM',
      year: 'YYYY',
      decade: function decade(date, culture, localizerOwn) {
        return localizerOwn.format(date, 'YYYY', culture) + ' - ' + localizerOwn.format(endOfDecade(date), 'YYYY', culture);
      },
      century: function century(date, culture, localizerOwn) {
        return localizerOwn.format(date, 'YYYY', culture) + ' - ' + localizerOwn.format(endOfCentury(date), 'YYYY', culture);
      },
    },
    firstOfWeek: function firstOfWeek(culture) {
      return moment.localeData(culture).firstDayOfWeek();
    },
    parse: function parse(value, format, culture) {
      if (!value) {
        return null;
      }
      const m = getMoment(culture, value, format);
      if (m.isValid()) {
        return m.toDate();
      }
      return null;
    },
    format: function format(value, _format, culture) {
      return getMoment(culture, value).format(_format);
    },
  };

  _configure.setDateLocalizer(localizer);
}

export default momentLocalizer;

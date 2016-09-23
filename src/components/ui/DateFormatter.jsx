import React, { PropTypes } from 'react';
import moment from 'moment';

export default function DateFormatter({ time = false, empty = '', date }) {
  if (!date) {
    return <div>{empty}</div>;
  }
  const formattedDate = moment(date).format(`${global.APP_DATE_FORMAT}${time ? ' HH:mm' : ''}`);
  return <div>{formattedDate}</div>;
}

DateFormatter.propTypes = {
  time: PropTypes.bool,
  empty: PropTypes.string,
  date: PropTypes.any,
};

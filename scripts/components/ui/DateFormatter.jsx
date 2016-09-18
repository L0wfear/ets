import React from 'react';
import moment from 'moment';

const DateFormatter = (props) => {
  const { time = false, empty = '' } = props;
  if (!props.date) {
    return <div>{empty}</div>;
  }
  const date = moment(props.date).format(`${global.APP_DATE_FORMAT}${time ? ' HH:mm' : ''}`);
  return <div>{date}</div>;
};

export default DateFormatter;

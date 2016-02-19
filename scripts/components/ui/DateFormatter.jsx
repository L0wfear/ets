import React from 'react';
import moment from 'moment';

let DateFormatter= (props) => {
  let { time = false, empty = '' } = props;
  if (!props.date) return <div>{empty}</div>;
  let date = moment(props.date).format(`${global.APP_DATE_FORMAT}${time ? ' HH:mm' : ''}`);
  return <div>{date}</div>
}

export default DateFormatter;

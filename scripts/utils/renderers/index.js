import React from 'react';
import { isEmpty } from 'utils/functions';

export function floatFixed3({ data }) {
  let value;
  try {
    value = !isEmpty(data) ? parseFloat(data).toFixed(3) : null;
  } catch (e) {
    console.log(e);
    value = 'Ошибка при обработке данных';
  }
  return <div>{value}</div>;
}

export function floatFixed1Percentage({ data }) {
  let value;
  try {
    value = !isEmpty(data) ? parseFloat(data).toFixed(1) + '%' : null;
  } catch (e) {
    console.log(e);
    value = 'Ошибка при обработке данных';
  }
  return <div>{value}</div>;
}

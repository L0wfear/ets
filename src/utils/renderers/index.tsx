import * as React from 'react';
import * as PropTypes from 'prop-types';
import { isEmpty } from 'utils/functions';

function floatFixed3({ data }) {
  let value;
  try {
    value = !isEmpty(data) ? parseFloat(data).toFixed(3) : null;
  } catch (e) {
    console.info(e); // eslint-disable-line
    value = 'Ошибка при обработке данных';
  }
  return <div>{value}</div>;
}

function floatFixed1Percentage({ data }) {
  let value;
  try {
    value = !isEmpty(data) ? `${parseFloat(data).toFixed(1)}%` : null;
  } catch (e) {
    console.info(e); // eslint-disable-line
    value = 'Ошибка при обработке данных';
  }
  return <div>{value}</div>;
}

floatFixed1Percentage.propTypes = {
  data: PropTypes.any,
};

export {
  floatFixed3,
  floatFixed1Percentage,
};

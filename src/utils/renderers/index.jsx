import React, { PropTypes } from 'react';
import { isEmpty } from 'utils/functions';

function floatFixed3({ data }) {
  let value;
  try {
    value = !isEmpty(data) ? parseFloat(data).toFixed(3) : null;
  } catch (e) {
    console.log(e); // eslint-disable-line no-console
    value = 'Ошибка при обработке данных';
  }
  return <div>{value}</div>;
}

floatFixed3.propTypes = {
  data: PropTypes.any,
};


function floatFixed1Percentage({ data }) {
  let value;
  try {
    value = !isEmpty(data) ? `${parseFloat(data).toFixed(1)}%` : null;
  } catch (e) {
    console.log(e); // eslint-disable-line no-console
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

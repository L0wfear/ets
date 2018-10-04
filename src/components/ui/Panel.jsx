import * as React from 'react';
import * as PropTypes from 'prop-types';

export default function Panel({ title, children }) {
  return (
    <div className="chart-wrapper">
      {title ? (
        <div className="chart-title">
          {title}
        </div>
      ) : ''}
      <div className="chart-stage" style={{ textAlign: 'center' }}>
        {children}
      </div>
    </div>
  );
}

Panel.propTypes = {
  title: PropTypes.any,
  children: PropTypes.node,
};

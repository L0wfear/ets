import React from 'react';

export default function Panel({ title, children }) {
  return (
    <div className="chart-wrapper">
      <div className="chart-title">
        {title}
      </div>
      <div className="chart-stage" style={{ textAlign: 'center' }}>
        {children}
      </div>
    </div>
  );
}

Panel.propTypes = {
  title: React.PropTypes.string,
  children: React.PropTypes.node,
};

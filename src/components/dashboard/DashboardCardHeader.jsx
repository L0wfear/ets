import React from 'react';
import Div from 'components/ui/Div.jsx';
import { Glyphicon } from 'react-bootstrap';
import cx from 'classnames';

const DashboardCardHeader = (props) => {
  const iconClassname = cx({ 'glyphicon-spin': props.loading });
  return (
    <Div>
      <Div className="dashboard-card-title">{props.title}</Div>
      <Div onClick={props.onClick} className="dashboard-card-refresh"><Glyphicon className={iconClassname} glyph="refresh" /></Div>
    </Div>
  );
};

export default DashboardCardHeader;

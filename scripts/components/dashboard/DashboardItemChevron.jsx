import React from 'react';
import Div from 'components/ui/Div.jsx';
import { Glyphicon } from 'react-bootstrap';
import cx from 'classnames';

let DashboardItemChevron = (props) => {

  if (props.direction === 'left') {
    return (
      <Div className="card-chevron-left" hidden={props.hidden}>
        <Glyphicon glyph="menu-left"/>
      </Div>
    );
  }

  return (
    <Div className="card-chevron-right" hidden={props.hidden}>
      <Glyphicon glyph="menu-right"/>
    </Div>
  );

}

export default DashboardItemChevron;

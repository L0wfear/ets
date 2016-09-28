import React, { PropTypes } from 'react';
import Div from 'components/ui/Div.jsx';
import { Glyphicon } from 'react-bootstrap';

// TODO переделать в реюзабл компонент Chevron

export default function Chevron(props) {
  if (props.direction === 'left') {
    return (
      <Div className="card-chevron-left" hidden={props.hidden}>
        <Glyphicon glyph="menu-left" />
      </Div>
    );
  }

  return (
    <Div className="card-chevron-right" hidden={props.hidden}>
      <Glyphicon glyph="menu-right" />
    </Div>
  );
}

Chevron.propTypes = {
  direction: PropTypes.string,
  hidden: PropTypes.bool,
};

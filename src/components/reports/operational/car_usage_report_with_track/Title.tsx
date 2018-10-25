import * as React from 'react';
import * as Popover from 'react-bootstrap/lib/Popover';
import * as OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';

interface IPropsTitle {
  hint: string;
  text: string;
}

const Title: React.StatelessComponent<IPropsTitle> = props => {
  const popover = (
    <Popover id="car-usage-title-popover" className="car-usage-report-title__popover">
      {props.hint}
    </Popover>
  );

  return (
    <div className="car-usage-report-title">
      <span>{props.text}</span>
      <OverlayTrigger
        trigger={['hover', 'focus']}
        overlay={popover}
        placement="right"
      >
        <Glyphicon glyph="info-sign" className="car-usage-report-title__info-sign" />
      </OverlayTrigger>
    </div>
  );
};

export default Title;

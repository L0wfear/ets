import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';

interface IPropsTitle {
  hint: string;
  text: string;
}

const Title: React.StatelessComponent<IPropsTitle> = (props) => {
  const popover = (
    <EtsBootstrap.Popover id="car-usage-title-popover" className="car-usage-report-title__popover">
      {props.hint}
    </EtsBootstrap.Popover>
  );

  return (
    <div className="car-usage-report-title">
      <span>{props.text}</span>
      <EtsBootstrap.OverlayTrigger
        trigger={['hover', 'focus']}
        overlay={popover}
        placement="right"
      >
        <EtsBootstrap.Glyphicon glyph="info-sign" className="car-usage-report-title__info-sign" />
      </EtsBootstrap.OverlayTrigger>
    </div>
  );
};

export default Title;

import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import styled from 'styled-components';

type IPropsTitle = {
  hint: string;
  text: string;
};

const TitleStyled = styled.div`
  display: 'flex';
  align-items: 'center';
`;

const Title: React.FC<IPropsTitle> = (props) => {
  const popover = (
    <EtsBootstrap.Popover id="car-usage-title-popover" className="car-usage-report-title__popover">
      {props.hint}
    </EtsBootstrap.Popover>
  );

  return (
    <TitleStyled>
      <span>{props.text}</span>
      {
        Boolean(props.hint)
        && <EtsBootstrap.OverlayTrigger
          trigger={['hover', 'focus']}
          overlay={popover}
          placement="right"
        >
          <EtsBootstrap.Glyphicon glyph="info-sign" className="car-usage-report-title__info-sign" />
        </EtsBootstrap.OverlayTrigger>
      }
    </TitleStyled>
  );
};

export default Title;

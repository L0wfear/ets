import * as React from 'react';
import styled from 'styled-components';

import { DivNone } from 'global-styled/global-styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';

// types
export type TriggerDateProps = {
  events: string[],
  date: string,
};

// style
const TriggerCarpoolWrapper = styled.div`
  &:not(:last-child) {
    margin-bottom: 5px;
  }
`;

const TriggerCarpoolDate = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  padding-left: 0px;
  .glyphicon {
    position: initial;
    font-size: 9px;
  }
`;

const TriggerCarpoolDateString = styled.div`
  text-decoration: underline;
  font-weight: 700;
  &:hover {
    text-decoration: none;
  }
`;

const TriggerCarpoolEvents = styled.div`
`;

// component
export const TriggerDate: React.FC<TriggerDateProps> = (props) => {
  const [showEvents, setShowEvents] = React.useState(false);

  React.useEffect(() => {
    setShowEvents( props.events.length < 2 );
  }, []);

  const handleClick = React.useCallback(() => {
    setShowEvents(!showEvents);
  }, [showEvents]);

  return (
    <TriggerCarpoolWrapper>
      <TriggerCarpoolDate onClick={handleClick}>
        <TriggerCarpoolDateString>
          {props.date}
        </TriggerCarpoolDateString>
        &nbsp;
        {
          showEvents ? (
            <EtsBootstrap.Glyphicon glyph="triangle-top"/>
          ) : (
            <EtsBootstrap.Glyphicon glyph="triangle-bottom"/>
          )
        }
      </TriggerCarpoolDate>
      {showEvents ? (
        <TriggerCarpoolEvents>
          {
            props.events.length === 0 ?
              <span> Нет данных</span>
            : (
              props.events.join(', ')
            )
          }
        </TriggerCarpoolEvents>
      ) : (
        <DivNone />
      )}
    </TriggerCarpoolWrapper>
  );

};

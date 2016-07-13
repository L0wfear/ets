import React from 'react';
import Div from 'components/ui/Div.jsx';
import { Panel } from 'react-bootstrap';

let DashboardCardSmall = ({card}) => {
  let action = () => true;
  let itemActionObject = card.items[0].action;
  if (itemActionObject) {
    action = itemActionObject;
  }
  return (
    <Div className="dashboard-card-sm">
      <Panel header={card.title} bsStyle="success">
        <Div className="pointer" onClick={action}>
          {card.items && card.items[0] ? card.items[0].title || '' : ''}
        </Div>
      </Panel>
    </Div>
  );
};

export default DashboardCardSmall;

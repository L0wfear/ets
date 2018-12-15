import * as React from 'react';
import NotificationBage from 'components/notifications/NotificationBadge';

const renderNavNew = (props) => {
  return (
    <div>
      {props.data.title}<NotificationBage />
    </div>
  );
};

export default React.memo(renderNavNew);

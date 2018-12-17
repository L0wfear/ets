import * as React from 'react';
import NotificationBage from 'components/notifications/NotificationBadge';

const TitleComponent = (props) => {
  return (
    <div>
      {props.data.title}<NotificationBage />
    </div>
  );
};

export default React.memo(TitleComponent);

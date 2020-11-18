import * as React from 'react';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';

const PhotoLink: React.FC<{ data: string; }> = React.memo(({ data }) => {
  const permissions = useSelector(
    (state: ReduxState) => state.session.userData.permissions
  );
  const isPermitedToVievPhoto = React.useMemo(
    () => permissions.includes('penalties_report.view_photos'),
    [permissions]
  );

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault();
      global.NOTIFICATION_SYSTEM.notify(
        'Недостаточно прав для просмотра фотоматериалов',
        'warning',
        'tr'
      );
    },
    []
  );

  return (
    <>
      {isPermitedToVievPhoto ? (
        <a target="_blank" href={data}>
          Просмотр
        </a>
      ) : (
        <a href="#" onClick={handleClick}>
          Просмотр
        </a>
      )}
    </>
  );
});

export default PhotoLink;

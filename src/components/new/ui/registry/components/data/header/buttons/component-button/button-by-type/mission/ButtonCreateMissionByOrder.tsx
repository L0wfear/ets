import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import withRequirePermissionsNew from 'components/old/util/RequirePermissionsNewRedux';
import { compose } from 'recompose';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import missionPermissions from 'components/new/pages/missions/mission/_config-data/permissions';
import { path } from 'components/new/pages/nsi/order/_config-data';

type ButtonCreateMissionByOrderOwnProps = {
  registryKey: string;
};
type ButtonCreateMissionByOrderProps = (
  ButtonCreateMissionByOrderOwnProps
) & WithSearchProps;

const ButtonCreateMissionByOrder: React.FC<ButtonCreateMissionByOrderProps> = (props) => {
  const handleClick = React.useCallback(
    () => {
      props.history.push(
        path,
      );
    },
    [],
  );

  return (
    <EtsBootstrap.Button id="open-create-form" bsSize="small" active onClick={handleClick}>
      <EtsBootstrap.Glyphicon glyph="plus" /> Исполнение централизованного задания
    </EtsBootstrap.Button>
  );
};

export default compose<ButtonCreateMissionByOrderProps, ButtonCreateMissionByOrderOwnProps>(
  withSearch,
  withRequirePermissionsNew({
    permissions: missionPermissions.create,
  }),
)(ButtonCreateMissionByOrder);

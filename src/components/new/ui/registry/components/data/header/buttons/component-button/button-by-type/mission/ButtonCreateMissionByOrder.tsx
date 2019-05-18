import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { compose } from 'recompose';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import missionPermissions from 'components/new/pages/missions/mission/_config-data/permissions';

type ButtonCreateMissionByOrderStateProps = {
};
type ButtonCreateMissionByOrderDispatchProps = {
};
type ButtonCreateMissionByOrderOwnProps = {
  registryKey: string;
};
type ButtonCreateMissionByOrderMergeProps = {};

type ButtonCreateMissionByOrderProps = (
  ButtonCreateMissionByOrderStateProps
  & ButtonCreateMissionByOrderDispatchProps
  & ButtonCreateMissionByOrderOwnProps
  & ButtonCreateMissionByOrderMergeProps
) & WithSearchProps;

const ButtonCreateMissionByOrder: React.FC<ButtonCreateMissionByOrderProps> = (props) => {
  const handleClick = React.useCallback(
    () => {
      props.history.push(
        '/orders',
      );
    },
    [],
  );

  return (
    <EtsBootstrap.Button id="open-create-form" bsSize="small" active onClick={handleClick}>
      <EtsBootstrap.Glyphicon glyph="plus" /> Создать централизованное задание
    </EtsBootstrap.Button>
  );
};

export default compose<ButtonCreateMissionByOrderProps, ButtonCreateMissionByOrderOwnProps>(
  withSearch,
  withRequirePermissionsNew({
    permissions: missionPermissions.create,
  }),
)(ButtonCreateMissionByOrder);

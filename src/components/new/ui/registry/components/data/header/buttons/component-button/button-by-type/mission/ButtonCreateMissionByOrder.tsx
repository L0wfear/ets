import * as React from 'react';
import * as Button from 'react-bootstrap/lib/Button';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { compose } from 'recompose';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import missionPermissions from 'components/missions/mission/config-data/permissions';

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
    <Button id="open-create-form" bsSize="small" onClick={handleClick}>
      <Glyphicon glyph="plus" /> Создать децентрализованное задание
    </Button>
  );
};

export default compose<ButtonCreateMissionByOrderProps, ButtonCreateMissionByOrderOwnProps>(
  withSearch,
  withRequirePermissionsNew({
    permissions: missionPermissions.create,
  }),
)(ButtonCreateMissionByOrder);

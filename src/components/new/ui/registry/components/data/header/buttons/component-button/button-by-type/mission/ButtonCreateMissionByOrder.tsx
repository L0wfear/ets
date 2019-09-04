import * as React from 'react';
import { compose } from 'recompose';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import missionPermissions from 'components/new/pages/missions/mission/_config-data/permissions';
import { path } from 'components/new/pages/nsi/order/_config-data';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';
import { withRequirePermission } from 'components/@next/@common/hoc/require_permission/withRequirePermission';

type ButtonCreateMissionByOrderOwnProps = CommonTypesForButton & {};
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
  withRequirePermission({
    permissions: missionPermissions.create,
  }),
)(ButtonCreateMissionByOrder);

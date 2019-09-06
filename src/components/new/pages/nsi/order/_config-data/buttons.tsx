import { Link, LinkProps } from 'react-router-dom';
import { withRequirePermission, WithRequirePermissionProps } from 'components/@next/@common/hoc/require_permission/withRequirePermission';

export const LinkToOrder = withRequirePermission<LinkProps & WithRequirePermissionProps>({
  permissions: 'faxogramm.read',
})(Link as any);

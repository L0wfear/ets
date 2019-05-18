import EtsBootstrap from 'components/new/ui/@bootstrap';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

const ButtonCheckPermission = withRequirePermissionsNew({})(EtsBootstrap.Button);

export default ButtonCheckPermission;

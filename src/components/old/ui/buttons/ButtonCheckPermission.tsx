import EtsBootstrap from 'components/new/ui/@bootstrap';
import withRequirePermissionsNew from 'components/old/util/RequirePermissionsNewRedux';

const ButtonCheckPermission = withRequirePermissionsNew({})(EtsBootstrap.Button);

export default ButtonCheckPermission;

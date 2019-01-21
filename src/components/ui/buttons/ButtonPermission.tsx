import * as BootstrapButton from 'react-bootstrap/lib/Button';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

const ButtonWithMergeProps = withRequirePermissionsNew({})(BootstrapButton);

export default ButtonWithMergeProps;

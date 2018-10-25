import * as BootstrapButton from 'react-bootstrap/lib/Button';
import enhanceWithPermissionsNew from 'components/util/RequirePermissionsNew';

const ButtonWithMergeProps = enhanceWithPermissionsNew({
  mergeProps: ({ permission, permissions, ...props }) => (
    props
  ),
})(BootstrapButton);

export default ButtonWithMergeProps;

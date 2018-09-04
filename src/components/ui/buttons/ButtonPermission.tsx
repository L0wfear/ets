import { Button as BootstrapButton } from 'react-bootstrap';
import enhanceWithPermissionsNew from 'components/util/RequirePermissionsNew';

const ButtonWithMergeProps = enhanceWithPermissionsNew({
  mergeProps: ({ permission, permissions, ...props }) => (
    props
  ),
})(BootstrapButton);

export default ButtonWithMergeProps;

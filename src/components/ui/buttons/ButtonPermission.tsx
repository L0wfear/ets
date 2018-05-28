import { Button as BootstrapButton } from 'react-bootstrap';
import enhanceWithPermissionsNew from 'components/util/RequirePermissionsNew';

const ButtonWithMergeProps = enhanceWithPermissionsNew({
  mergeProps: (props) =>
    Object.keys(props).reduce((newProps, key) => {
    if (key !== 'permission') {
      newProps[key] = props[key];
    }

    return newProps;
  }, {}),
})(BootstrapButton);

export default ButtonWithMergeProps;
import * as React from 'react';

import { withRequirePermission, WithRequirePermissionProps } from 'components/@next/@common/hoc/require_permission/withRequirePermission';

const DivNoWrap = (props) => !props.hidden && <div {...props}>{props.children}</div>;
const Div = withRequirePermission<WithRequirePermissionProps & { hidden?: boolean; [k: string]: any }>()(DivNoWrap);

export default Div;

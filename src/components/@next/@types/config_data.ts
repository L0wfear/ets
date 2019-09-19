import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { validatePermissions } from 'components/@next/@utils/validate_permissions/validate_permissions';

export type ConfigPageData = {
  item?: string;
  id?: string;
  path: string;
  pathFormMenu?: string;
  routePath?: string;
  title: string | React.ReactElement;

  hiddenNav?: boolean;
  isNewRegistry?: boolean;
  entyity?: string;
  component?: React.ComponentType<WithSearchProps | any>;
  permissions: {
    list: Parameters<typeof validatePermissions>[0];
    create?: Parameters<typeof validatePermissions>[0];
    read?: Parameters<typeof validatePermissions>[0];
    update?: Parameters<typeof validatePermissions>[0];
    delete?: Parameters<typeof validatePermissions>[0];
    [k: string]: Parameters<typeof validatePermissions>[0];
  }

  noHash?: boolean
  noRoute?: boolean;
  checkHidden?: (isShow: boolean, userData: InitialStateSession['userData']) => boolean,
};

export type ConfigPageDataOrDivider = (
  ConfigPageData
  | {
    divider: boolean;
  }
);

export type ConfigParentData = {
  title: string;
  children: Record<string, ConfigParentData | ConfigPageDataOrDivider>,
  hiddenNav?: boolean,
  permissions: {
    [P in keyof ConfigPageData['permissions']]: ConfigPageData['permissions'][P];
  };
  childrenPath: Array<ConfigPageData['path']>;
  isNewRegistry: boolean;
};

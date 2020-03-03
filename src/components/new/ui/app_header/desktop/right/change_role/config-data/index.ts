import permissions from 'components/new/ui/app_header/desktop/right/change_role/config-data/permissions';
import component from 'components/new/ui/app_header/desktop/right/change_role/config-data/components';
import { ConfigPageData } from 'components/@next/@types/config_data';

const change_company_page_data: ConfigPageData = {
  path: '/change-company',
  title: 'Смена компании',
  entyity: 'role',

  hiddenNav: true,
  component,
  permissions,

  isNewRegistry: false,
};

export default change_company_page_data;

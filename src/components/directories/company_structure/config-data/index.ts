import permissions from 'components/directories/company_structure/config-data/permissions';
import component from 'components/directories/company_structure/config-data/components';

export default {
  path: '/company-structure',
  title: 'Структура предприятия',
  entyity: 'company_structure',
  noDotList: false,
  checkHidden: (isShow, props) => isShow && !props.isOkrug,
  component,
  permissions,
};

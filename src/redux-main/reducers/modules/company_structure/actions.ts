import { companyStructureSetNewData } from 'redux-main/reducers/modules/company_structure/common';

import * as company_structure from 'redux-main/reducers/modules/company_structure/company_structure/actions';

export default {
  companyStructureSetNewData,
  ...company_structure,
};

import {
  CompanyService,
} from 'api/Services';
import { keyBy } from 'lodash';

export const loadCompany = () => (
  CompanyService.get().then(({ result }) => ({
    companies: result,
    companiesIndex: keyBy(result, 'company_id'),
  }))
  .catch((error) => {
    console.warn(error);

    return {
      companies: [],
      companiesIndex: {},
    }
  })
)
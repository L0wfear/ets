import {
  CompanyService,
  TimeMoscowService,
} from 'api/Services';
import { keyBy } from 'lodash';
import { getDateWithMoscowTz } from 'utils/dates';

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
);

export const loadMoscowTime = () => (
  TimeMoscowService.get().then(({ result }) => ({
    time: result,
  }))
  .catch((error) => {
    console.warn(error);
    return TimeMoscowService.get().then(({ result }) => ({
      time: result,
    }))
  })
  .catch(() => {
    return {
      time: {
        timestamp: +(getDateWithMoscowTz()) / 1000,
        date: getDateWithMoscowTz(),
      },
    };
  })
);
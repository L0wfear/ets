import {
  CompanyService,
  TimeMoscowService,
} from 'api/Services';
import {
  keyBy,
} from 'lodash';
import { getDateWithMoscowTz } from 'utils/dates';

const colors = [];

Array(16).fill(1).map((d, r) =>
  Array(16).fill(1).map((_, g) =>
    Array(16).fill(1).map((__, b) =>
      colors.push(`rgb(${r * 16}, ${g * 16}, ${b * 16})`),
    ),
  ),
);

/**
 * @todo move on company store (actionGetAndSetInStoreCompany)
 */
export const loadCompany = () => (
  CompanyService.get().then(({ result }) => {
    const companies = result.map((company) => ({
      ...company,
      rgb_color: company.rgb_color || colors[Math.ceil(Math.random() * 4096)],
    }));

    return {
      companies,
      companiesIndex: keyBy(companies, 'company_id'),
    };
  })
  .catch((error) => {
    // tslint:disable-next-line
    console.warn(error);

    return {
      companies: [],
      companiesIndex: {},
    };
  })
);

export const loadMoscowTime = () => (
  TimeMoscowService.get().then(({ result }) => ({
    time: result,
  }))
  .catch((error) => {
    // tslint:disable-next-line
    console.warn(error);
    return TimeMoscowService.get().then(({ result }) => ({
      time: result,
    }));
  })
  .catch(() => {
    // tslint:disable-next-line:no-console
    console.warn('get js time');
    return {
      time: {
        timestamp: +(getDateWithMoscowTz()) / 1000,
        date: getDateWithMoscowTz(),
      },
    };
  })
);

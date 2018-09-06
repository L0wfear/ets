import {
  CompanyService,
  TimeMoscowService,
} from 'api/Services';
import { keyBy } from 'lodash';
import { getDateWithMoscowTz } from 'utils/dates';

const colors = [];

Array(16).fill(1).map((d, r) => 
  Array(16).fill(1).map((d, g) => 
    Array(16).fill(1).map((d, b) => 
    colors.push(`rgb(${r * 16}, ${g * 16}, ${b * 16})`)
    ),
  ),
);

export const loadCompany = () => (
  CompanyService.get().then(({ result }) => {
    const companies = result.map(company => ({
      ...company,
      rgb_color: company.rgb_color || colors[Math.ceil(Math.random() * 4096)],
    }));

    return {
      companies,
      companiesIndex: keyBy(companies, 'company_id'),
    };
  })
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
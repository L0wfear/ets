import { Actions } from 'flummox';
import {
  DashboardService,
} from 'api/Services';

const external_applications = { // мок
  result: {
    id: 23,
    key: 'external_applications',
    title: 'Заявки из внешних Систем',
    items: [
      {
        title: 'ОАТИ',
        subItems: [
          {
            id: 1,
            title: '№1',
          },
          {
            id: 2,
            title: '№2',
          },
        ],
      },
      {
        title: 'ЕДЦ',
        subItems: [
          {
            id: 3,
            title: '№3',
          },
          {
            id: 4,
            title: '№4',
          },
        ],
      },
    ],
  },
};

export default class DashboardActions extends Actions {
  getDashboardComponent(key) {
    let payload = {};
    if (key === 'faxogramms') {
      payload = Object.assign(payload, {});
    }
    if (key.includes('waybill_')) {
      const path = key.replace(/_/, '/');
      return DashboardService
        .path(path)
        .get(payload)
        .then(component => ({ component, key }));
    }
    if (key === 'external_applications') {
      return ({ component: external_applications, key });
    }
    return DashboardService
      .path(key)
      .get(payload)
      .then(component => ({ component, key }));
  }

}

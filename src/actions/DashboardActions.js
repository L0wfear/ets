import { Actions } from 'flummox';
import {
  DashboardService,
  TimeMoscowService,
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
      // debug: true return 5 orders
      payload = Object.assign(payload, {});
    }
    if (key.includes('waybill_')) {
      const path = key.replace(/_/, '/');
      return DashboardService
        .path(`${path}/count`)
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

  getWaybillInProgress() {
    return DashboardService
      .path('waybill/in_progress')
      .get()
      .then(({ result: { items: [subitemsData = {}] } }) => subitemsData);
  }

  getWaybillCompleted() {
    return DashboardService
      .path('waybill/completed')
      .get()
      .then(({ result: { items: [subitemsData = {}] } }) => subitemsData);
  }

  getWaybillDraft() {
    return DashboardService
      .path('waybill/draft')
      .get()
      .then(({ result: { items: [subitemsData = {}] } }) => subitemsData);
  }

  getWaybillClosed() {
    return DashboardService
      .path('waybill/closed')
      .get()
      .then(({ result: { items: [subitemsData = {}] } }) => subitemsData);
  }

  getMoscowTime() {
    return TimeMoscowService.get().then(({ result }) => result);
  }

}

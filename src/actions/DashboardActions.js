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

const getKeyBackEndByFrontEnd = (key) => {
  switch (key) {
    case 'current_duty_missions': return 'current_duty_missions_new';
    default: return key;
  }
};


/*
удалить, если увидел
Надо, если бэкеры заленяться собирать
const makeDataForWaybillComplete = (result) => {
  const { items: [{ subItems: allItems }] } = result;
  const [withMissionsItems, withoutMissionsItems] = allItems.reduce((newArr, item) => {
    if (item.has_missions) {
      newArr[0].push(item);
    } else {
      newArr[1].push(item);
    }

    return newArr;
  }, [[], []]);

  const items = [
    {
      title: `${result.title_all}: ${allItems.length}`,
      subItems: allItems,
      subItemsTitle: 'Информация о ПЛ (всего)',
    },
    {
      title: `${result.title_with_missions}: ${withMissionsItems.length}`,
      subItems: withMissionsItems,
      subItemsTitle: 'Информация о ПЛ с привязанными заданиями',
    },
    {
      title: `${result.title_without_missions}: ${withoutMissionsItems.length}`,
      subItems: withoutMissionsItems,
      subItemsTitle: 'Информация о ПЛ без привязанных заданий',
    },
  ];

  return {
    ...result,
    items,
  };
}

const updateDataByWaybillKey = ({ component: data, key }) => {
  let component = data;

  if (key.includes('completed')) {
    component = {
      ...component,
      result: makeDataForWaybillComplete(component.result),
    };
  }
  console.log(component)
  return {
    component,
    key,
  }
}
*/

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
        .path(path)
        .get(payload)
        .then(component => ({ component, key }));
    }
    if (key === 'external_applications') {
      return ({ component: external_applications, key });
    }

    return DashboardService
      .path(getKeyBackEndByFrontEnd(key))
      .get(payload)
      .then(component => ({ component, key }));
  }

  getMoscowTime() {
    return TimeMoscowService.get().then(({ result }) => result);
  }

}

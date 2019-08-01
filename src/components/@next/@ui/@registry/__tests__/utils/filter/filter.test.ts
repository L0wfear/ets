import {
  filterArray,
} from 'components/@next/@ui/@registry/utils/filter/filter';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';

type ArrayRegisrty<F> = OneRegistryData<F>['list']['data']['array'];
type FilterValues<F> = OneRegistryData<F>['list']['processed']['filterValues'];
type FilterFields<F> = OneRegistryData<F>['filter']['fields'];

describe('Тестирование функции фильтрации реестра', () => {
  test('фильтрация пустого массива', () => {
    const array: ArrayRegisrty<any> = [];
    const filter_values: FilterValues<any> = {};
    const filter_fields: FilterFields<any> = [];

    expect(filterArray(array, filter_values, filter_fields).length).toBe(0);
  });

  test('фильтрация по отсутствующемеу типу', () => {
    const array: ArrayRegisrty<any> = [
      {
        field_key: 1,
      },
    ];
    const filter_fields: any = [
      {
        valueKey: 'field_key',
        title: 'Тест фильтрации мультиселекта',
        type: 'qqq',
      },
    ];

    expect(filterArray(array, { field_key__qqq: 2 }, filter_fields).length).toBe(array.length);
  });

  describe('фильтрация массива по __in', () => {
    test('фильтрация по отсутствующемеу типу', () => {
      const array: ArrayRegisrty<any> = [
        {
          field_key: 1,
        },
      ];
      const filter_fields: FilterFields<any> = [
        {
          valueKey: 'field_key',
          title: 'Тест фильтрации мультиселекта',
          type: 'advanced-date',
        },
      ];

      expect(() => filterArray(array, { field_key__in: 2 }, filter_fields)).toThrow(Error);
    });

    test('фильтрация для типа примитивного типа multiselect', () => {
      const array: ArrayRegisrty<any> = [
        {
          field_key: 1,
        },
        {
          field_key: 3,
        },
        {
          field_key: 2,
        },
        {
          field_key: null,
        },
      ];
      const filter_fields: FilterFields<any> = [
        {
          valueKey: 'field_key',
          title: 'Тест фильтрации мультиселекта',
          type: 'multiselect',
        },
      ];

      expect(filterArray(array, { field_key__in: [] }, filter_fields).length).toBe(0);
      expect(filterArray(array, { field_key__in: [2] }, filter_fields).length).toBe(1);
      expect(filterArray(array, { field_key__in: [4] }, filter_fields).length).toBe(0);
      expect(filterArray(array, { field_key__in: [1, 2] }, filter_fields).length).toBe(2);
      expect(filterArray(array, { field_key__in: [1, 2, 4] }, filter_fields).length).toBe(2);
    });

    test('фильтрация для типа multiselect', () => {
      const array: ArrayRegisrty<any> = [
        {
          field_key: [
            {
              id: 1,
            },
            {
              id: 2,
            },
          ],
        },
        {
          field_key: [
            {
              id: 2,
            },
            {
              id: 3,
            },
          ],
        },
        {
          field_key: [
            {
              id: 3,
            },
            {
              id: null,
            },
          ],
        },
        {
          field_key: [],
        },
      ];
      const filter_fields: FilterFields<any> = [
        {
          valueKey: 'field_key',
          title: 'Тест фильтрации мультиселекта',
          type: 'multiselect',
        },
      ];

      expect(filterArray(array, { field_key__in: [] }, filter_fields).length).toBe(0);
      expect(filterArray(array, { field_key__in: [2] }, filter_fields).length).toBe(2);
      expect(filterArray(array, { field_key__in: [4] }, filter_fields).length).toBe(0);
      expect(filterArray(array, { field_key__in: [1, 2] }, filter_fields).length).toBe(2);
      expect(filterArray(array, { field_key__in: [1, 2, 3] }, filter_fields).length).toBe(3);
    });
  });

  describe('фильтрация массива по __like', () => {
    test('фильтрация по отсутствующемеу типу', () => {
      const array: ArrayRegisrty<any> = [
        {
          field_key: 1,
        },
      ];
      const filter_fields: FilterFields<any> = [
        {
          valueKey: 'field_key',
          title: 'Тест фильтрации мультиселекта',
          type: 'multiselect',
        },
      ];

      expect(() => filterArray(array, { field_key__like: 2 }, filter_fields)).toThrow(Error);
    });

    test('фильтрация для типа advanced-string-like', () => {
      const array: ArrayRegisrty<any> = [
        {
          field_key: '111',
        },
        {
          field_key: '123',
        },
        {
          field_key: '222',
        },
        {
          field_key: null,
        },
      ];
      const filter_fields: FilterFields<any> = [
        {
          valueKey: 'field_key',
          title: 'Тест фильтрации мультиселекта',
          type: 'advanced-string-like',
        },
      ];

      expect(filterArray(array, { field_key__like: '' }, filter_fields).length).toBe(3);
      expect(filterArray(array, { field_key__like: '1' }, filter_fields).length).toBe(2);
      expect(filterArray(array, { field_key__like: '11' }, filter_fields).length).toBe(1);
      expect(filterArray(array, { field_key__like: '111' }, filter_fields).length).toBe(1);
      expect(filterArray(array, { field_key__like: '2' }, filter_fields).length).toBe(2);
    });

    test('фильтрация для типа advanced-select-like', () => {
      const array: ArrayRegisrty<any> = [
        {
          field_key: 'before11',
        },
        {
          field_key: '!12after',
        },
        {
          field_key: 'lineafter',
        },
        {
          field_key: null,
        },
      ];
      const filter_fields: FilterFields<any> = [
        {
          valueKey: 'field_key',
          title: 'Непройденные мед. осмотры',
          type: 'advanced-select-like',
          options: [],
        },
      ];

      expect(filterArray(array, { field_key__like: null }, filter_fields).length).toBe(0);
      expect(filterArray(array, { field_key__like: '' }, filter_fields).length).toBe(0);
      expect(filterArray(array, { field_key__like: '1' }, filter_fields).length).toBe(0);
      expect(filterArray(array, { field_key__like: '%before%' }, filter_fields).length).toBe(1);
      expect(filterArray(array, { field_key__like: '%after%' }, filter_fields).length).toBe(2);
      expect(filterArray(array, { field_key__like: '%lineafter%' }, filter_fields).length).toBe(1);
      expect(filterArray(array, { field_key__like: '%lineafterbefore%' }, filter_fields).length).toBe(0);
    });
  });

  describe('фильтрация массива по __eq', () => {
    test('фильтрация по отсутствующемеу типу', () => {
      const array: ArrayRegisrty<any> = [
        {
          field_key: 1,
        },
      ];
      const filter_fields: FilterFields<any> = [
        {
          valueKey: 'field_key',
          title: 'Тест фильтрации мультиселекта',
          type: 'multiselect',
        },
      ];

      expect(() => filterArray(array, { field_key__eq: 2 }, filter_fields)).toThrow(Error);
    });

    test('фильтрация для типа advanced-number', () => {
      const array: ArrayRegisrty<any> = [
        {
          field_key: 111,
        },
        {
          field_key: 222,
        },
        {
          field_key: 222,
        },
        {
          field_key: null,
        },
      ];
      const filter_fields: FilterFields<any> = [
        {
          valueKey: 'field_key',
          title: 'Тест фильтрации',
          type: 'advanced-number',
          step: 1,
        },
      ];

      expect(filterArray(array, { field_key__eq: null }, filter_fields).length).toBe(4);
      expect(filterArray(array, { field_key__eq: 1 }, filter_fields).length).toBe(0);
      expect(filterArray(array, { field_key__eq: 11 }, filter_fields).length).toBe(0);
      expect(filterArray(array, { field_key__eq: 111 }, filter_fields).length).toBe(1);
      expect(filterArray(array, { field_key__eq: 22 }, filter_fields).length).toBe(0);
      expect(filterArray(array, { field_key__eq: 222 }, filter_fields).length).toBe(2);
    });

    test('фильтрация для типа advanced-date', () => {
      const array: ArrayRegisrty<any> = [
        {
          field_key: '2019-06-05T18:13:43',
        },
        {
          field_key: '2019-07-05T18:13:43',
        },
        {
          field_key: '2019-06-05T18:13:43',
        },
        {
          field_key: null,
        },
      ];
      const filter_fields: FilterFields<any> = [
        {
          valueKey: 'field_key',
          title: 'Тест фильтрации',
          type: 'advanced-date',
        },
      ];

      expect(filterArray(array, { field_key__eq: null }, filter_fields).length).toBe(array.length);
      expect(filterArray(array, { field_key__eq: '2019-05-05T18:13:43' }, filter_fields).length).toBe(0);
      expect(filterArray(array, { field_key__eq: '2019-06-05T18:13:43' }, filter_fields).length).toBe(2);
      expect(filterArray(array, { field_key__eq: '2019-07-05T18:13:43' }, filter_fields).length).toBe(1);
    });
  });

  describe('фильтрация массива по __neq', () => {
    test('фильтрация по отсутствующемеу типу', () => {
      const array: ArrayRegisrty<any> = [
        {
          field_key: 1,
        },
      ];
      const filter_fields: FilterFields<any> = [
        {
          valueKey: 'field_key',
          title: 'Тест фильтрации мультиселекта',
          type: 'multiselect',
        },
      ];

      expect(() => filterArray(array, { field_key__neq: 2 }, filter_fields)).toThrow(Error);
    });

    test('фильтрация для типа advanced-number', () => {
      const array: ArrayRegisrty<any> = [
        {
          field_key: 111,
        },
        {
          field_key: 222,
        },
        {
          field_key: 222,
        },
        {
          field_key: null,
        },
      ];
      const filter_fields: FilterFields<any> = [
        {
          valueKey: 'field_key',
          title: 'Тест фильтрации',
          type: 'advanced-number',
          step: 1,
        },
      ];

      expect(filterArray(array, { field_key__neq: null }, filter_fields).length).toBe(4);
      expect(filterArray(array, { field_key__neq: 1 }, filter_fields).length).toBe(4);
      expect(filterArray(array, { field_key__neq: 11 }, filter_fields).length).toBe(4);
      expect(filterArray(array, { field_key__neq: 111 }, filter_fields).length).toBe(3);
      expect(filterArray(array, { field_key__neq: 22 }, filter_fields).length).toBe(4);
      expect(filterArray(array, { field_key__neq: 222 }, filter_fields).length).toBe(2);
    });

    test('фильтрация для типа advanced-date', () => {
      const array: ArrayRegisrty<any> = [
        {
          field_key: '2019-06-05T18:13:43',
        },
        {
          field_key: '2019-07-05T18:13:43',
        },
        {
          field_key: '2019-06-05T18:13:43',
        },
        {
          field_key: null,
        },
      ];
      const filter_fields: FilterFields<any> = [
        {
          valueKey: 'field_key',
          title: 'Тест фильтрации',
          type: 'advanced-date',
        },
      ];

      expect(filterArray(array, { field_key__neq: null }, filter_fields).length).toBe(array.length);
      expect(filterArray(array, { field_key__neq: '2019-05-05T18:13:43' }, filter_fields).length).toBe(4);
      expect(filterArray(array, { field_key__neq: '2019-06-05T18:13:43' }, filter_fields).length).toBe(2);
      expect(filterArray(array, { field_key__neq: '2019-07-05T18:13:43' }, filter_fields).length).toBe(3);
    });
  });
  describe('фильтрация массива по __gt', () => {
    test('фильтрация по отсутствующемеу типу', () => {
      const array: ArrayRegisrty<any> = [
        {
          field_key: 1,
        },
      ];
      const filter_fields: FilterFields<any> = [
        {
          valueKey: 'field_key',
          title: 'Тест фильтрации мультиселекта',
          type: 'multiselect',
        },
      ];

      expect(() => filterArray(array, { field_key__gt: 2 }, filter_fields)).toThrow(Error);
    });

    test('фильтрация для типа advanced-number', () => {
      const array: ArrayRegisrty<any> = [
        {
          field_key: 111,
        },
        {
          field_key: 222,
        },
        {
          field_key: 222,
        },
        {
          field_key: null,
        },
      ];
      const filter_fields: FilterFields<any> = [
        {
          valueKey: 'field_key',
          title: 'Тест фильтрации',
          type: 'advanced-number',
          step: 1,
        },
      ];

      expect(filterArray(array, { field_key__gt: null }, filter_fields).length).toBe(4);
      expect(filterArray(array, { field_key__gt: 1 }, filter_fields).length).toBe(3);
      expect(filterArray(array, { field_key__gt: 11 }, filter_fields).length).toBe(3);
      expect(filterArray(array, { field_key__gt: 111 }, filter_fields).length).toBe(2);
      expect(filterArray(array, { field_key__gt: 22 }, filter_fields).length).toBe(3);
      expect(filterArray(array, { field_key__gt: 222 }, filter_fields).length).toBe(0);
    });

    test('фильтрация для типа advanced-date', () => {
      const array: ArrayRegisrty<any> = [
        {
          field_key: '2019-06-05T18:13:43',
        },
        {
          field_key: '2019-07-05T18:13:43',
        },
        {
          field_key: '2019-06-05T18:13:43',
        },
        {
          field_key: null,
        },
      ];
      const filter_fields: FilterFields<any> = [
        {
          valueKey: 'field_key',
          title: 'Тест фильтрации',
          type: 'advanced-date',
        },
      ];

      expect(filterArray(array, { field_key__gt: null }, filter_fields).length).toBe(array.length);
      expect(filterArray(array, { field_key__gt: '2019-05-05T18:13:43' }, filter_fields).length).toBe(3);
      expect(filterArray(array, { field_key__gt: '2019-06-05T18:13:43' }, filter_fields).length).toBe(1);
      expect(filterArray(array, { field_key__gt: '2019-07-05T18:13:43' }, filter_fields).length).toBe(0);
    });
  });
  describe('фильтрация массива по __lt', () => {
    test('фильтрация по отсутствующемеу типу', () => {
      const array: ArrayRegisrty<any> = [
        {
          field_key: 1,
        },
      ];
      const filter_fields: FilterFields<any> = [
        {
          valueKey: 'field_key',
          title: 'Тест фильтрации мультиселекта',
          type: 'multiselect',
        },
      ];

      expect(() => filterArray(array, { field_key__lt: 2 }, filter_fields)).toThrow(Error);
    });

    test('фильтрация для типа advanced-number', () => {
      const array: ArrayRegisrty<any> = [
        {
          field_key: -111,
        },
        {
          field_key: -222,
        },
        {
          field_key: -222,
        },
        {
          field_key: null,
        },
      ];
      const filter_fields: FilterFields<any> = [
        {
          valueKey: 'field_key',
          title: 'Тест фильтрации',
          type: 'advanced-number',
          step: 1,
        },
      ];

      expect(filterArray(array, { field_key__lt: null }, filter_fields).length).toBe(array.length);
      expect(filterArray(array, { field_key__lt: -1 }, filter_fields).length).toBe(3);
      expect(filterArray(array, { field_key__lt: -11 }, filter_fields).length).toBe(3);
      expect(filterArray(array, { field_key__lt: -111 }, filter_fields).length).toBe(2);
      expect(filterArray(array, { field_key__lt: -22 }, filter_fields).length).toBe(3);
      expect(filterArray(array, { field_key__lt: -222 }, filter_fields).length).toBe(0);
    });

    test('фильтрация для типа advanced-date', () => {
      const array: ArrayRegisrty<any> = [
        {
          field_key: '2019-06-05T18:13:43',
        },
        {
          field_key: '2019-07-05T18:13:43',
        },
        {
          field_key: '2019-06-05T18:13:43',
        },
        {
          field_key: null,
        },
      ];
      const filter_fields: FilterFields<any> = [
        {
          valueKey: 'field_key',
          title: 'Тест фильтрации',
          type: 'advanced-date',
        },
      ];

      expect(filterArray(array, { field_key__lt: null }, filter_fields).length).toBe(array.length);
      expect(filterArray(array, { field_key__lt: '2019-05-05T18:13:43' }, filter_fields).length).toBe(0);
      expect(filterArray(array, { field_key__lt: '2019-06-05T18:13:43' }, filter_fields).length).toBe(0);
      expect(filterArray(array, { field_key__lt: '2019-07-05T18:13:43' }, filter_fields).length).toBe(2);
    });
  });
});

import { diffDatesByDays, diffDates, createValidDateTime, } from 'components/@next/@utils/dates/dates';
import { isString } from 'util';

export const hideChildren = (data: any, { uniqName }) => data.filter(({ [`${uniqName}_father`]: fatherId }: any) => !fatherId);
export const showChildren = (data) => {
  return data.reduce((newData, row) => {
    newData.push(row);
    if (row.showChildren) {
      newData.push(...showChildren(row.children));
    }

    return newData;
  }, []);
};

export const sortDataFunction = (firstRowData, secondRowData) => {
  let [
    first,
    second,
  ] = [
    firstRowData.item,
    secondRowData.item,
  ];

  first = Array.isArray(first) ? first.reduce((newFirst, item) => `${newFirst}, ${item}`, '') : first;
  second = Array.isArray(second) ? second.reduce((newSecond, item) => `${newSecond}, ${item}`, '') : second;

  const firstIsNumber = !isNaN(Number(first));
  const secondIsNumber = !isNaN(Number(second));

  // оба числа
  if (firstIsNumber && secondIsNumber) {
    return first - second;
  }
  if (!firstIsNumber || !secondIsNumber) {
    if (!first && first !== 0) {
      return -1;
    }
    if (!second && second !== 0) {
      return 1;
    }
  }
  // первое - не число
  if (!firstIsNumber && secondIsNumber) {
    return -1;
  }
  // второе - не число
  if (firstIsNumber && !secondIsNumber) {
    return 1;
  }
  // оба элемента пусты ('', null, undefined)
  if (!first && !second) {
    return 0;
  }
  if (!first && second) {
    return -1;
  }
  if (first && !second) {
    return 1;
  }

  return first.localeCompare(second);
};

const checkFilterByAdvancedNumber = (f_data, rowCol) =>
  Object.entries(f_data.value).some(([filter_name, filter_value]) => {
    const filter_type = filter_name.split('__').pop();
    switch (filter_type) {
      case 'eq': return Number(filter_value) !== Number(rowCol);
      case 'neq': return Number(filter_value) === Number(rowCol);
      case 'lt': return !(Number(filter_value) > Number(rowCol));
      case 'lte': return !(Number(filter_value) > Number(rowCol));
      case 'gt': return !(Number(filter_value) < Number(rowCol));
      case 'gte': return !(Number(filter_value) < Number(rowCol));
      default: {
        console.info(`no define filter for ${filter_type}`); // eslint-disable-line
        return true;
      }
    }
  });

const checkFilterByAdvancedDate = (f_data, rowCol) => { // 'advanced-datetime' щквук
  if(f_data?.type === 'advanced-datetime' || f_data?.type === 'advanced-date') {
    return Object.entries(f_data.value).some(([filter_name, filter_value]) => {
      const filter_type = filter_name.split('__').pop();
      const dateFormat = f_data?.type === 'advanced-datetime' // определение формата даты, которая может прийти с бека, во всех отчетах разный формат, дата приходит в виде строки
        ? isString(rowCol) && rowCol.includes('T') && rowCol.includes('-')
          ? 'YYYY-MM-DDTHH:mm:ss'
          : 'DD.MM.YYYY HH:mm'
        : isString(rowCol) && rowCol.includes('T') && rowCol.includes('-')
          ? 'YYYY-MM-DD'
          : 'DD.MM.YYYY';

      const rowColDate = createValidDateTime(rowCol, false, dateFormat);
      const diffDatesValue = f_data?.type === 'advanced-datetime'
        ? diffDates(filter_value, rowColDate, 'minutes')
        : diffDates(filter_value, rowColDate, 'days');
      const invalidRowColDate = isNaN(diffDatesValue);

      switch (filter_type) {
        case 'eq': return diffDatesValue !== 0 || invalidRowColDate;
        case 'neq': return diffDatesValue === 0 || invalidRowColDate;
        case 'lt': return diffDatesValue <= 0 || invalidRowColDate;
        case 'lte': return diffDatesValue <= 0 || invalidRowColDate;
        case 'gt': return diffDatesValue >= 0 || invalidRowColDate;
        case 'gte': return diffDatesValue >= 0 || invalidRowColDate;
        default: {
            console.info(`no define filter for ${filter_type}`); // eslint-disable-line
          return true;
        }
      }
    }); 
  }
  console.error(`no define filter for ${f_data?.type}`);
};

export const filterFunction = (data, { filterValues }) =>
  data.reduce((newData, row) => {
    const isValid = !(Object.entries(filterValues) as any).some(([ f_key, f_data ]) => {
      const rowCol = row[f_key];
      if (rowCol === null && rowCol === undefined) {
        return true;
      }

      const {
        otherData: {
          customFilter = false,
        } = {},
      } = f_data;

      if (customFilter) {
        return customFilter(f_data, rowCol, row, data);
      } else {
        switch (f_data.type) {
          case 'multiselect': return !f_data.value.includes(rowCol);
          case 'string': return !String(rowCol).toLowerCase().includes(f_data.value.toLowerCase());
          case 'advanced-number': return checkFilterByAdvancedNumber(f_data, rowCol);
          case 'date': return diffDatesByDays(rowCol, f_data.value);
          case 'advanced-datetime':
          case 'advanced-date': return checkFilterByAdvancedDate(f_data, rowCol);
          default: {
            // tslint:disable-next-line
            console.warn(`no define filter for ${f_data}`);
            return !(rowCol === f_data);
          }
        }
      }
    });

    if (isValid) {
      return [
        ...newData,
        row,
      ];
    }

    return newData;
  }, []);

export const filterData = (data, { filterValues }) => {
  let filterAnsData = [];

  const isToggle = data.filter(({ toggle, allRow }) => toggle).length;
  const isAllRow = data.filter(({ allRow }) => allRow).length;

  if (isToggle) {
    if (isAllRow) {
      filterAnsData = data.map((row) => ({
        ...row,
        children: filterData(row.children, { filterValues }),
      }));
    } else {
      filterAnsData = filterFunction(data, { filterValues }).map((row) => ({
        ...row,
        children: filterData(row.children, { filterValues }),
      }));
    }
  } else {
    filterAnsData = filterFunction(data, { filterValues });
  }

  return filterAnsData;
};

export const sortFunction = (data, { tableMeta, sortField }) => {
  const fieldName = tableMeta.cols.find((col) => col.name === sortField).sortByKey || sortField;
  return [...data]
    .map((rowData) => ({ item: rowData[fieldName], rowData }))
    .sort(sortDataFunction)
    .map(({ rowData }) => rowData);
};

export const sortData = (data, props) => {
  let ansData = [];

  const isToggle = data.filter(({ toggle, allRow }) => toggle).length;
  const isAllRow = data.filter(({ allRow }) => allRow).length;

  if (isToggle) {
    if (isAllRow) {
      ansData = data.map((row) => ({
        ...row,
        children: sortData(row.children, props),
      }));
    } else {
      ansData = sortFunction(data, props).map((rowData) => ({
        ...rowData,
        children: sortData(rowData.children, props),
      }));

      if (props.sortAscending) {
        ansData.reverse().map((row) => ({
          ...row,
          children: [...row.children].reverse(),
        }));
      }
    }
  } else {
    ansData = sortFunction(data, props);

    if (props.sortAscending) {
      ansData.reverse();
    }
  }

  return ansData;
};

export const makeData = (props) => {
  const ans = { data: hideChildren([...props.data].filter(({ _fix_bottom }) => !_fix_bottom), props) };

  if (props.activeFilter) {
    ans.data = filterData(ans.data, props);
  }

  if (props.sortField) {
    ans.data = sortData(ans.data, props);
  }

  return [
    ...showChildren(ans.data),
    ...props.data.filter(({ _fix_bottom }) => _fix_bottom),
  ];
};

export const makeTableMeta = (tableMeta, props) => {
  if (props.enumerated) {
    return {
      ...props.tableMeta,
      cols: [
        {
          name: 'rowNumber',
          displayName: '№',
          notAvailableSort: true,
          cssClassName: 'width30',
          filter: {
            notUse: true,
          },
          render: ({ indexRow }) => indexRow,
        },
        ...props.tableMeta.cols,
      ],
    };
  }
  return { ...tableMeta };
};

export const makeDataByPagination = (data, { offset, perPageCount }, uniqName) => (
  showChildren(
    hideChildren(data, { uniqName })
      .slice(offset * perPageCount, (offset + 1) * perPageCount),
  )
);

import { groupBy } from 'lodash';

export const summRowWithAll = (rowValue, summValue) => isNaN(Number(rowValue)) ? summValue : rowValue + summValue;
export const removeRedundantNumbers = (rowValue) => Math.round(rowValue * 1000) / 1000;
export const openFields = (fields) => fields.map((meta) => {
  const [[keyName, metaData]] = Object.entries(meta);
  return {
    keyName,
    ...metaData,
  };
});

export const getInitialDataForReduce = (rowCol) =>
  rowCol.sections.reduce((newwArr, oneSection) => {
    if (oneSection.visible) {
      newwArr.push({
        ...oneSection,
        displayName: oneSection.name,
        children: [],
        fields: oneSection.fields || [],
      });
    }

    return newwArr;
  }, []);

export const makeSummer = ([...newArr], [...data], [col, ...cols]: any[], allCols, aggr_fields, filedsRule) => {
  if (col) {
    newArr.push(
      ...Object.values(groupBy(data, col.keyName))
        .reduce((newArrTemp, rows) =>
          makeSummer(newArrTemp, rows, cols, allCols, aggr_fields, filedsRule),
          [],
        ),
      );
  } else {
    const newItem = {
      ...data[0],
      ...data.reduce((summObj, row) => ({
        ...summObj,
        ...aggr_fields.reduce((summ, key) => ({
          ...summ,
          [key]: summRowWithAll(row[key], summObj[key] || 0),
        }), {}),
      }), {}),
    };
    aggr_fields.forEach((key) => {
      newItem[key] = removeRedundantNumbers(newItem[key]);
    });

    filedsRule.forEach(({ key, value: { force_value }}) => {
      if (force_value !== false) {
        newItem[key] = force_value;
      }
    });

    allCols.filter(({ keyName, abs }) => {
      if (abs) {
        newItem[keyName] = Math.abs(newItem[keyName]);
      }
    });

    newArr.push(newItem);
  }

  return newArr;
};

const makeRowsWithNoneStructure = (rows, colMeta) =>
  rows.map(({ ...row }) => ({ ...row, [colMeta.keyName]: '-' }));

export const makeDataForSummerTable = (data, { uniqName }) => {
  if (data.result.meta.level === 'company') {
    const {
      result: {
        rows,
        meta: {
          summary: {
            fields,
            aggr_fields,
          },
        },
      },
    } = data;

    const _uniq_field = uniqName;
    const _uniq_field_father = `${uniqName}_father`;

    const cols = openFields(fields);
    const verticalAgregationBy = cols.find(({ is_row }) => is_row);
    const diffCols = cols.filter(({ keyName, is_row }) => !aggr_fields.includes(keyName) && !is_row);

    const initialDataForReduce = getInitialDataForReduce(verticalAgregationBy);

    const returnData = rows.reduce((newDataObj, row) => {
      const { [verticalAgregationBy.keyName]: verticalKey } = row;

      newDataObj.forEach((section) => {
        if (section.values.includes(verticalKey)) {
          section.children.push(row);
        }
      });

      return newDataObj;
    }, initialDataForReduce)
      .map((row, index) => {
        const filedsRule = row.fields.map((fieldData) => {
          const [[key, value]] = Object.entries(fieldData);

          return { key, value };
        });

        const children = makeSummer([], row.children, diffCols, cols, aggr_fields, filedsRule);

        if (!children.length) {
          children.push({
            displayName: 'Нет данных',
            toggle: true,
            allRow: true,
            showChildren: true,
            children: [],
          });
        } else {
          const col = cols.find(({ keyName, name }) => keyName === 'structure_name' || name === 'Подразделение');
          if (col) {
            children.push(...makeSummer([], makeRowsWithNoneStructure(row.children, col), diffCols, cols, aggr_fields, filedsRule).map((d) => ({ ...d, className: 'bold', noIndexRow: true })));
          }
        }

        return {
          ...row,
          toggle: true,
          allRow: true,
          showChildren: true,
          [_uniq_field]: index + 1,
          children: children.map((child, indexRow) => ({
            ...child,
            [_uniq_field_father]: index + 1,
            [_uniq_field]: `${index + 1}.${indexRow + 1}`,
          })),
        };
      });

    return returnData;
  }

  return [];
};

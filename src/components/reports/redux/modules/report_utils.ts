import { groupBy } from 'lodash';

export const summRowWithAll = (rowValue, summValue) => isNaN(Number(rowValue)) ? 0 : rowValue + summValue;
export const removeRedundantNumbers = rowValue => Math.round(rowValue * 1000) / 1000;
export const openFields = fields => fields.map(meta => {
  const [[keyName, metaData]] = Object.entries(meta);
  return {
    keyName,
    ...metaData,
  };
});

export const makeSummer = ([...newArr], [...data], [col, ...cols], aggr_fields) => {
  if (col) {
    newArr.push(
      ...Object.values(groupBy(data, col.keyName))
        .reduce((newArrTemp, rows) =>
          makeSummer(newArrTemp, rows, cols, aggr_fields),
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
    aggr_fields.forEach(key => {
      newItem[key] = removeRedundantNumbers(newItem[key])
    })

    newArr.push(newItem)
  }

  return newArr;
}

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
    const verticalAgregationBy = cols.find(({ is_vertical }) => is_vertical);
    const diffCols = cols.filter(({ keyName, is_vertical }) => !aggr_fields.includes(keyName) && !is_vertical);
    const initialDataForReduce = Object.entries(verticalAgregationBy.names)
                                  .reduce((obj, [key, value]) => ({
                                    ...obj,
                                    [key]: { displayName: value, key, children: [] },
                                  }),
                                  {},
                                );

    const returnData = Object.values(rows.reduce((newDataObj, row) => {
      const { [verticalAgregationBy.keyName]: verticalKey } = row;

      newDataObj[verticalKey].children.push(row);

      return newDataObj;
    }, initialDataForReduce))
      .map((row, index) => {
        const children = makeSummer([], row.children, diffCols, aggr_fields)
          .map((row, indexRow) => ({
            ...row,
            [_uniq_field_father]: index + 1,
            [_uniq_field]: `${index + 1}.${indexRow + 1}`,
          }));

        if (!children.length) {
          children.push({
            displayName: 'Нет данных',
            toggle: true,
            allRow: true,
            showChildren: true,
            children: [],
            [_uniq_field_father]: index + 1,
            [_uniq_field]: `${index + 1}.${1}`,
          });
        };

        return {
          ...row,
          toggle: true,
          allRow: true,
          showChildren: true,
          [_uniq_field]: index + 1,
          children,
        };
      });

    return returnData;
  }
  console.log('level is company', 'SummaryTable hidden')
  return [];
}

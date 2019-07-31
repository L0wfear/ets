import { get, groupBy } from 'lodash';
import { isNullOrUndefined, isArray } from 'util';

export const summRowWithAll = (rowValue, summValue) => isNaN(Number(rowValue)) ? summValue : rowValue + summValue;
export const removeRedundantNumbers = (rowValue) => Math.round(rowValue * 1000) / 1000;
export const openFields = (fields) => fields.map((meta) => {
  const [[keyName, metaData]] = Object.entries(meta);
  return {
    keyName,
    ...metaData,
  };
});

export const getInitialDataForReduce = (rowCol) => {
  return rowCol
    ? (
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
      }, [])
    )
    : (
      null
    );
};

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
    const firstItem = data[0] || {};

    const newItem = {
      ...allCols.reduce((newObj, { keyName }) => {
        newObj[keyName] = firstItem[keyName];

        return newObj;
      }, {}),
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
      if (!isNullOrUndefined(force_value)) {
        newItem[key] = force_value;
      }
    });

    allCols.filter(({ keyName, abs, percent }) => {
      if (abs) {
        newItem[keyName] = Math.abs(newItem[keyName]);
      }
      if (percent) {
        const numerator: number = get(newItem, get(percent, '0'));
        const denominator: number = get(newItem, get(percent, '1'));

        try {
          if (isNullOrUndefined(numerator) || isNullOrUndefined(denominator) || denominator <= 0) {
            newItem[keyName] = 0;
          } else {
            const percentValue = numerator / denominator * 100;
            newItem[keyName] = percentValue > 0 ? percentValue.toFixed(2) : 0;
          }
        } catch (e) {
          newItem[keyName] = 0;
        }
      }
    });

    newArr.push(newItem);
  }

  return newArr;
};

const makeRowsWithNoneStructure = (rows, colMeta) =>
  rows.map(({ ...row }) => ({ ...row, [colMeta.keyName]: '-' }));

export const makeDataForSummerTable = (data, { uniqName, reportKey }) => {
  if (get(data, 'result.meta.summary.fields')) {
    let rows = get(data, 'result.rows', []);
    const {
      result: {
        meta: {
          summary: {
            fields,
            with_summary_data,
            aggr_fields,
          },
        },
      },
    } = data;

    const deepArr = rows.some((blockData) => isArray(blockData.rows));
    if (deepArr) {
      rows = rows.reduce((newArr: any[], blockData) => {
        newArr.push(...blockData.rows);

        return newArr;
      }, []);
    }

    if (reportKey === 'fuel_cards_report' || reportKey === 'mission_progress_report') {
      if (rows.length) {
        const cols_wsd = openFields(fields);
        const diffCols_wsd = cols_wsd.filter(({ keyName, is_row }) => !aggr_fields.includes(keyName) && !is_row);

        const filedsRule = fields.map((fieldData) => {
          const [[key, value]] = Object.entries(fieldData);

          return { key, value };
        });

        const children = makeSummer([], rows, diffCols_wsd, cols_wsd, aggr_fields, []).map((child, index) => {
          child[uniqName] = index + 1;

          filedsRule.forEach(({ key, value: { force_value }}) => {
            if (!isNullOrUndefined(force_value) && (isNullOrUndefined(child[key]) || child[key] === '')) {
              child[key] = force_value;
            }
          });

          return child;
        });

        if (with_summary_data) {
          children.push(({
            [cols_wsd[0].keyName]: 'Итого',
            [uniqName]: 'summary',
            noIndexRow: true,
            ...aggr_fields.reduce((newObj, keyName) => {
              newObj[keyName] = children.reduce((summ, row) => summ + row[keyName], 0);
              return newObj;
            }, {}),
            _fix_bottom: true,
          }));
        }

        return children;
      }
      return [
        {
          displayName: 'Нет данных',
          toggle: true,
          allRow: true,
          showChildren: true,
          children: [],
        },
      ];
    }

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
            children.push(
              ...makeSummer(
                [],
                makeRowsWithNoneStructure(
                  row.children,
                  col,
                ),
                diffCols,
                cols,
                aggr_fields,
                filedsRule,
              ).map((d) => ({
                ...d,
                className: 'bold',
                noIndexRow: true,
              })),
            );
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

import { isObject, isBoolean, isNumber } from 'util';
import { get } from 'lodash';

const widthByKey: Record<string, { width: number; sortable?: boolean; }> = {
  enumerated: {
    width: 50,
  },
  checkbox: {
    width: 30,
  },
  showMissionInfo: {
    width: 150,
  },
  is_open: {
    width: 35,
  },
  company_structure_actions: {
    width: 250,
  },
  services_actions_on_off: {
    width: 150,
  },
  service_files: {
    width: 400,
  },
  button_show_action_log: {
    width: 175,
  },
  buttonCloneTire: {
    width: 200,
  },
  edc_request_info: {
    width: 100,
  },
  show_file_list: {
    width: 350,
  },
  show_edc_comments: {
    width: 75,
  },
};

export const getRowKeys = (cols) => (
  cols.reduce((newCols, col) => {
    if (col.childrenFields && col.childrenFields.length) {
      newCols.push(...(getRowKeys(col.childrenFields)));
    } else {
      newCols.push(col);
    }

    return newCols;
  }, [])
);

const makeTreeByKey = (cols, key, deep = 1, parentOrder = 0) => {
  const deepArr = [deep];
  const newColTree = cols.reduce((newTree, col, index) => {
    const { [key]: childrenArr = [] } = col;

    if (childrenArr.length) {
      const { tree, deep: colDeep } = makeTreeByKey(childrenArr, key, deep + 1, index);

      newTree[col.key] = {
        ...col,
        tree,
        parentOrder,
        order: index,
      };
      deepArr.push(colDeep);
    } else {
      newTree[col.key] = {
        ...col,
        parentOrder,
        order: index,
      };
    }

    return newTree;
  }, {});

  return {
    tree: newColTree,
    deep: Math.max(...deepArr),
  };
};

export const getColsWithRowAndColSpan = (cols) => {
  const { tree, deep } = makeTreeByKey(cols, 'childrenFields', 1);

  return {
    tree,
    deep,
  };
};

const getCountChildren = (tree) => (
  Object.values(tree).reduce<number>((count, { tree: childTree }) => {
    if (isObject(childTree)) {
      return count + getCountChildren(childTree);
    }

    return count + 1;
  }, 0)
);

const makeOneDeepLine = (arr, treeFields, currentDeep, deep) => {
  Object.entries(treeFields).sort(([keya, a]: any, [keyb, b]: any) => {
    if (a.parentOrder === b.parparentOrder) {
      return a.order - b.order;
    }

    return a.parentOrder - b.parparentOrder;
  }).map(([key, col]: any) => {
    const { tree = {} } = col;
    const treeLength = Object.keys(tree).length;

    const newCol = {
      ...col,
    };

    if (treeLength) {
      makeOneDeepLine(arr, tree, currentDeep + 1, deep);
      newCol.colSpan = getCountChildren(tree);
    } else {
      newCol.rowSpan = deep - currentDeep;
    }

    arr[currentDeep].push(newCol);
  });

  return arr;
};

export const makeFieldsInDeepArr = (treeFields, deep) => {
  const arr = Array(deep).fill(1).map(() => Array());

  return makeOneDeepLine(arr, treeFields, 0, deep);
};

const isSortableField = (fieldMeta) => {
  return (
    isBoolean(fieldMeta.sortable)
      ? fieldMeta.sortable
      : get(widthByKey, `${fieldMeta.key}.sortable`, !(fieldMeta.key in widthByKey))
  );
};

const getFieldWidth = (fieldMeta) => {
  return (
    isNumber(fieldMeta.width)
      ? fieldMeta.width
      : get(widthByKey, `${fieldMeta.key}.width`, 150)
  );
};

export const makerDataMetaField = (fieldsOwn) => {
  const fields = fieldsOwn.filter(({ hidden }) => !hidden).map(
    (fieldMeta) => ({
      ...fieldMeta,
      width: getFieldWidth(fieldMeta),
      sortable: isSortableField(fieldMeta),
    }),
  );
  const { tree: treeFields, deep } = getColsWithRowAndColSpan(fields);
  const fieldsInDeepArr = makeFieldsInDeepArr(treeFields, deep);
  const rowFields = getRowKeys(fields);

  return {
    fields: fieldsOwn,
    row_fields_table_width: rowFields.reduce((summ, { width }) => summ + width, 0),
    treeFields,
    rowFields,
    fieldsInDeepArr,
  };
};

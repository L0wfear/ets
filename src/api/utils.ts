/**
 * API data utils
 */

import {
  mapKeys,
} from 'lodash';

export function unpackObjectData(
  prefix: string,
  data: ETSCore.Types.IStringKeyHashTable = {},
): ETSCore.Types.IStringKeyHashTable {
  return mapKeys(
    data,
    (v, key) => `${prefix}_${key}`,
  );
}

export function packObjectData(
  prefix: string,
  srcData: ETSCore.Types.IStringKeyHashTable = {},
): ETSCore.Types.IStringKeyHashTable {
  const result = {};
  const fullPrefix = `${prefix}_`;

  Object.keys(srcData).forEach(key => {
    if (key.match(fullPrefix)) {
      result[key.split(fullPrefix)[1]] = srcData[key];
    }
  });

  return result;
}

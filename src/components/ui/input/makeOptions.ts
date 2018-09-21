import { get } from 'lodash';
import {
  defaultSortingFunction,
} from 'components/ui/input/ReactSelect/utils';

export const makeOptions = ({ data, options }) => {
  const intiData = options.reduce((initData, { name }) => ({ ...initData, [name]: [] }), {});

  const firstSelect = data.reduce((reducedData, row) => {
    options.forEach(({ name, fields }) => {
      const destructuringRow = {};

      fields.forEach(field =>
        destructuringRow[field] = row[field]
      );

      reducedData[name].push(destructuringRow);

    });

    return reducedData;
  }, { ...intiData });

  return options.reduce((afterCallBack, config) => {
    const ans = afterCallBack[config.name] = get(config.callBack(firstSelect[config.name]), config.optionsPath, []);

    if (Array.isArray(ans)) {
      ans.sort(defaultSortingFunction)
    }

    return afterCallBack;
  }, { ...intiData });
}

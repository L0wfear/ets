import { get } from 'lodash';

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
    afterCallBack[config.name] = get(config.callBack(firstSelect[config.name]), config.optionsPath, []);
    return afterCallBack;
  }, { ...intiData });
}

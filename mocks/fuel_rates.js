import models, { getModelById } from '../scripts/models.js';

// const fuelRates = [
//   {
//     date: '01.01.2014',
//     operation_id: '',
//     rate_summer: 5.22,
//     rate_winter: 3.22,
//     model_id: ''
//   }
// ];

export function getFuelRates(operations) {
  let fuelRates = [];
  let object;

  [102, 132, 8, 210].map( (model) => {
    operations.result.map( (op, i) => {
      object = {
        ID: model + i,
        date: '2015-01-01',
        operation_id: op.ID,
        model_id: getModelById(model).id,
      }

      if (i%2 === 0) {
        object.rate_summer = (Math.random() * (1.50 - 0.20) + 0.20).toFixed(2);
        object.rate_winter = '';
      } else {
        object.rate_winter = (Math.random() * (1.50 - 0.20) + 0.20).toFixed(2);
        object.rate_summer = '';
      }
      fuelRates.push(object);
      return object;
    });
  })

  return fuelRates;
}

// export default fuelRates;

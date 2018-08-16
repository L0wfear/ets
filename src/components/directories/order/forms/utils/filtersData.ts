import { diffDates } from 'utils/dates.js';
import { typeTemplate } from 'components/directories/order/forms/utils/constant';

export const getFilterDateOrder = (technical_operations, { order_date, order_date_to, status }) =>
  technical_operations.reduce((newObj, to) => {
    const {
      norm_id,
      date_from,
      date_to,
      num_exec,
      order_operation_id,
    } = to;

    if (diffDates(new Date(), date_to || order_date_to) < 0) {
      if (!newObj[norm_id]) {
        newObj[norm_id] = [{
          date_to: date_to || order_date_to,
          date_from: date_from || order_date,
          num_exec,
          order_operation_id,
          status,
        }];
      } else {
        const newNormData = {
          date_to: date_to || order_date_to,
          date_from: date_from || order_date,
          num_exec,
          order_operation_id,
          status,
        };

        if (newObj[norm_id].some(({ date_to, date_from }) => date_to !== newNormData.date_to || date_from !== newNormData.date_from)) {
          newObj[norm_id].push(newNormData);
        }
      }
    }

    return newObj;
  }, {});

export const getMissionListByFilter = (missionsList, filterData, typeClick) =>
  missionsList.reduce((arr, m) => {
    const { norm_id, passes_count} = m;
    if (filterData[norm_id]) {
      filterData[norm_id].forEach((toData) => {
        const {
          date_to,
          date_from,
          num_exec,
          order_operation_id,
          status,
        } = toData;

        console.log(status, passes_count)
        if ((typeClick === typeTemplate.missionDutyTemplate || passes_count <= num_exec) && diffDates(new Date(), date_to, 'minutes') < 0 && (status === 'partially_suspended' ? true : passes_count > 0)) {
            arr.push({
            ...m,
            customId: arr.length,
            date_to,
            date_from,
            order_operation_id,
          });
        }
      })
    }

    return arr;
  }, []);

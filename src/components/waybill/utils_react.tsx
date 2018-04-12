import * as React from 'react';
import { isEmpty } from 'lodash';

export const confirmDialogChangeDate = missionsNum => {
  if (missionsNum.length) {
    return global.confirmDialog({
      title: 'Внимание!',
      body: (
        <div>
          <p>{`Привязанные ${missionsNum.join(', ')} будут исключены из ПЛ, поскольку выходят за период действия ПЛ.`}</p>
          <p>Вы уверены, что хотите продолжить?</p>
        </div>
      ),
    });
  }
  return Promise.resolve();
};

export const checkErrorDate = ({ fromOrder: { cf_list: fax_cf_list, confirmDialogList: fax_confirmDialogList }, notFromOrder: { cf_list: not_fax_cf_list } }) => {
  if (!isEmpty(fax_cf_list)) {
    global.NOTIFICATION_SYSTEM.notify(`
      Время выполнения привязанного к ПЛ закрытого задания: 
      № ${fax_cf_list.join(', ')}, выходит за пределы фактических сроков выполнения ПЛ. Необходимо скорректировать фактические даты ПЛ
    `, 'error', 'tr');
    return Promise.reject(false);
  }
  if (!isEmpty(fax_confirmDialogList)) {
    return global.confirmDialog({
      title: 'Внимание!',
      body: (
        <div>
          <p>{`Привязанные задания № ${fax_confirmDialogList.join(', ')} будут исключены из ПЛ, поскольку период действия централизованного задания, по которому задания созданы, выходит за плановый период действия ПЛ.`}</p>
          <p>Вы уверены, что хотите продолжить?</p>
        </div>
      ),
    });
  }
  if (!isEmpty(not_fax_cf_list)) {
    global.NOTIFICATION_SYSTEM.notify(`
      Время выполнения привязанного к ПЛ закрытого задания: 
      № ${not_fax_cf_list.join(', ')}, выходит за пределы фактических сроков выполнения ПЛ. Необходимо скорректировать фактические даты ПЛ
    `, 'error', 'tr');
    return Promise.reject(false);
  }
  return Promise.resolve();
};

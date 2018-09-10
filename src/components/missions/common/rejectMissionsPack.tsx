import * as React from 'react';
import { ExtField } from 'components/ui/Field.jsx';
import { cloneDeep } from 'lodash';

const typeObj = {
  dutyMisison: 'наряд задания',
  mission: 'задания',
};

export const rejectMissionsPack = ([mission, ...missions], methods, type) => (
  mission ?
  new Promise(async res => {
    try {
      const state = await global.confirmDialog({
        title: <b>{`Введите причину для ${typeObj[type]} №${mission.number}`}</b>,
        body: self => (
          <ExtField
            type="string"
            label={false}
            value={self.state.comment}
            onChange={({ target: { value } }) => self.setState({ comment: value })}
          />
        ),
        defaultState: {
          comment: '',
        },
      });

      await methods.updateMission({
        ...cloneDeep(mission),
        status: 'fail',
        comment: state.comment,
      });
    } catch (error) {
      /* tslint:disable:no-console */
      console.warn(error);
      /* tslint:enable */
    }

    return res(rejectMissionsPack(missions, methods, type));
  })
  :
  Promise.resolve('end')
);

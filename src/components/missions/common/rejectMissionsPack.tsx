import * as React from 'react';
import { ExtField } from 'components/ui/new/field/ExtField';
import { cloneDeep } from 'lodash';

const typeObj = {
  dutyMission: 'наряд задания',
  mission: 'задания',
};

type TypeMission = {
  number: number;
  [key: string]: any;
};

export const rejectMissionsPack = ([mission, ...missions]: TypeMission[], methods, type) => (
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

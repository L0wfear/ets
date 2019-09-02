import { defaultActions } from 'redux-main/default.actions';
import { WorkMode } from 'redux-main/reducers/modules/some_uniq/work_mode/@types';
import { someUniqSetNewDataNew } from 'redux-main/reducers/modules/some_uniq/common';

export const actionsWorkMode = defaultActions<WorkMode>(
  'work_mode',
  someUniqSetNewDataNew('workModeList'),
);

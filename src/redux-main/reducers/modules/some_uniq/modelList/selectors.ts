import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { createSelector, Selector } from 'reselect';
import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';

export const getModelsListState = (state: ReduxState) => (
  getSomeUniqState(state).modelsList
);

// for reselect
export type ModelsListStructure = ValuesOf<IStateSomeUniq['modelsList']>;

export type GetModelsListOptionsAns = (
  Array<DefaultSelectOption<ModelsListStructure['id'], ModelsListStructure['full_name'], ModelsListStructure>>
);

export const getSomeUniqModelsList: Selector<ReduxState, IStateSomeUniq['modelsList']> = (state) => (
  getSomeUniqState(state).modelsList
);

export const getModelsListOptions = createSelector<ReduxState, IStateSomeUniq['modelsList'], GetModelsListOptionsAns>(
  getSomeUniqModelsList,
  (modelsList) => modelsList.map((model) => ({
    value: model.id,
    label: model.full_name,
    rowData: model,
  })),
);

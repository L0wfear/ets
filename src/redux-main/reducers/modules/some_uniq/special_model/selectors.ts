import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { createSelector, Selector } from 'reselect';
import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';

export const getSpecialModelList = (state: ReduxState) => (
  getSomeUniqState(state).specialModelList
);
// for reselect
export type SpecialModelStructure = ValuesOf<IStateSomeUniq['specialModelList']>;

export type GetSessionModelListOptionsAns = (
  DefaultSelectOption<SpecialModelStructure['id'], SpecialModelStructure['name'], SpecialModelStructure>[]
);

export const getSomeUniqSpecialModel: Selector<ReduxState, IStateSomeUniq['specialModelList']> = (state) => (
  getSomeUniqState(state).specialModelList
);

export const getSomeUniqSpecialModelOptions = createSelector<ReduxState, IStateSomeUniq['specialModelList'], GetSessionModelListOptionsAns>(
  getSomeUniqSpecialModel,
  (models) => models.map((model) => ({
    value: model.id,
    label: model.name,
    rowData: model,
  })),
);

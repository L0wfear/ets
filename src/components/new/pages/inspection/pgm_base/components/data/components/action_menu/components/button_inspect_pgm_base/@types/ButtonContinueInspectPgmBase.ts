import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { IStateInspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';

export type ButtonContinueInspectPgmBaseStateProps = {
  lastConductingInspect: IStateInspectPgmBase['lastConductingInspect'];
};
export type ButtonContinueInspectPgmBaseDispatchProps = {
};
export type ButtonContinueInspectPgmBaseOwnProps = {
};

export type ButtonContinueInspectPgmBaseMergedProps = (
  ButtonContinueInspectPgmBaseStateProps
  & ButtonContinueInspectPgmBaseDispatchProps
  & ButtonContinueInspectPgmBaseOwnProps
);

export type ButtonContinueInspectPgmBaseProps = (
  ButtonContinueInspectPgmBaseMergedProps
  & WithSearchProps
);

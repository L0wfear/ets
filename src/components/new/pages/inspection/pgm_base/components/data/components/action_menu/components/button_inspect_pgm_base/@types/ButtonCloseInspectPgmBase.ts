import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { IStateInspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';
import { DispatchProp } from 'react-redux';

export type ButtonCloseInspectPgmBaseStateProps = {
  lastConductingInspect: IStateInspectPgmBase['lastConductingInspect'];
};
export type ButtonCloseInspectPgmBaseDispatchProps = DispatchProp;

export type ButtonCloseInspectPgmBaseOwnProps = {
};

export type ButtonCloseInspectPgmBaseProps = (
  (
    ButtonCloseInspectPgmBaseStateProps
    & ButtonCloseInspectPgmBaseDispatchProps
    & ButtonCloseInspectPgmBaseOwnProps
  )
  & WithSearchProps
);

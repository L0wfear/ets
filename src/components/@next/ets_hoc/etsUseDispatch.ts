import { useDispatch, useSelector } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';

export type EtsDispatch = <F extends ((...args: any[]) => any) | object>(
  f: F,
) => (
  F extends (...args: any[]) => any
    ? ReturnType<F>
    : F
);
export type EtsAction<ReturnType> = (
  dispatch: EtsDispatch,
  getState: () => ReduxState,
) => ReturnType;

type EtsUseDispatch = () => EtsDispatch;
type EtsUseSelector = <TSelected>(
  selector: (state: ReduxState) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean,
) => TSelected;

export const etsUseDispatch = useDispatch as EtsUseDispatch;
export const etsUseSelector = useSelector as EtsUseSelector;

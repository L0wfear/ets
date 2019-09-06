import { useDispatch, useSelector, HandleThunkActionCreator, TypedUseSelectorHook } from 'react-redux';
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

export type EtsActionReturnType<Action extends (...arg: any) => any> = ReturnType<HandleThunkActionCreator<Action>>;

type EtsUseDispatch = () => EtsDispatch;

export const etsUseDispatch = useDispatch as EtsUseDispatch;
export const etsUseSelector: TypedUseSelectorHook<ReduxState> = useSelector;

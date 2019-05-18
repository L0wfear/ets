import EtsBootstrap from 'components/new/ui/@bootstrap';
import { onChangeWithKeys } from 'components/compositions/hoc';
import withMergeProps from 'components/compositions/vokinda-hoc/with-merge-props/WithMergeProps';

export const ExtButton: any = onChangeWithKeys(
  withMergeProps(
    ({ boundKeys, ...props }) => props,
  )(EtsBootstrap.Button as any),
);

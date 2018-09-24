import Field from 'components/ui/Field';
import { onChangeWithKeys } from 'components/compositions/hoc';
import withMergeProps from 'components/compositions/vokinda-hoc/with-merge-props/WithMergeProps';

export const ExtField: any = onChangeWithKeys(
  withMergeProps(
    ({ boundKeys, ...props }) => props
  )(Field as any)
);
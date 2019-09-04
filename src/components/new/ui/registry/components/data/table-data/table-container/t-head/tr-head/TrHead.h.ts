import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

export type OwnPropsTrHead = {
  registryKey: string;
  thDataRow: any[];
};

export type MergedPropsTrHead = (
  OwnPropsTrHead
);

export type PropsTrHead = (
  MergedPropsTrHead
  & WithSearchProps
);

export type StateTrHead = {};

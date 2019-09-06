import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';

export type CommontTdTiteProps = {
  rowData: ValuesOf<OneRegistryData<any>['list']['processed']['processedArray']>;
  fieldMeta: ValuesOf<OneRegistryData<any>['list']['meta']['rowFields']>;

  registryKey: string;
  indexRow: number;
};

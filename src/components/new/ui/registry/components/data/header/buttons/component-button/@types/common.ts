import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';

export type CommonTypesForButton = {
  data?: ValuesOf<OneRegistryData['header']['buttons']>;
  registryKey: string;
};

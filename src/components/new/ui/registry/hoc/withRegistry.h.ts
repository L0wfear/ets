import { OneRegistryData, TypeFields } from 'components/new/ui/registry/module/@types/registry';

export type TypeConfigData<F> = {
  noInitialLoad?: boolean;
  Service: OneRegistryData<F>['Service'];
  registryKey: string;
  header?: {
    title?: OneRegistryData<F>['header']['title'];
    titlePopover?: OneRegistryData<F>['header']['titlePopover'];
    format?: OneRegistryData<F>['header']['format'];
    is_current_structure_popover?: OneRegistryData<F>['header']['is_current_structure_popover'];
    buttons?: Array<ValuesOf<OneRegistryData<F>['header']['buttons']> | string>,
  };
  filter?: Partial<OneRegistryData<F>['filter']>;
  list?: {
    data?: Partial<OneRegistryData<F>['list']['data']>;
    permissions?: Partial<OneRegistryData<F>['list']['permissions']>;
    processed?: {
      processedArray?: OneRegistryData<F>['list']['processed']['processedArray'];
      sort?: Partial<OneRegistryData<F>['list']['processed']['sort']>;
      filterValues?: OneRegistryData<F>['list']['processed']['filterValues'];
      total_count?: OneRegistryData<F>['list']['processed']['total_count'];
    };
    meta: {
      selected_row_in_params?: OneRegistryData<F>['list']['meta']['selected_row_in_params'];
      row_double_click?: OneRegistryData<F>['list']['meta']['row_double_click'];
      fields?: Array<TypeFields<F>>;
    };
    paginator?: Partial<OneRegistryData<F>['list']['paginator']>;
  };
};

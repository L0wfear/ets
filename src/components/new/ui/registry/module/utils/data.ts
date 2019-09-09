import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';

export const makeDataListAfterLoadInitialData = (props: Pick<TypeConfigData<any>['list']['data'], 'array'>) => {
  const { array } = props;
  const total_count = array.length;

  return {
    total_count,
    array,
  };
};

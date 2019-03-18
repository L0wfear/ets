import { TypeConfigData } from "../../hoc/withRegistry.h";

export const makeDataListAfterLoadInitialData = (props: Pick<TypeConfigData<any>['list']['data'], 'array'>) => {
  const { array } = props;
  const total_count = array.length;

  return {
    total_count,
    array,
  };
};

declare namespace ETSCore {
  namespace Types {
    interface IStringKeyHashTable<ValueType = any> {
      [key: string]: ValueType;
    }

    interface INumberKeyHashTable<ValueType = any> {
      [key: number]: ValueType;
    }

    type TReactComponent<TInjectedProps> = React.ComponentClass<TInjectedProps> | React.SFC<TInjectedProps>;
    type THOCFunction<TSourceProps, TResultHOCProps> = (SourceComponent: ETSCore.Types.TReactComponent<TSourceProps>) => React.ComponentClass<TResultHOCProps>;
  }
}

declare namespace ETSCore {
  namespace Respoce {
    type Payload<A> = {
      payload: A;
    };
    type Rows<A> = {
      rows: A[];
    };
    type ResultRows<A> = {
      result: Rows<A>;
    };
  }
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

  type LegacyContext = any;
}

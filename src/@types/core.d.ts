declare namespace ETSCore {
  namespace Respoce {
    type Payload<A> = {
      payload: A;
    };
    type Rows<A> = {
      rows: Array<A>;
    };
    type ResultRows<A> = {
      result: Rows<A>;
    };
  }
  namespace Types {
    type IStringKeyHashTable<ValueType = any> = {
      [key: string]: ValueType;
    };

    type INumberKeyHashTable<ValueType = any> = {
      [key: number]: ValueType;
    };

    type TReactComponent<TInjectedProps> = React.ComponentClass<TInjectedProps> | React.FC<TInjectedProps>;
    type THOCFunction<TSourceProps, TResultHOCProps> = (SourceComponent: ETSCore.Types.TReactComponent<TSourceProps>) => React.ComponentClass<TResultHOCProps>;
  }

  type LegacyContext = any;
}
/**
 * get typeof element in array
 * @example ValuesOf<Array<TypeOfElement>> = TypeOfElement
 */
type ValuesOf<T extends Array<any>>= T[number];
type Dictionary<T extends any>= Record<string, T>;
/**
 * Получить ключи подходящих по типу значений
 * @example AllowedNames<{ a: string; b: number }, string> = a
 * @example AllowedNames<{ a: string; b: number }, number> = b
 * @example AllowedNames<{ a: string; b: number }, object> = never
 */
type AllowedNames<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never
}[keyof Base];

declare namespace ETSCore {
  namespace Types {
    interface IStringKeyHashTable<ValueType> {
      [key: string]: ValueType;
    }

    interface INumberKeyHashTable<ValueType> {
      [key: number]: ValueType;
    }
  }
}

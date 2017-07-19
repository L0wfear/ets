declare namespace ETSCore {
  namespace Types {
    interface IStringKeyHashTable<ValueType = any> {
      [key: string]: ValueType;
    }

    interface INumberKeyHashTable<ValueType = any> {
      [key: number]: ValueType;
    }
  }
}

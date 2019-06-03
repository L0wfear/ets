
type FuncAddLayerProps = {
  id: number | string;
  zIndex?: number;
  renderMode?: any,
};

declare namespace ETSCore {
  export namespace Map {
    export namespace InjectetLayerProps {
      type FuncAddLayer = (props: FuncAddLayerProps) => Promise<{}>;
      type FuncRemoveLayer = () => void;
      type FuncGetVectorSource = () => any;
      type FuncGetOlLayer = () => any;
      type FuncAddFeaturesToSource = (features: any | any[]) => void;
      type FuncRemoveFeaturesFromSource = (features?: any | any[] | void, all?: boolean) => void;
      type FuncGetFeatureById = (id: string) => any;
      type FuncSetDataInLayer = (name: string, value: any) => void;
      type FuncGetAllFeatures = () => any[];
    }
  }
}

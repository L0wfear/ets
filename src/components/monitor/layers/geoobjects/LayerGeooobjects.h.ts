import Feature from 'ol/Feature';
import { GeozonesDataByIndex } from 'redux-main/trash-actions/geometry/geometry.h';
import { TypeCompaniesIndex } from 'redux-main/trash-actions/uniq/promise.h';

export type PropsLayerGeooobjects = {
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer;
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer;
  addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource;
  removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource;
  getFeatureById: ETSCore.Map.InjectetLayerProps.FuncGetFeatureById;
  setDataInLayer: ETSCore.Map.InjectetLayerProps.FuncSetDataInLayer;
  geoobjects: any;
  SHOW_GEOOBJECTS: boolean;
  companiesIndex: TypeCompaniesIndex;

  monitorPageAddToSelectedGeoobjects: any;
};

interface TypeGeoObjectDataIndex {
  [id: string]: GeozonesDataByIndex;
}

export type TypeGeoObjectData = {
  show: boolean;
  data?: TypeGeoObjectDataIndex;
  oldData?: TypeGeoObjectDataIndex;
};

export type TypeGeoobjects = {
  [serverName: string]: TypeGeoObjectData;
};

export type StateLayerGeooobjects = {};

export namespace LayerGeoobjectsUtilsTypes {
  type checkShowTrueFuncThisProps = {
    addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource;
    companiesIndex?: TypeCompaniesIndex;
  };

  type checkShowFalseFuncThisProps = {
    removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource;
  };

  type renderGeoobjectsFuncThisProps = checkShowTrueFuncThisProps &
    checkShowFalseFuncThisProps & {
      getFeatureById: ETSCore.Map.InjectetLayerProps.FuncGetFeatureById;
      companiesIndex?: TypeCompaniesIndex;
    };

  export type renderGeoobjectsFunc = (
    geoobjects: TypeGeoobjects,
    diffGeoobjects: TypeGeoobjects,
    thisProps: renderGeoobjectsFuncThisProps,
  ) => void;

  export type checkShowTrueFunc = (
    serverName: string,
    id: string,
    show: boolean,
    geoobj: GeozonesDataByIndex,
    geoobj_old: GeozonesDataByIndex,
    oldFeature: Feature,
    thisProps: checkShowTrueFuncThisProps,
    selected: boolean,
    isManyCompany?: boolean,
  ) => void;

  export type checkShowTrueHasOldFeatureFunc = (
    geoobj: GeozonesDataByIndex,
    geoobj_old: GeozonesDataByIndex,
    oldFeature: Feature,
  ) => void;

  export type checkShowTrueHasNotOldFeatureFunc = (
    serverName: string,
    id: string,
    geoobj: GeozonesDataByIndex,
    thisProps: checkShowTrueFuncThisProps,
    selected: boolean,
    color?: string,
  ) => void;

  export type getMergedGeoobjectsFunc = (
    geoobjects: TypeGeoobjects,
    diffGeoobjects: TypeGeoobjects,
  ) => TypeGeoobjects;

  type DiffAns = {
    hasDiff: boolean;
    changedGeoobjects: TypeGeoobjects;
  };

  export type checkShowStatusFunc = (
    serverName: string,
    data: TypeGeoObjectData,
    show: boolean,
    oldShow: boolean,
    stateData: TypeGeoObjectData,
  ) => DiffAns;

  export type checkDataFunc = (
    serverName: string,
    data: TypeGeoObjectData,
    show: boolean,
    stateData: TypeGeoObjectData,
  ) => DiffAns;

  export type ansCheck = (
    serverName: string,
    data: TypeGeoObjectData,
    show: boolean,
    oldShow: boolean,
    stateData: TypeGeoObjectData,
  ) => {
    checkShowStatus: DiffAns;
    checkData: DiffAns;
  };

  type DiffAnsForClass = {
    hasDiff: boolean;
    diffGeoobjects: TypeGeoobjects;
  };

  export type diffInputPropsFunc = (
    thisProps: PropsLayerGeooobjects,
    prevProps: PropsLayerGeooobjects,
  ) => DiffAnsForClass;

  export type mergeRetvalWithCaclDataFunc = (
    retValue: DiffAnsForClass,
    serverName: string,
    data: TypeGeoObjectData,
    show: boolean,
    oldShow: boolean,
    stateData: TypeGeoObjectData,
  ) => DiffAnsForClass;

  export type checkShowFalseFunc = (
    show: boolean,
    oldFeature: Feature,
    thisProps: checkShowFalseFuncThisProps,
  ) => void;
}

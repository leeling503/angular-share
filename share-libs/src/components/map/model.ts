export type MapName = "TianDiTu.Normal.Map" | "TianDiTu.Normal.Annotion"
    | "TianDiTu.Satellite.Map" | "TianDiTu.Satellite.Annotion"
    | "TianDiTu.Terrain.Map" | "TianDiTu.Terrain.Annotion"
    | "GaoDe.Normal.Map"
    | "GaoDe.Satellite.Map" | "GaoDe.Satellite.Annotion"
    | "Google.Normal.Map"
    | "Google.Satellite.Map" | "Google.Satellite.Annotion"
    | "Geoq.Normal.Map" | "Geoq.Normal.PurplishBlue" | "Geoq.Normal.Gray" | "Geoq.Normal.Warm"
    | "Geoq.Theme.Hydro"
    | "OSM.Normal.Map";

interface MapNameInerface {
    tianDiTuNormalMap: MapName,
    tianDiTuNormalAnnotion: MapName,
    tianDiTuSatelliteMap: MapName,
    tianDiTuSatelliteAnnotion: MapName,
    tianDiTuTerrainMap: MapName,
    tianDiTuTerrainAnnotion: MapName,
    gaoDeNormalMap: MapName,
    gaoDeSatelliteMap: MapName,
    gaoDeSatelliteAnnotion: MapName,
    googleNormalMap: MapName,
    googleSatelliteMap: MapName,
    googleSatelliteAnnotion: MapName,
    geoqNormalMap: MapName,
    geoqNormalPurplishBlue: MapName,
    geoqNormalGray: MapName,
    geoqNormalWarm: MapName,
    geoqThemeHydro: MapName,
    oSMNormalMap: MapName,
}

/**tianDiTu 天地图 gaoDe 高德 google 谷歌 
* Normal 矢量地图 Satellite 卫星图
* Map地图 Annotion地名*/
export const MAPNAME: MapNameInerface = {
    tianDiTuNormalMap: 'TianDiTu.Normal.Map',
    tianDiTuNormalAnnotion: 'TianDiTu.Normal.Annotion',
    tianDiTuSatelliteMap: 'TianDiTu.Satellite.Map',
    tianDiTuSatelliteAnnotion: 'TianDiTu.Satellite.Annotion',
    tianDiTuTerrainMap: 'TianDiTu.Terrain.Map',
    tianDiTuTerrainAnnotion: 'TianDiTu.Terrain.Annotion',
    gaoDeNormalMap: 'GaoDe.Normal.Map',
    gaoDeSatelliteMap: 'GaoDe.Satellite.Map',
    gaoDeSatelliteAnnotion: 'GaoDe.Satellite.Annotion',
    googleNormalMap: 'Google.Normal.Map',
    googleSatelliteMap: 'Google.Satellite.Map',
    googleSatelliteAnnotion: 'Google.Satellite.Annotion',
    geoqNormalMap: 'Geoq.Normal.Map',
    geoqNormalPurplishBlue: 'Geoq.Normal.PurplishBlue',
    geoqNormalGray: 'Geoq.Normal.Gray',
    geoqNormalWarm: 'Geoq.Normal.Warm',
    geoqThemeHydro: 'Geoq.Theme.Hydro',
    oSMNormalMap: 'OSM.Normal.Map',
}
import React from "react";
import "./Map.css";
import {  Map as LeafMap, TileLayer } from "react-leaflet";
import { showDataOnMap } from '../utils';

function Map({countries, casesType, center, zoom}) {
  return (
    <div className="map">
      <LeafMap center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">Open Street</a> Contributors'
        />
        {showDataOnMap(countries, casesType)}
      </LeafMap>
    </div>
  );
}

export default Map;

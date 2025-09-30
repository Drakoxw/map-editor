import { Component, OnInit } from '@angular/core';
import { LngLatLike, Map, MapMouseEvent, Marker } from 'maplibre-gl';
import { FeatureCollection, Feature, Point } from 'geojson';

import { MapComponent, GeoJSONSourceComponent, LayerComponent } from '@maplibre/ngx-maplibre-gl';

@Component({
  selector: 'app-example-map',
  templateUrl: './example-map.component.html',
  styleUrls: ['./example-map.component.css'],
  imports: [MapComponent, GeoJSONSourceComponent, LayerComponent],
})
export class ExampleMapComponent implements OnInit {
  map: Map;
  cursorStyle: string;

  center: LngLatLike = [-75.57612487383977, 6.244755019988588];
  data: FeatureCollection<Point> = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-75.56875263968789, 6.3413072346888555],
        },
        properties: {
          name: 'Sample Point',
          category: 'test',
        },
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-75.57337829180803, 6.255880803279126],
        },
        properties: {
          name: 'New POI',
          category: 'default',
        },
      },
    ],
  };
  ngOnInit(): void {}

  centerMapTo(evt: MapMouseEvent) {
    if ((evt as any).features?.length) {
      const coords = (evt as any).features[0].geometry.coordinates;
      this.center = coords;
    }
  }

  onMapLoad(map: Map) {
    this.map = map;

    // Crear un ícono SVG personalizado
    const pinSVG = `
      <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.2 0 0 7.2 0 16c0 11.4 16 24 16 24s16-12.6 16-24C32 7.2 24.8 0 16 0z"
              fill="#FF5252"/>
        <circle cx="16" cy="16" r="6" fill="white"/>
      </svg>
    `;

    const img = new Image(16, 20);
    img.onload = () => map.addImage('custom-pin', img);
    img.src = 'data:image/svg+xml;base64,' + btoa(pinSVG);
  }

  addPoint(evt: MapMouseEvent) {
    const coords = [evt.lngLat.lng, evt.lngLat.lat] as [number, number];

    const newFeature: Feature<Point> = {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: coords },
      properties: { name: 'New POI', category: 'default' },
    };
    const data = this.data;
    data.features = [...data.features, newFeature];
    this.data = { ...data };
  }
}

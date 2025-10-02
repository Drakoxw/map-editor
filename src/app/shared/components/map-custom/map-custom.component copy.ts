import { Component, effect, EventEmitter, Input, input, Output } from '@angular/core';
import {
  MapComponent,
  GeoJSONSourceComponent,
  LayerComponent,
  EventData,
} from '@maplibre/ngx-maplibre-gl';
import {
  LngLat,
  LngLatLike,
  Map,
  MapLayerMouseEvent,
  MapLibreEvent,
  MapMouseEvent,
  Popup,
} from 'maplibre-gl';
import { FeatureCollection, Point } from 'geojson';

import { PIN_MAP_SVG, STYLE_MAP_STREET, COLLECTION_VOID } from '@constants/index';
import { MapPointClickEvent } from '@interfaces/index';

@Component({
  selector: 'app-map-custom',
  templateUrl: './map-custom.component.html',
  styleUrls: ['./map-custom.component.css'],
  imports: [MapComponent, GeoJSONSourceComponent, LayerComponent],
})
export class MapCustomComponent {
  // Outputs
  @Output() mapClick = new EventEmitter<LngLat>();
  @Output() pointClick = new EventEmitter<MapPointClickEvent>();
  @Output() mapReady = new EventEmitter<Map>();
  @Output() mapResized = new EventEmitter<number>();

  @Input() set reFitBounds(_: unknown) {
    this.fitMapToPoints();
  }

  // Inputs
  styleMap = input<string>(STYLE_MAP_STREET);
  pinMapSvg = input<string>(PIN_MAP_SVG);
  zoom = input<number>(12);
  pinSizeWidth = input<number>(19);
  toleranceMultiplier = input<number>(2);
  pinSizeHeight = input<number>(24);
  center = input<LngLatLike>([-75.5761, 6.2448]); // Medellín
  data = input<FeatureCollection<Point>>({...COLLECTION_VOID });

  _data: FeatureCollection<Point> = {...COLLECTION_VOID}

  // Control
  autoFitBounds = input<boolean>(true);
  enablePointClick = input<boolean>(true);
  enableMapClick = input<boolean>(true);
  iconName = input<string>('custom-pin');

  // Internal state
  map: Map | null = null;
  cursorStyle: string = '';
  private tooltip: Popup | null = null;
  private isMapReady = false;

  constructor() {
    // Watch Effect data
    effect(() => {
      const newData = this.addFeatureIds(this.data());
      this._data = newData
      if (this.map && this.isMapReady) {
        this.updateMapData(newData);

        if (this.autoFitBounds() && newData.features.length > 0) {
          setTimeout(() => this.fitMapToPoints(), 100);
        }
      }
    });
  }

  private addFeatureIds(data: FeatureCollection<Point>): FeatureCollection<Point> {
    return {
      ...data,
      features: data.features.map((feature, index) => {
        const assignedId = feature.id ?? index;

        return {
          ...feature,
          id: assignedId,
          properties: {
            ...feature.properties,
            id: assignedId,
          },
        };
      }),
    };
  }

  /** EVENTOS DEL MAPA */
  onMapLoad(map: Map): void {
    this.map = map;
    this.loadCustomIcon(map);
    this.isMapReady = true;
    this.mapReady.emit(map);

    if (this.autoFitBounds() && this.data().features.length > 0) {
      setTimeout(() => this.fitMapToPoints(), 500);
    }
  }

  /** EMITIR EVENTO DE RESIZE DEL MAPA */
  rezipMap($: MapLibreEvent & EventData) {
    this.mapResized.emit(this.map?.getZoom() || this.zoom());
  }

  /** ACTUALIZAR DATOS DEL MAPA */
  private updateMapData(data: FeatureCollection<Point>): void {
    if (!this.map) return;

    const source = this.map.getSource('pois-source') as any;
    if (source && source.setData) {
      source.setData(data);
    }
  }

  /** AJUSTAR MAPA A PUNTOS */
  private fitMapToPoints(): void {
    if (!this.map || this.data().features.length === 0) {
      return;
    }

    const coordinates = this.data().features.map((f) => f.geometry.coordinates as [number, number]);

    if (coordinates.length === 1) {
      this.map.flyTo({
        center: coordinates[0],
        zoom: 14,
        duration: 1000,
      });
      return;
    }

    const bounds = coordinates.reduce(
      (bounds, coord) => {
        return [
          [Math.min(bounds[0][0], coord[0]), Math.min(bounds[0][1], coord[1])],
          [Math.max(bounds[1][0], coord[0]), Math.max(bounds[1][1], coord[1])],
        ];
      },
      [
        [coordinates[0][0], coordinates[0][1]],
        [coordinates[0][0], coordinates[0][1]],
      ]
    );

    this.map.fitBounds(bounds as [[number, number], [number, number]], {
      padding: 50,
      maxZoom: 15,
      duration: 1000,
    });
  }

  /** Carga el icono personalizado */
  private loadCustomIcon(map: Map): void {
    const img = new Image(this.pinSizeWidth(), this.pinSizeHeight());
    img.onload = () => {
      const iconName = this.iconName();
      if (!map.hasImage(iconName)) {
        map.addImage(iconName, img);
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(this.pinMapSvg());
  }

  /** Handler para el click en el mapa */
  onMapClick(evt: MapMouseEvent): void {
    if (!this.enableMapClick()) {
      return;
    }

    const features = this.map?.queryRenderedFeatures(evt.point, {
      layers: ['pois-layer'],
    });

    if (features && features.length > 0) {
      return;
    }

    this.mapClick.emit(evt.lngLat);
  }

  /**
   * CALCULA LA TOLERANCIA POR ZOOM Y LATITUD
   */
  private calculateToleranceByZoomAndLatitude(): { lng: number; lat: number } {
    if (!this.map) {
      const defaultTolerance = 0.00001 * this.toleranceMultiplier();
      return { lng: defaultTolerance, lat: defaultTolerance };
    }

    const zoom = this.map.getZoom();
    const center = this.map.getCenter();
    const latitude = center.lat;

    const baseTolerance = 0.01;
    const latTolerance = baseTolerance / Math.pow(2, zoom);

    const latRad = latitude * (Math.PI / 180);
    const lngTolerance = latTolerance / Math.cos(latRad);

    const adjustedLatTolerance = latTolerance * this.toleranceMultiplier();
    const adjustedLngTolerance = lngTolerance * this.toleranceMultiplier();

    const minTolerance = 0.0000001;
    const maxTolerance = 0.2;

    return {
      lng: Math.max(minTolerance, Math.min(maxTolerance, adjustedLngTolerance)),
      lat: Math.max(minTolerance, Math.min(maxTolerance, adjustedLatTolerance)),
    };
  }

  /**
   * DETECTA EL CLICK EN UN PUNTO
   * @param evt
   * @returns
   */
  onPointClick(evt: MapMouseEvent): void {
    if (!this.enablePointClick()) return;
    evt.preventDefault();

    const features = (evt as any).features;
    if (!features || features.length === 0) return;

    const clickedFeature = features[0];
    const coords = clickedFeature.geometry.coordinates as [number, number];
    const props = clickedFeature.properties;

    // Mostrar popup
    if (this.map) {
      new Popup({ offset: 25, closeButton: true })
        .setLngLat(coords)
        .setHTML(
          `
        <div style="font-size:13px; line-height:1.4">
          <strong>${props.name || 'Unnamed POI'}</strong><br>
          <em>${props.category || 'No category'}</em><br>
          <small>Lng: ${coords[0].toFixed(5)}, Lat: ${coords[1].toFixed(5)}</small>
        </div>
      `
        )
        .addTo(this.map);
    }

    // seguir emitiendo el evento a Angular
    const tolerance = this.calculateToleranceByZoomAndLatitude();
    const index = this.data().features.findIndex((f) => {
      const fcoords = f.geometry.coordinates;
      const name = f.properties['name'];
      return (
        Math.abs(fcoords[0] - coords[0]) < tolerance.lng &&
        Math.abs(fcoords[1] - coords[1]) < tolerance.lat &&
        name === props.name
      );
    });

    if (index !== -1) {
      const feature = this.data().features[index];
      this.pointClick.emit({
        index,
        coordinates: feature.geometry.coordinates as [number, number],
        properties: feature.properties,
      });
    }
  }

  // onPointClick(evt: MapMouseEvent): void {
  //   if (!this.enablePointClick()) {
  //     return;
  //   }

  //   evt.preventDefault();

  //   const features = (evt as any).features;
  //   if (!features || features.length === 0) {
  //     return;
  //   }

  //   const clickedFeature = features[0];
  //   const clickedCoords = clickedFeature.geometry.coordinates;
  //   const clickedName = clickedFeature.properties.name;

  //   const tolerance = this.calculateToleranceByZoomAndLatitude();

  //   const index = this.data().features.findIndex((f) => {
  //     const coords = f.geometry.coordinates;
  //     const name = f.properties['name'];

  //     return (
  //       Math.abs(coords[0] - clickedCoords[0]) < tolerance.lng &&
  //       Math.abs(coords[1] - clickedCoords[1]) < tolerance.lat &&
  //       name === clickedName
  //     );
  //   });

  //   if (index !== -1) {
  //     const feature = this.data().features[index];
  //     this.pointClick.emit({
  //       index,
  //       coordinates: feature.geometry.coordinates as [number, number],
  //       properties: feature.properties,
  //     });
  //   }
  // }

  /**
   * AJUSTAR EL MAPA A UN PUNTO
   * @param coordinates
   * @param zoom
   */
  public centerOnPoint(coordinates: [number, number], zoom: number = 14): void {
    if (this.map) {
      this.map.flyTo({
        center: coordinates,
        zoom,
        duration: 1000,
      });
    }
  }
  /** Mostrar tooltip en hover */
  showTooltip(evt: MapLayerMouseEvent): void {
    if (!this.map) return;
    this.cursorStyle = 'pointer';
    const feature = (evt as any).features?.[0];
    if (!feature) return;

    const coords = feature.geometry.coordinates as [number, number];
    const props = feature.properties || {};

    const featureId = props.id ?? null;

    console.log({ props, feature, featureId });

    // Si ya hay un tooltip, elimínalo
    this.hideTooltip();

    this.tooltip = new Popup({
      closeButton: false,
      closeOnClick: false,
      offset: [0, -20],
    })
      .setLngLat(coords)
      .setHTML(
        `
      <div style="font-size: 13px; line-height: 1.4">
        <strong>${props['name'] || 'Unnamed POI'}</strong><br>
        <em>${props['category'] || 'No category'}</em><br>
        <small>${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}</small>
      </div>
    `
      )
      .addTo(this.map);
  }

  hideTooltip() {
    this.cursorStyle = '';
    if (this.tooltip) {
      this.tooltip.remove();
      this.tooltip = null;
    }
  }
}

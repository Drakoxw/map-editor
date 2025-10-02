import {
  Component,
  EventEmitter,
  input,
  Output,
  effect,
  Input,
  booleanAttribute,
} from '@angular/core';
import { MapComponent, GeoJSONSourceComponent, LayerComponent } from '@maplibre/ngx-maplibre-gl';
import { LngLat, LngLatLike, Map, MapLayerMouseEvent, MapMouseEvent, Popup } from 'maplibre-gl';
import { FeatureCollection, Point } from 'geojson';

import { PIN_MAP_SVG, STYLE_MAP_STREET, COLLECTION_VOID } from '@constants/index';
import { CoordToPoint, MapPointClickEvent } from '@interfaces/index';

/**
 * Componente personalizado cargar el mapa con los puntos de interes
 *
 * @example
 * * Caso de uso de componente sencillo
 * ```html
 * <app-map-custom
    [data]="my-data-component"
    activateTooltip
    [autoFitBounds]="true"
    (mapClick)="onMapClick($event)"
  />
 * ```
 *
 * @example
 * * Caso de uso de componente con el panel de edicion o un ng-content y ajustes
 * ```html
 * <app-map-custom
    [data]="data()"
    activateTooltip
    [reFitBounds]="reFitBounds"
    [center]="[-75.5761, 6.2448]"
    [autoFitBounds]="true"
    (mapClick)="onMapClick($event)"
    (pointClick)="onPointClick($event)"
    (mapReady)="onMapReady($event)"
  >
    <app-edit-panel
      (onUpdate)="onUpdatePoi($event)"
      [editingPoint]="editingPoint"
      (onClosePanel)="editingPoint = null"
      (deletePoi)="deletePoint()"
    />
  </app-map-custom>
 * ```
 */
@Component({
  selector: 'app-map-custom',
  templateUrl: './map-custom.component.html',
  styleUrls: ['./map-custom.component.css'],
  imports: [MapComponent, GeoJSONSourceComponent, LayerComponent],
})
export class MapCustomComponent {
  //////////////////////////////// Outputs ////////////////////////////////
  /** Emite el click en el mapa */
  @Output() mapClick = new EventEmitter<LngLat>();
  /** Emite el click en un punto */
  @Output() pointClick = new EventEmitter<MapPointClickEvent>();
  /** Emite evento cuando el mapa listo */
  @Output() mapReady = new EventEmitter<Map>();

  //////////////////////////////// Inputs ////////////////////////////////
  /** Activar el tooltip en los pois con el hover */
  @Input({ transform: booleanAttribute }) activateTooltip: boolean = false;

  /** Si se cambia la data, se ajusta el mapa a los bounds de los puntos */
  @Input() set reFitBounds(_: unknown) {
    this.fitMapToPoints();
  }
  /** Si recibe coordenadas data, se centra el mapa en los puntos */
  @Input() set centerToPoints(data: CoordToPoint | null) {
    if (!data) return;
    this.centerOnPoint(data);
  }

  /////////////////////////// Inputs signals ///////////////////////////
  /** Cambia el estilo de la mapa */
  styleMap = input<string>(STYLE_MAP_STREET);
  /** Cambia el icono de los puntos */
  pinMapSvg = input<string>(PIN_MAP_SVG);
  /** Cambia el zoom de la vista, por default es 12 */
  zoom = input<number>(12);
  /** Cambia el ancho del icono */
  pinSizeWidth = input<number>(19);
  /** Cambia la altura del icono */
  pinSizeHeight = input<number>(24);
  /** Ubicacion del centro por defecto */
  center = input<LngLatLike>([-75.5761, 6.2448]); // Medellín
  /** Data del mapa */
  data = input<FeatureCollection<Point>>({ ...COLLECTION_VOID });

  ///////////////////////// Control options /////////////////////////
  /** Ajusta automaticamente el mapa a los bounds de los puntos */
  autoFitBounds = input<boolean>(true);
  /** Activa el click en los puntos */
  enablePointClick = input<boolean>(true);
  /** Activa el click en el mapa */
  enableMapClick = input<boolean>(true);
  /** Nombre del icono personalizado */
  iconName = input<string>('custom-pin');
  /** Multiplicador de tolerancia en el click en los puntos, por default es 2 */
  toleranceMultiplier = input<number>(2);

  ////////////////////////// Internal state //////////////////////////
  map: Map | null = null;
  cursorStyle: string = '';
  private tooltip: Popup | null = null;
  private isMapReady = false;

  constructor() {
    // Watch for data changes and update map
    effect(() => {
      const newData = this.data();
      if (this.map && this.isMapReady) {
        this.updateMapData(newData);

        if (this.autoFitBounds() && newData.features.length > 0) {
          setTimeout(() => this.fitMapToPoints(), 100);
        }
      }
    });
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

  /** Actualiza los datos del mapa */
  private updateMapData(data: FeatureCollection<Point>): void {
    if (!this.map) return;

    const source = this.map.getSource('pois-source') as any;
    if (source && source.setData) {
      source.setData(data);
    }
  }

  /** Ajusta el mapa a los bounds de los puntos */
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
      maxZoom: this.zoom(),
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

  /** Maneja el click en el mapa */
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

  /** Maneja el click en un punto */
  onPointClick(evt: MapMouseEvent): void {
    if (!this.enablePointClick()) {
      return;
    }

    evt.preventDefault();

    const features = (evt as any).features;
    if (!features || features.length === 0) {
      return;
    }

    const clickedFeature = features[0];
    const clickedCoords = clickedFeature.geometry.coordinates;
    const clickedName = clickedFeature.properties.name;

    // Calculate tolerance with latitude adjustment and multiplier
    const tolerance = this.calculateToleranceByZoomAndLatitude();

    const index = this.data().features.findIndex((f) => {
      const coords = f.geometry.coordinates;
      const name = f.properties['name'];

      return (
        Math.abs(coords[0] - clickedCoords[0]) < tolerance.lng &&
        Math.abs(coords[1] - clickedCoords[1]) < tolerance.lat &&
        name === clickedName
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

  /**
   * Calculate coordinate tolerance based on zoom level and latitude
   * This version accounts for the fact that longitude degrees get smaller near the poles
   *
   * @returns Object with separate lng and lat tolerances
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

  /** CENTRAR EL MAPA EN UN PUNTO */
  public centerOnPoint(data: CoordToPoint): void {
    if (this.map) {
      this.map.flyTo({
        center: data.coordinates,
        zoom: data.zoom || this.map?.getZoom() || this.zoom(),
        duration: 1000,
      });
    }
  }

  /** CENTRAR EL MAPA EN LOS PUNTOS */
  public fitBounds(): void {
    this.fitMapToPoints();
  }

  /** OBTENER EL MAPA */
  public getMap(): Map | null {
    return this.map;
  }

  /** Mostrar tooltip en hover */
  showTooltip(evt: MapLayerMouseEvent): void {
    if (!this.map) {
      return;
    }

    this.cursorStyle = 'pointer';

    if (!this.activateTooltip) {
      return;
    }

    const features = evt.features || (evt as any).features;

    if (!features || features.length === 0) {
      return;
    }

    const feature = features[0];
    const coords = feature.geometry.coordinates.slice() as [number, number];
    const props = feature.properties || {};

    // Cerrar tooltip anterior si existe
    if (this.tooltip) {
      this.tooltip.remove();
      this.tooltip = null;
    }

    // Crear nuevo tooltip
    try {
      this.tooltip = new Popup({
        closeButton: false,
        closeOnClick: false,
        offset: [0, -15],
        className: 'map-tooltip',
      })
        .setLngLat(coords)
        .setHTML(
          `
          <div style="
            font-size: 12px;
            line-height: 1.5;
            padding: 4px 8px;
            min-width: 120px;
          ">
            <div style="font-weight: 600; color: #333; margin-bottom: 2px;">
              ${this.escapeHtml(props['name'] || 'Unnamed POI')}
            </div>
            <div style="color: #666; font-size: 12px;">
              ⭐ ${this.escapeHtml(props['category'] || 'No category')}
            </div>
            <div style="color: #666; font-size: 10px; margin-top: 4px;"></div>
              <b>Lng:</b> ${coords[0].toFixed(5)}, <b>Lat:</b> ${coords[1].toFixed(5)}
            </div>
          </div>
          `
        )
        .addTo(this.map);
    } catch (error) {
      console.error('❌ Error tooltip:', error);
    }
  }

  /** Ocultar tooltip */
  hideTooltip(): void {
    this.cursorStyle = '';

    if (this.tooltip) {
      this.tooltip.remove();
      this.tooltip = null;
    }
  }

  /** Escapar HTML en el tooltip */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

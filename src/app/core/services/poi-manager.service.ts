import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FeatureCollection, Feature, Point } from 'geojson';
import { GeoJsonValidatorService } from './geo-json-validator.service';

import { IStoreServiceInterface, ValidationResult } from '@interfaces/index';
import { COLLECTION_VOID } from '@constants/index';
import { createFileJson } from '@shared/utils';

/**
 * Servicio para manejar los puntos de interes
 *
 * * Guarda los puntos de interes en el store
 * * Carga los puntos de interes del store
 * * Actualiza los puntos de interes
 * * Elimina los puntos de interes
 * * Exporta los puntos de interes
 * * Importa los puntos de interes
 * * Valida los puntos de interes
 */
@Injectable({
  providedIn: 'root',
})
export class PoiManagerService {
  private dataSubject = new BehaviorSubject<FeatureCollection<Point>>(this.createEmptyCollection());
  public data$: Observable<FeatureCollection<Point>> = this.dataSubject.asObservable();

  constructor(
    private validator: GeoJsonValidatorService,
    private storeService: IStoreServiceInterface
  ) {
    this.loadFromStore();
  }

/**
 * Crea una coleccion vacía de FeatureCollection<Point>
 *
 * @returns una coleccion vacía de FeatureCollection<Point>
 */
  private createEmptyCollection(): FeatureCollection<Point> {
    return { ...COLLECTION_VOID };
  }

  /** RETORNA LOS DATOS DEL STORE SI EXISTEN */
  getData(): FeatureCollection<Point> {
    return this.dataSubject.value;
  }

  /** GUARDA LOS DATOS EN EL STORE */
  loadFromStore(): boolean {
    const stored = this.storeService.load();
    if (stored) {
      this.dataSubject.next(stored);
      return true;
    }
    return false;
  }

  /** VALIDA EL FORMATO E IMPORTA LOS DATOS */
  importGeoJson(data: any): ValidationResult {
    const result = this.validator.validate(data);

    if (result.validFeatures.length > 0) {
      const collection: FeatureCollection<Point> = {
        type: 'FeatureCollection',
        features: result.validFeatures,
      };
      this.dataSubject.next(collection);
      this.save();
    }

    return result;
  }

  /** AGREGA UN NUEVO PUNTO DE INTERES */
  addPoint(
    lon: number,
    lat: number,
    name: string = 'Nuevo Punto',
    category: string = 'default'
  ): void {
    const newFeature = this.validator.createFeature(lon, lat, name, category);
    const current = this.getData();

    const updated: FeatureCollection<Point> = {
      ...current,
      features: [...current.features, newFeature],
    };

    this.dataSubject.next(updated);
    this.save();
  }

  /** ACTUALIZA UN PUNTO DE INTERES */
  updatePoint(index: number, updates: { name?: string; category?: string }): void {
    const current = this.getData();

    if (index < 0 || index >= current.features.length) {
      return;
    }

    const features = [...current.features];
    features[index] = {
      ...features[index],
      properties: {
        ...features[index].properties,
        ...updates,
      },
    };

    const updated: FeatureCollection<Point> = {
      ...current,
      features,
    };

    this.dataSubject.next(updated);
    this.save();
  }

  /** ELIMINA UN PUNTO DE INTERES USANDO SU INDICE */
  deletePoint(index: number): void {
    const current = this.getData();

    if (index < 0 || index >= current.features.length) {
      return;
    }

    const features = current.features.filter((_, i) => i !== index);
    const updated: FeatureCollection<Point> = {
      ...current,
      features,
    };

    this.dataSubject.next(updated);
    this.save();
  }

  /** GUARDA LOS DATOS EN EL STORE */
  save(): void {
    this.storeService.save(this.getData());
  }

  /** EXPORTA LOS DATOS A UN ARCHIVO JSON */
  export(filename: string = 'pois.json'): void {
    createFileJson(this.getData(), filename);
  }

  /** LIMPIA LOS DATOS DEL STORE */
  clear(): void {
    this.storeService.clear();
    this.dataSubject.next(this.createEmptyCollection());
  }

  /** RETORNA EL NUMERO DE PUNTOS DE INTERES */
  getPointCount(): number {
    return this.getData().features.length;
  }
}

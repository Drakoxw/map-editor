import { Injectable } from '@angular/core';
import { ValidationResult } from '@interfaces/index';
import { Feature, Point } from 'geojson';

@Injectable({
  providedIn: 'root',
})
export class GeoJsonValidatorService {
  validate(data: any): ValidationResult {
    const result: ValidationResult = {
      validFeatures: [],
      invalidCount: 0,
      errors: {
        invalidCoordinates: 0,
        invalidGeometry: 0,
        missingProperties: 0,
        other: 0,
      },
    };

    if (!data || data.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
      return result;
    }

    for (const feature of data.features) {
      const validation = this.validateFeature(feature);

      if (validation.valid && validation.feature) {
        result.validFeatures.push(validation.feature);
      } else {
        result.invalidCount++;
        if (validation.error) {
          result.errors[validation.error]++;
        }
      }
    }

    return result;
  }

  private validateFeature(feature: any): {
    valid: boolean;
    feature?: Feature<Point>;
    error?: keyof ValidationResult['errors'];
  } {

    if (!feature || feature.type !== 'Feature') {
      return { valid: false, error: 'other' };
    }

    if (!feature.geometry || feature.geometry.type !== 'Point') {
      return { valid: false, error: 'invalidGeometry' };
    }

    const coords = feature.geometry.coordinates;
    if (!Array.isArray(coords) || coords.length < 2) {
      return { valid: false, error: 'invalidCoordinates' };
    }

    const [lon, lat] = coords;
    if (typeof lon !== 'number' || typeof lat !== 'number') {
      return { valid: false, error: 'invalidCoordinates' };
    }

    if (lon < -180 || lon > 180 || lat < -90 || lat > 90) {
      return { valid: false, error: 'invalidCoordinates' };
    }

    if (!feature.properties || typeof feature.properties !== 'object') {
      return { valid: false, error: 'missingProperties' };
    }

    const { name, category } = feature.properties;
    if (typeof name !== 'string' || typeof category !== 'string') {
      return { valid: false, error: 'missingProperties' };
    }

    // Valid feature
    return {
      valid: true,
      feature: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lon, lat],
        },
        properties: {
          name,
          category,
          ...feature.properties,
        },
      } as Feature<Point>,
    };
  }

  createFeature(lon: number, lat: number, name: string, category: string, id?: string): Feature<Point> {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lon, lat],
      },
      properties: {
        id,
        name,
        category,
      },
    };
  }
}

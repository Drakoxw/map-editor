import { Feature, Point } from 'geojson';

export interface ValidationResult {
  validFeatures: Feature<Point>[];
  invalidCount: number;
  errors: {
    invalidCoordinates: number;
    invalidGeometry: number;
    missingProperties: number;
    other: number;
  };
}

export interface EditingPoint {
  index: number;
  name: string;
  category: string;
}

export interface MapPointClickEvent {
  index: number;
  coordinates: [number, number];
  properties: any;
}

export interface CoordToPoint {
  zoom?: number;
  coordinates: [number, number];
}

export interface Funcionalities {
  title: string;
  color: string;
  items: {
    title: string;
    description: string;
  }[];
}

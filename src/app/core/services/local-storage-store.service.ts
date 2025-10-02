import { Injectable } from '@angular/core';
import { FeatureCollection, Point } from 'geojson';

import { IStoreServiceInterface } from '@interfaces/index';

const STORAGE_KEY = 'poi_editor_state';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageStoreService implements IStoreServiceInterface {
  save(data: FeatureCollection<Point>): void {
    try {
      const json = JSON.stringify(data);
      localStorage.setItem(STORAGE_KEY, json);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw new Error('Failed to save data');
    }
  }

  load(): FeatureCollection<Point> | null {
    try {
      const json = localStorage.getItem(STORAGE_KEY);
      if (!json) {
        return null;
      }
      return JSON.parse(json);
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  hasData(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }
}

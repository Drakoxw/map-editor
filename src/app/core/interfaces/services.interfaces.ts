import { FeatureCollection, Point } from 'geojson';

/**
 * Interfaz abstracta para servicios de almacenamiento de FeatureCollection<Point>.
 * Define las operaciones básicas de un "store".
 */
export abstract class IStoreServiceInterface {
  /** GUARDA LOS DATOS EN EL STORE */
  abstract save(data: FeatureCollection<Point>): void;

  /** RETORNA LOS DATOS DEL STORE SI EXISTEN */
  abstract load(): FeatureCollection<Point> | null;

  /** LIMPIA LOS DATOS DEL STORE */
  abstract clear(): void;

  /** VALIDA SI HAY DATOS */
  abstract hasData(): boolean;
}

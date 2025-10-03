import { FeatureCollection, Point } from 'geojson';

export const STYLE_MAP_STREET =
  'https://api.maptiler.com/maps/streets/style.json?key=2pAO4Wm6JhMJzzcCNToV';

export const COLLECTION_VOID: FeatureCollection<Point> = {
  type: 'FeatureCollection',
  features: [],
}

export const PIN_MAP_SVG = `<svg width="19" height="24" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.2 0 0 7.2 0 16c0 11.4 16 24 16 24s16-12.6 16-24C32 7.2 24.8 0 16 0z"
              fill="#FF5252"/>
        <circle cx="16" cy="16" r="6" fill="white"/>
      </svg>`;

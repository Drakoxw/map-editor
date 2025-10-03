import { Funcionalities } from '@interfaces/index';

export const SERVICE_GEO_JSON_VALIDATOR = {
  title: 'IStoreServiceInterface',
  span: '(interface)',
  color: 'orange',
  description: 'Métodos Obligatorios:',
  code: 'provide: IStoreServiceInterface, useClass: AnyStoreService',
  list: ['IStoreServiceInterface'],
};

export const FUNCIONALITIES_ANGULAR: Funcionalities = {
  title: 'Angular y dependencias',
  color: 'red',
  items: [
    {
      title: 'Angular 20 - Sin zonejs',
      description: 'Al crear el proyecto se creo sin la libreria zonejs',
    },
  ],
  class: '',
};

export const FUNCIONALITIES_CORE: Funcionalities = {
  title: 'Funcionalidades Core',
  color: 'green',
  items: [
    {
      title: 'Visualización de Mapa Interactivo',
      description: 'MapLibre GL JS con marcadores personalizados',
    },
    {
      title: 'Agregar Puntos',
      description: 'Click en el mapa para crear nuevos POIs',
    },
    {
      title: 'Editar Puntos',
      description: 'Modificar propiedades de nombre y categoría',
    },
    {
      title: 'Eliminar Puntos',
      description: 'Remover POIs con diálogo de confirmación',
    },
  ],
  class: 'bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold',
};

export const FUNCIONALITIES_ADVANCED: Funcionalities = {
  title: 'Funcionalidades Avanzadas',
  color: 'blue',
  items: [
    {
      title: 'Importar GeoJSON',
      description: 'Cargar archivos .geojson con validación',
    },
    {
      title: 'Exportar GeoJSON',
      description: 'Descargar estado actual como .geojson',
    },
    {
      title: 'Persistencia Local',
      description: 'Auto-guardado y restauración con localStorage',
    },
    {
      title: 'Validación de Datos',
      description: 'Manejo robusto de errores con reportes detallados',
    },
  ],
  class: 'bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold',
};

export const FUNCIONALITIES_UX: Funcionalities = {
  title: 'Mejoras de UX',
  color: 'purple',
  class: 'bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold',
  items: [
    {
      title: 'Tooltips al Pasar el Mouse',
      description: 'Mostrar información del POI al hover',
    },
    {
      title: 'Popups al Hacer Click',
      description: 'Información detallada con coordenadas',
    },
    {
      title: 'Auto Ajuste de Límites',
      description: 'Centrado automático en puntos cargados',
    },
    {
      title: 'Retroalimentación de Validación',
      description: 'Mensajes de error claros y resúmenes',
    },
  ],
};

export const FUNCTIONALITIES_TECHNICAL: Funcionalities = {
  title: 'Funcionalidades Técnicas',
  color: 'orange',
  items: [
    {
      title: 'Tolerancia Basada en Zoom',
      description: 'Precisión dinámica de detección de clicks',
    },
    {
      title: 'Gestión de Estado Reactivo',
      description: 'Observables RxJS para flujo de datos',
    },
    {
      title: 'TypeScript Estricto',
      description: 'Seguridad de tipos completa e interfaces',
    },
    {
      title: 'Reutilización de Componentes',
      description: 'Componente de mapa genérico con inputs',
    },
  ],
  class: 'bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold',
};

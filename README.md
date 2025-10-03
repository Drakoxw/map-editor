# 🌍 Editor de POI con MapLibre

Este proyecto es una aplicación web construida con **Angular** y desplegada en **Netlify** o usando **Docker**.

### Arquitectura de modulos orientada a servicios (MVVM). 

> [Angular CLI](https://github.com/angular/angular-cli) version 20.3.3.

---

## 📦 Tecnologías utilizadas
- [Angular 20 (sin ZoneJs)](https://angular.dev/) - Framework frontend
- [MapLibre](https://maplibre.org/) - Librería de mapas
- [Docker](https://www.docker.com/) - Contenerización
- [Nginx](https://nginx.org/) - Servidor web para producción
- [Node.js 22.20.0](https://nodejs.org/) - Entorno de construcción

---

## 🌐 App Desplegada
Despliegue realizado en netlify
* [Inicio](https://editor-map-poi.netlify.app)
* [Editor](https://editor-map-poi.netlify.app/map-editor)


## 🚀 Instalación local

Clonar el repositorio:
```bash
git clone https://github.com/Drakoxw/map-editor.git
cd map-editor
```

Instalar dependencias e iniciar app
```sh
npm install
npm start
```

> [http://localhost:4200](http://localhost:4200) en el navegador

## 🐳 Construcción con Docker
#### Compose
Crear el contenedor e iniciarlo
```sh
docker-compose up --build -d    
```

#### Manual

Crear el contenedor e iniciarlo
```sh
docker build -t maplibre-app .
```
```sh
docker run -p 4000:80 maplibre-app
```
> Abre el navegador: [http://127.0.0.1:4000](http://127.0.0.1:4000)


## 📂 Estructura del proyecto

```bash
MAPLIBRE/
├── node_modules/              # Dependencias del proyecto
├── public/                    # Archivos públicos
├── src/                       # Código fuente principal
│   ├── app/                   # Core de la aplicación Angular
│   │   ├── core/              # Configuración y lógica central
│   │   │   ├── constants/     # Constantes globales
│   │   │   ├── interfaces/    # Interfaces y tipos TypeScript
│   │   │   └── services/      # Servicios inyectables (singleton)
│   │   ├── modules/           # Módulos de características
│   │   │   ├── about/         # Módulo "About"
│   │   │   ├── home/          # Módulo "Home"
│   │   │   └── poi-editor/    # Módulo "POI Editor" (editor de mapas)
│   │   └── shared/            # Recursos compartidos reutilizables
│   │       ├── components/    # Componentes UI comunes
│   │       ├── pipes/         # Pipes personalizados
│   │       └── utils/         # Funciones utilitarias
│   ├── app.config.ts          # Configuración inicial
│   ├── app.css                # Estilos específicos de AppComponent
│   ├── app.html               # Template principal
│   ├── app.routes.ts          # Definición de rutas
│   ├── app.spec.ts            # Pruebas unitarias de AppComponent
│   ├── app.ts                 # Definición del AppComponent
│   ├── index.html             # HTML base de la app
│   ├── main.ts                # Punto de entrada de Angular
│   └── styles.css             # Estilos globales
├── .dockerignore              # Archivos/Carpetas ignoradas por Docker
├── .editorconfig              # Configuración de estilos de editor
├── .gitignore                 # Archivos/Carpetas ignoradas por Git
├── angular.json               # Configuración de Angular CLI
├── docker-compose.yml         # Orquestación de contenedores
├── Dockerfile                 # Imagen de construcción y despliegue
├── netlify.toml               # Configuración de Netlify (deploy)
├── package.json               # Dependencias y scripts npm
└── tsconfig.json              # Configuración TypeScript
```

## 👤 Autor

### Wilmar RM (Drako)

* 📧 drakowdev@gmail.com
* 🌐 [linkedin](https://www.linkedin.com/in/wilmar-roncancio-mendez-b344761bb/)
* 📱[+57 310 801 83888](https://wa.me/573108018388)

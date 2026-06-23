# To-Do Mobile App

## Descripción

Aplicación móvil híbrida desarrollada con Ionic y Angular para la gestión de tareas (To-Do List), permitiendo a los usuarios crear, completar, eliminar y organizar tareas mediante categorías.

La aplicación implementa persistencia local, filtrado por categorías, integración con Firebase Remote Config para la gestión de Feature Flags y optimizaciones de rendimiento enfocadas en la experiencia de usuario y el manejo eficiente de datos.

---

## Funcionalidades Implementadas

### Gestión de Tareas

* Crear nuevas tareas.
* Marcar tareas como completadas o pendientes.
* Eliminar tareas.
* Persistencia local de tareas.

### Gestión de Categorías

* Crear categorías.
* Editar categorías.
* Eliminar categorías.
* Asignar categorías a tareas.
* Mantener integridad de datos al eliminar categorías.

### Filtrado

* Visualizar todas las tareas.
* Filtrar tareas por categoría.
* Filtrar tareas sin categoría.

### Persistencia Local

La aplicación utiliza almacenamiento local para conservar la información entre sesiones, evitando la pérdida de datos al cerrar la aplicación.

### Firebase Remote Config

Se implementó Firebase Remote Config para controlar funcionalidades mediante Feature Flags.

#### Feature Flag Implementado

| Parámetro         | Descripción                                                             |
| ----------------- | ----------------------------------------------------------------------- |
| enable_categories | Habilita o deshabilita toda la funcionalidad relacionada con categorías |

Esto permite activar o desactivar características sin necesidad de publicar una nueva versión de la aplicación.

---

## Tecnologías Utilizadas

* Ionic
* Angular
* TypeScript
* Capacitor
* Firebase
* Firebase Remote Config
* Capacitor Preferences
* RxJS

---

## Arquitectura del Proyecto

La aplicación fue organizada siguiendo principios de separación de responsabilidades.

```
src/
└── app/
    ├── core/
    │   ├── constants/
    │   ├── interfaces/
    │   └── services/          
    │
    ├── models/                
    │   ├── category.model.ts
    │   └── task.model.ts
    │
    ├── pages/                 
    │   ├── categories/        
    │   ├── home/              
    │   └── tasks/           
    │
    ├── shared/                
    │
    ├── app.component.html
    ├── app.component.scss
    ├── app.component.spec.ts
    ├── app.component.ts
    └── app.routes.ts

```

### Servicios Principales

#### StorageService

Responsable de centralizar el acceso al almacenamiento local.

#### TaskService

Gestiona todas las operaciones relacionadas con tareas.

#### CategoryService

Gestiona las operaciones CRUD de categorías.

#### CategoryManagerService

Gestiona la integridad entre tareas y categorías.

#### FirebaseService

Inicializa y configura Firebase.

#### RemoteConfigService

Obtiene y administra los parámetros de Firebase Remote Config.

#### FeatureService

Expone los Feature Flags consumidos por la aplicación.

---

## Instalación y Ejecución

### Requisitos

* Node.js 20+
* npm
* Ionic CLI

### Instalar dependencias

```bash
npm install
```

### Ejecutar en navegador

```bash
ionic serve
```

---

## Compilación Android

### Generar build web

```bash
ionic build
```

### Sincronizar Capacitor

```bash
npx cap sync android
```

### Abrir Android Studio

```bash
npx cap open android
```

### Generar APK

Desde Android Studio:

Build → Generate Signed Bundle / APK → APK

---

## Compilación iOS

### Sincronizar proyecto

```bash
npx cap sync ios
```

### Abrir proyecto

```bash
npx cap open ios
```

### Generar IPA

La generación de archivos IPA requiere un entorno macOS con Xcode instalado.

---

## Configuración Firebase

La aplicación utiliza Firebase Remote Config.

Archivo:

```text
src/environments/environment.ts
```

Configuración:

```typescript
firebase: {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
}
```

### Parámetros Remote Config

| Parámetro         | Tipo    | Valor por defecto |
| ----------------- | ------- | ----------------- |
| enable_categories | Boolean | true              |

---

## Optimizaciones de Rendimiento Implementadas

### Change Detection Optimizada

Se utilizó:

```typescript
ChangeDetectionStrategy.OnPush
```

para reducir renderizados innecesarios.

### TrackBy en Listas

Se implementó:

```typescript
trackBy()
```

para mejorar el rendimiento en listas de gran tamaño.

### Caché en Memoria

Los datos se mantienen en memoria para evitar lecturas repetidas desde almacenamiento local.

### Carga Paralela

Se utiliza:

```typescript
Promise.all()
```

para cargar información en paralelo durante la inicialización.

### Minimización de Búsquedas Repetitivas

Se implementó un mapa de categorías para acceso en tiempo constante O(1).

---

## Capturas de Pantalla

Las capturas se encuentran en:

```text
docs/screenshots
```

Incluyen:

* Lista de tareas.
* Gestión de categorías.
* Filtrado por categoría.
* Feature Flag activado.
* Feature Flag desactivado.

---

## Video Demostrativo

Video disponible en:

https://youtu.be/wFQHD7glBD0

---


### 🤖 APK Generado (Android)
El binario ejecutable y compilado de la aplicación se encuentra generado y disponible directamente en la estructura de este repositorio para pruebas de instalación nativa:
* **Ruta local:** `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🎨 Optimizaciones de Experiencia de Usuario (UX/UI)

Más allá del rendimiento lógico, se implementaron patrones de diseño móvil nativo para mitigar la fricción del usuario:

* **Alertas Nativas de Confirmación:** Integración de `AlertController` con roles de destrucción (`role: 'destructive'`) antes de eliminar tareas o categorías para evitar pérdidas accidentales de datos.
* **Flujos de Entrada Limpios:** Eliminación total de prompts del navegador, sustituyéndolos por formularios incrustados en `IonModal` y alertas nativas para operaciones de creación y edición.
* **Feedback Asíncrono (Toasts):** Centralización de notificaciones flotantes temporales mediante un servicio utilitario de UI (`UiService`) para confirmar éxitos o advertir errores en tiempo de ejecución.
* **Gesto Pull-To-Refresh:** Inclusión de `<ion-refresher>` en las pantallas principales para permitir la sincronización manual e intuitiva de la persistencia de datos.
* **Diseño para Estados Vacíos (Empty States):** Control de interfaces sin datos mediante ilustraciones vectoriales semánticas (`ion-icon`) e instrucciones claras de acción (*Call to Action*).

## Respuestas Técnicas

### ¿Cuáles fueron los principales desafíos que enfrentaste?
El principal desafío consistió en diseñar una estructura que permitiera mantener la relación entre tareas y categorías garantizando la consistencia de los datos almacenados localmente (integridad referencial reactiva mediante `CategoryManagerService`). También representó un reto mitigar los ciclos de renderizado colaterales al implementar `ChangeDetectionStrategy.OnPush` combinada con mutaciones de filtros mediante selectores nativos, lo cual se resolvió acoplando accesos mediante getters/setters sincronizados con el ciclo de vida `ChangeDetectorRef.markForCheck()`.

### ¿Qué técnicas de optimización aplicaste y por qué?
Se implementó `ChangeDetectionStrategy.OnPush` para minimizar renderizados innecesarios, `trackBy` para optimizar el manejo del DOM en listas, caché en memoria para evitar accesos distributivos al almacenamiento local, carga paralela mediante `Promise.all()` para reducir tiempos de inicialización y un mapa indexado de categorías para accesos rápidos en tiempo constante $O(1)$. Adicionalmente, se forzó el empaquetado nominal de iconos vía `addIcons` para optimizar el *Tree Shaking* del bundle de producción.

### ¿Cómo aseguraste la calidad y mantenibilidad del código?
Se aplicó una separación clara de responsabilidades mediante servicios especializados para almacenamiento, tareas, categorías y configuración remota bajo una arquitectura modular limpia (Core / Pages / Shared). Asimismo, se evitó el acoplamiento rígido de los componentes de presentación con las capas nativas delegando el control de diálogos, loaders y toasts a fachadas globales inyectables.

---

## Posibles Mejoras Futuras

* Sincronización con backend remoto.
* Autenticación de usuarios.
* Notificaciones push.
* Soporte offline avanzado.
* Virtualización de listas para grandes volúmenes de datos.
* Pruebas unitarias y de integración automatizadas.

---

## Autor

Desarrollado por Santiago Rivera como parte de una prueba técnica para evaluación de habilidades en desarrollo móvil con Ionic y Angular.
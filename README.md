# ShipNow API

API REST de ShipNow hecha con Node.js, Express (ES Modules), MongoDB y Mongoose.
Pre-entrega 1: arquitectura por capas y configuración de entorno validada.

## Cómo correrlo localmente

Requisitos: Node.js 20 o superior y una base MongoDB (Atlas o local).

```bash
npm install
cp .env.example .env   # completar con tus valores
npm run dev            # o npm start
```

La API queda en `http://localhost:<PORT>`.

## Variables de entorno

Definidas en `.env.example`:

| Variable      | Descripción                          | Ejemplo                                     |
| ------------- | ------------------------------------ | ------------------------------------------- |
| `PORT`        | Puerto del servidor                  | `8080`                                      |
| `MONGODB_URI` | Cadena de conexión a MongoDB         | `mongodb+srv://...` o `mongodb://127.0.0.1:27017/shipnow` |
| `NODE_ENV`    | Entorno de ejecución                 | `development`                               |

Las tres son obligatorias. `src/config/env.config.js` las valida al importarse y,
si falta alguna, la app no arranca:

```
Error: Falta configurar la variable de entorno: MONGODB_URI
```

Ningún otro archivo lee `process.env`: todo el proyecto usa el objeto `config`.

## Endpoints

| Método | Ruta                 | Descripción                                   |
| ------ | -------------------- | --------------------------------------------- |
| GET    | `/api/products`      | Lista los productos con stock                 |
| GET    | `/api/products/:id`  | Obtiene un producto (404 si no tiene stock)   |
| POST   | `/api/products`      | Crea un producto                              |
| PUT    | `/api/products/:id`  | Actualiza un producto                         |
| DELETE | `/api/products/:id`  | Elimina un producto                           |
| GET    | `/api/users`         | Lista los usuarios (sin password)             |
| GET    | `/api/users/:id`     | Obtiene un usuario                            |
| POST   | `/api/users`         | Crea un usuario (password hasheada con bcrypt)|
| PUT    | `/api/users/:id`     | Actualiza un usuario                          |
| DELETE | `/api/users/:id`     | Elimina un usuario                            |

Producto: `title`, `description`, `code` (único), `price`, `stock`, `category`.
El `status` (`available` / `out_of_stock`) lo calcula el servidor según el stock.

Usuario: `first_name`, `last_name`, `email` (único), `age`, `password`, `role` (`user` por defecto, o `admin`).

Las respuestas siguen siempre el mismo formato:

```json
{ "status": "success", "payload": {} }
{ "status": "error", "message": "Producto no encontrado" }
```

## Estructura y flujo de las capas

```
server.js                  conecta a MongoDB y levanta Express
src/
├── app.js                 middlewares, routers y manejo de errores
├── config/env.config.js   carga y valida las variables de entorno
├── constants/index.js     USER_ROLES y PRODUCT_STATUS (congelados)
├── utils/                 re-export de constantes y clase AppError
├── middlewares/           respuesta JSON uniforme para errores y 404
├── routes/                path → método del controller
├── controllers/           req/res y status codes
├── services/              reglas de negocio
├── repositories/          acceso a datos con Mongoose
└── models/                esquemas de Mongoose
```

```
Request → Router → Controller → Service → Repository → Model → MongoDB
```

- **Router:** conecta cada ruta con su método del controller, sin lógica.
- **Controller:** única puerta de entrada HTTP. Lee `req`, llama al service, responde con el status code y deriva los errores a `next(error)`. No conoce Mongoose.
- **Service:** reglas de negocio, sin `req`/`res`. Calcula el status del producto según el stock, filtra los productos sin stock, valida emails duplicados y hashea la password.
- **Repository:** único lugar que usa Mongoose. Aplica orden por defecto, proyecciones (nunca devuelve la password) y validaciones en los updates.
- **Model:** solo define el esquema.

## ¿Por qué separar Service y Repository?

El service decide **qué** hay que hacer (las reglas del negocio) y el repository
sabe **cómo** se guardan y se leen los datos. Así las reglas no dependen de Mongoose:
si mañana cambia la base o la forma de consultarla, solo se toca el repository.
Las reglas quedan en un solo lugar, más fáciles de leer y de probar, y los detalles
de acceso, como ocultar la password o el orden por defecto, no se repiten en cada
caso de uso.

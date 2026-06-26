# HomeEssentials - Demo Ecommerce

¡Bienvenido a **HomeEssentials**! Este proyecto es una plataforma de comercio electrónico (e-commerce) completa y moderna, desarrollada como una demostración integral de habilidades de desarrollo frontend y manejo de estado.

## 🚀 Alcance del Proyecto

HomeEssentials está diseñado para simular una experiencia de compra en línea realista y completa. El alcance del proyecto incluye:

* **Experiencia de Cliente (B2C):**

  * **Catálogo de Productos:** Exploración de productos, filtrado por categorías y vistas detalladas de cada artículo.
  * **Carrito de Compras:** Gestión dinámica del carrito de compras vinculada a la cuenta del usuario.
  * **Autenticación y Perfiles:** Registro e inicio de sesión de usuarios (Sign Up / Sign In) y un panel de control personalizado (User Panel).
  * **Pasarelas de Pago:** Integración de métodos de pago seguros utilizando **Stripe** y **MercadoPago**.
  * **Páginas Informativas:** Secciones de "Acerca de nosotros", "Contacto", "Atención al cliente" y un formulario para envío de CV.
* **Panel de Administración (Admin):**

  * **Dashboard Administrativo:** Interfaz exclusiva para administradores.
  * **Gestión de Inventario:** Panel para la administración de los productos de la tienda.
  * **Gestión de Pedidos:** Visualización y seguimiento de las órdenes de compra realizadas por los clientes.
  * **Gestión de Usuarios:** Control sobre las cuentas registradas en la plataforma.
  * **Atención al Cliente:** Bandeja de entrada para gestionar los mensajes enviados a través del formulario de contacto.

## 🛠️ Stack Tecnológico

El proyecto está construido con tecnologías modernas para asegurar un rendimiento óptimo, escalabilidad y un desarrollo ágil:

* **Core:** [React 18](https://reactjs.org/) motorizado por [Vite](https://vitejs.dev/) para un entorno de desarrollo ultra rápido.
* **Enrutamiento:** [React Router DOM](https://reactrouter.com/) para la navegación entre las múltiples vistas de la aplicación (SPA).
* **Manejo de Estado:** [Redux Toolkit](https://redux-toolkit.js.org/) para una gestión predecible y centralizada del estado global (carrito, sesión de usuario, etc.).
* **Estilos y Componentes UI:**
  * [Tailwind CSS](https://tailwindcss.com/) para estilos utilitarios y diseño responsivo.
  * Librerías de componentes como [@nextui-org/react](https://nextui.org/) y [@headlessui/react](https://headlessui.com/).
  * Iconografía provista por [Heroicons](https://heroicons.com/), [FontAwesome](https://fontawesome.com/) y [React Icons](https://react-icons.github.io/react-icons/).
* **Backend como Servicio (BaaS):** [Firebase](https://firebase.google.com/) y [MongoDB](https://www.mongodb.com/) utilizado para la base de datos y JWT para la autenticación segura de usuarios con hasheos de contraseña.
* **Pagos:** Integración con los SDKs oficiales de [Stripe](https://stripe.com/) y [MercadoPago](https://www.mercadopago.com/).

## ⚙️ Instalación y Uso Local

Para ejecutar este proyecto localmente, sigue estos pasos:

1. Clona el repositorio en tu máquina local.
2. Navega al directorio del proyecto: `cd HomeEssentials-demo`
3. Instala las dependencias: `npm install`
4. Inicia el servidor de desarrollo: `npm run dev`

---

*Desarrollado como demostración de un E-commerce escalable.*

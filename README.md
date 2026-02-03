# Las Romeas – Next.js

Migración de [lasromeas.com](https://lasromeas.com) de WordPress a **Next.js 14 + Tailwind CSS**.

---

## 🚀 Setup rápido

```bash
npm install
npm run dev   # → http://localhost:3000
```

---

## 📂 Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx          # Layout raíz (metadata, fuentes)
│   ├── globals.css         # Tailwind + estilos globales + variables
│   ├── page.tsx            # Home
│   ├── about/
│   │   └── page.tsx        # Sobre nosotros
│   ├── shop/
│   │   ├── page.tsx        # Shop general (filtros + búsqueda)
│   │   └── [slug]/
│   │       └── page.tsx    # Página de categoría dinámica
│   └── contact/
│       └── page.tsx        # Contacto
├── components/
│   ├── Navbar.tsx          # Nav responsive con dropdown + search modal
│   ├── Footer.tsx          # Footer completo
│   ├── HeroSlider.tsx      # Carousel hero con autoplay
│   ├── ProductCard.tsx     # Card de producto con hover
│   ├── ContactForm.tsx     # Formulario validado con estado de éxito
│   └── useScrollAnimation.ts  # Hook IntersectionObserver (fade-up)
└── data/
    ├── categories.ts       # Categorías del shop
    └── products.ts         # Productos + helpers
```

---

## 🎨 Design System

| Token             | Valor           | Uso                        |
|-------------------|-----------------|----------------------------|
| `chocolate.darkest` | `#1A0F0A`     | Fondo principal            |
| `chocolate.dark`  | `#2C1810`       | Fondos secundarios         |
| `chocolate.warm`  | `#5C3D2E`       | Bordes, separadores        |
| `cream.DEFAULT`   | `#F5F0E8`       | Texto principal            |
| `gold.DEFAULT`    | `#C9A96E`       | Acento primario            |
| `gold.dark`       | `#A07F4A`       | Botones CTA                |

**Fuentes:**
- **Playfair Display** → headings (serif elegante)
- **Cormorant Garamond** → body (serif refinado, ligero)

---

## 📝 Cómo conectar datos reales

### 1. Productos & Categorías

Ahora mismo los datos vienen de archivos estáticos en `src/data/`. Para conectar a una base de datos o CMS:

- **Opción A – Headless CMS** (recomendada): Conectar a Strapi, Sanity, o Contentful. Reemplazar las importaciones en cada `page.tsx` por llamadas a la API con `fetch` en Server Components.

- **Opción B – API propia**: Crear rutas en `src/app/api/` y consumirlas desde los componentes.

### 2. Imágenes

Las imágenes actualmente son placeholders (gradientes). Para usar las reales:

1. Descargar las imágenes de `lasromeas.com`
2. Ponerlas en `/public/images/`
3. Usar el componente `<Image>` de Next.js en lugar de los `<div>` placeholder

```tsx
import Image from "next/image";

<Image src="/images/producto.jpg" alt="..." width={400} height={400} />
```

### 3. Formulario de contacto

En `ContactForm.tsx` reemplazar la línea de `setTimeout` por tu llamada real:

```tsx
// Ejemplo con tu API route:
await fetch("/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
```

### 4. Carrito de compras

La lógica del carrito está pendiente. Opciones:
- **Sshopify Storefront API** – si van a usar Shopify como backend de ecommerce
- **Estado global** con Zustand o Context + localStorage
- **Stripe** para pagos directos

---

## ⚡ Stack & Performance

| Tecnología | Por qué |
|------------|---------|
| Next.js 14 App Router | Server Components, streaming, routing basado en carpetas |
| Tailwind CSS | Utilidades por defecto, tree-shaking automático, sin CSS muerto |
| TypeScript | Tipado estático, autocompletado, menos errores |
| CSS-only transitions | Sin librerías pesadas de animación para el slider y micro-interacciones |
| IntersectionObserver | Scroll animations sin scroll event listeners costosos |

---

## 📱 Responsive

- **Mobile**: navbar hamburger con accordion, filtros de shop como pills, grid 2 columnas
- **Tablet**: grid 3 columnas, sidebar oculto
- **Desktop (lg+)**: sidebar visible, grid 4 columnas, dropdown nav

---

## 🔧 Scripts disponibles

| Script | Qué hace |
|--------|----------|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción optimizado |
| `npm run start` | Servir el build de producción |
| `npm run lint` | ESLint con reglas de Next.js |

# lasromeas
# lasromeas

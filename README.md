## Getting Started

Comandos para instalar y ejecutar el proyecto, se necesita npm y tener clonado el repositorio de github

### npm

En caso de no tener npm se puede instalar con el siguiente comando

```bash
sudo apt install npm
```

### proyect

estando en el root del proyecto ejecutar los siguientes comandos. :

```bash
npm install
```

Este comando se utiliza para instalar las dependencias que estan definidas en el archivo `package.json`

```bash
npm run dev
```

El comando ejecuta un script definido en el archivo `package.json` bajo la sección "scripts". Este script suele ser utilizado para ejecutar el proyecto en modo de desarrollo.

Luego de seguir los pasos abrir [http://localhost:3000](http://localhost:3000) en el navegador para ver los resultados.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

-   [Next.js Documentation](https://nextjs.org/docs) - link a la documentacion de Next.js(usamos app router).
-   [Learn Next.js](https://nextjs.org/learn) - tutorial interactivo para aprender!

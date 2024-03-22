# Image Upload PWA Example

This project, **image-upload-pwa-example**, is a modern web application built using React, TypeScript, and Vite. It's designed as a Progressive Web App (PWA) and allows users to load and save images to IndexedDB from their camera roll or directly from their camera. For a true PWA experience, it is configured to be served over HTTPS, even in development, using `https-localhost`.

## Getting Started

These instructions will guide you through setting up the project on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or later)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/snowball-tools/image-upload-pwa-example.git
   cd image-upload-pwa-example
   ```

2. Install the dependencies

   ```bash
   npm install
   ```

### Running the Development Server over HTTPS

This project uses `https-localhost` to serve content securely during development. To start the development server with HTTPS enabled, use the `dev:https` script:

```bash
npm run dev:https
```

After starting the server, open [https://localhost](https://localhost) in your browser to view the app. `https-localhost` ensures the local development certificate is trusted by your browser, facilitating the testing of PWA features that require HTTPS, such as service workers and secure context features.

## Features

- **React** for building user interfaces with a component-based architecture.
- **TypeScript** for static type definitions, enhancing development experience and code quality.
- **Vite** for ultra-fast development and bundling, leveraging modern web technologies.
- **PWA** setup for offline support, background sync, and installability, with a secure HTTPS development environment provided by https-localhost.

## Building for Production

To build the app for production, run the following command:

```bash
npm run build
```

This will generate a dist directory with your compiled assets, ready to be deployed.

## Deployment

Refer to the [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy) for specific instructions on deploying your application to popular hosting providers.

## License

This project is licensed under the MIT License.

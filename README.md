# Reactive Components with RxJS

Workshop for Statewide IT 2019, Indiana University.

## Install

Install dependencies.

```
npm install
```

## Start

Start the local development server, and open the browser to [`http://localhost:8000/`](http://localhost:8000/). The opened page [`/index.html`](./index.html) provides links to the app demo ([`/demo/`](./demo/)), slide examples ([`/slides/`](./slides/index.html)), and exercises ([`/exercises/`](./exercises/)).

```
npm run start
```

## Development environment

This repo uses a ["buildless" environment](https://dev.to/open-wc/on-the-bleeding-edge-3cb8). There is no Webpack or other bundling system. [`@pika/web`](https://github.com/pikapkg/web) prepares browser dependencies as JS modules and generates an import map. [`es-module-shims`](https://github.com/guybedford/es-module-shims) provides support for [import maps](https://github.com/WICG/import-maps), JS modules, and CSS modules (via [`construct-style-sheets-polyfill`](https://github.com/calebdwilliams/construct-style-sheets)).

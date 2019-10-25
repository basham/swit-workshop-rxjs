# Reactive Components with RxJS

Workshop for Statewide IT 2019, Indiana University.

## Description

Learn how to integrate [RxJS](https://github.com/ReactiveX/rxjs) with web components and rendering libraries ([lighterhtml](https://github.com/WebReflection/lighterhtml) and [React](https://reactjs.org/)). Leverage observables, discover patterns for compositing complex components, learn to position components so they can effectively communicate and cooperate, no matter the technologies you use now or in the future.

[Chris Basham](https://bash.am/) leads the workshop. He is a designer and front-end developer for Indiana University, specializing in functional reactive programming with RxJS.

## Install

Install dependencies.

```
npm install
```

## Start

Start the local development server, and open the browser to [`http://localhost:8000/`](http://localhost:8000/). The opened page ([`/index.html`](./index.html)) provides links to the app demo ([`/demo/`](./demo/)), slide examples ([`/slides/`](./slides/index.html)), and exercises ([`/exercises/`](./exercises/)).

```
npm run start
```

## Development environment

This repo uses a ["buildless" environment](https://dev.to/open-wc/on-the-bleeding-edge-3cb8). There is no Webpack or other bundling system. [`@pika/web`](https://github.com/pikapkg/web) prepares browser dependencies as JS modules and generates an import map. [`es-module-shims`](https://github.com/guybedford/es-module-shims) provides support for [import maps](https://github.com/WICG/import-maps), JS modules, and CSS modules (via [`construct-style-sheets-polyfill`](https://github.com/calebdwilliams/construct-style-sheets)).

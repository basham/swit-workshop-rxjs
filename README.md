# Reactive Components with RxJS

Workshop for [Statewide IT Conference](https://statewideit.iu.edu/) at Indiana University

October 28, 2019

## Description

Learn how to integrate [RxJS](https://github.com/ReactiveX/rxjs) with web components and rendering libraries ([lighterhtml](https://github.com/WebReflection/lighterhtml) and [React](https://reactjs.org/)). Leverage observables, discover patterns for compositing complex components, learn to position components so they can effectively communicate and cooperate, no matter the technologies you use now or in the future.

[Chris Basham](https://bash.am/) leads the workshop. He is a designer and front-end developer for Indiana University, specializing in functional reactive programming with RxJS.

## Install

Fork this repo if you want to save progress on your exercises to GitHub.

Open a terminal window. Navigate to a folder which will hold a clone of this repo.

```
cd ~/GitHub
```

Clone this repo.

```
git clone https://github.com/basham/swit-workshop-rxjs.git
```

Open the folder.

```
cd swit-workshop-rxjs/
```

Install dependencies.

```
npm install
```

## Start

Start the local development server. It should automatically open the browser to [`http://localhost:8000/`](http://localhost:8000/), which provides links to the app demo, slide examples, and exercises.

```
npm run start
```

If following along with the exercises, it is recommended you work on a branch different than `master` (such as `workshop`). This allows you to commit your progress and switch back to the original `master` version without hassle.

```
git checkout -b workshop
```

## Development environment

This repo uses a ["buildless" environment](https://dev.to/open-wc/on-the-bleeding-edge-3cb8). There is no Webpack or other bundling system. [`@pika/web`](https://github.com/pikapkg/web) prepares browser dependencies as JS modules and generates an import map. [`es-module-shims`](https://github.com/guybedford/es-module-shims) provides support for [import maps](https://github.com/WICG/import-maps), JS modules, and CSS modules (via [`construct-style-sheets-polyfill`](https://github.com/calebdwilliams/construct-style-sheets)).

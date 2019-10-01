# Common operators

| Area | Static Operator | Pipeable Operator |
| --- | --- | --- |
| Creation | [`from`], [`of`] | |
| Combination | [`combineLatest`], [`merge`] | [`startWith`], [`withLatestFrom`] |
| Filtering | | [`distinctUntilChanged`], [`filter`] |
| Transformation | | [`map`], [`mapTo`], [`mergeMap`], [`scan`], [`switchMap`] |
| Utility | | [`tap`] |
| Multicasting | | [`share`], [`shareReplay`] |

Source: [*Introduction to RxJS: Common operators*](https://github.com/indiana-university/conduit/blob/conduit-rxjs%400.5.0/examples/intro-to-rxjs.md#common-operators)

[`combineLatest`]: http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-combineLatest
[`distinctUntilChanged`]: http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-distinctUntilChanged
[`filter`]: http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-filter
[`from`]: http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-from
[`map`]: http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-map
[`mapTo`]: http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-mapTo
[`merge`]: http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-merge
[`mergeMap`]: http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-mergeMap
[`of`]: http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-of
[`scan`]: http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-scan
[`share`]: http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-share
[`shareReplay`]: http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-shareReplay
[`startWith`]: http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-startWith
[`switchMap`]: http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-switchMap
[`tap`]: http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-do
[`withLatestFrom`]: http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-withLatestFrom

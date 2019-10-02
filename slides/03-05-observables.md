# Observables

||Pull|Push|
|---|---|---|
|Single value|Function|Promise|
|Multiple values|Iterator (Array, Generator, Map, Set)|**Observable**|
|Produces data|Upon request|On its own|
|Consumer|Requests data|Reacts to data|

> An Observable is a lazily evaluated computation that can synchronously or asynchronously return zero to (potentially) infinite values from the time it's invoked onwards.

See: https://rxjs-dev.firebaseapp.com/guide/observable

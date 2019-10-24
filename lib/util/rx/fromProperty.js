import { PropertySubject } from './PropertySubject.js'

export function fromProperty (target, name, options) {
  return new PropertySubject(target, name, options)
}

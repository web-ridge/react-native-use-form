// The MIT License (MIT)
//
// Copyright (c) 2015 Mario Casciaro
// https://github.com/mariocasciaro/object-path-immutable/blob/master/LICENSE
// edited by Richard Lindhout

let _hasOwnProperty = Object.prototype.hasOwnProperty;

function hasShallowProperty(obj: any, prop: any) {
  return (
    (typeof prop === 'number' && Array.isArray(obj)) ||
    hasOwnProperty(obj, prop)
  );
}

function hasOwnProperty(obj: any, prop: any) {
  if (obj == null) {
    return false;
  }
  //to handle objects with null prototypes (too edge case?)
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function getShallowProperty(obj: any, prop: any) {
  if (hasShallowProperty(obj, prop)) {
    return obj[prop];
  }
}

function isEmpty(value: any) {
  if (isNumber(value)) {
    return false;
  }
  if (!value) {
    return true;
  }
  if (isArray(value) && value.length === 0) {
    return true;
  } else if (!isString(value)) {
    for (let i in value) {
      if (_hasOwnProperty.call(value, i)) {
        return false;
      }
    }
    return true;
  }
  return false;
}

function isNumber(value: any) {
  return typeof value === 'number';
}

function isString(obj: any) {
  return typeof obj === 'string';
}

function isArray(obj: any) {
  return Array.isArray(obj);
}

function assignToObj(target: any, source: any) {
  for (let key in source) {
    if (_hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }
  return target;
}

function getKey(key: any) {
  let intKey = parseInt(key);
  if (intKey.toString() === key) {
    return intKey;
  }
  return key;
}

function clone(obj: any, createIfEmpty: any, assumeArray: any) {
  if (obj == null) {
    if (createIfEmpty) {
      if (assumeArray) {
        return [];
      }

      return {};
    }

    return obj;
  } else if (isArray(obj)) {
    return obj.slice();
  }

  return assignToObj({}, obj);
}

function _changeImmutable(
  dest: any,
  src: any,
  path: any,
  changeCallback: any
): any {
  if (isNumber(path)) {
    path = [path];
  }
  if (isEmpty(path)) {
    return src;
  }
  if (isString(path)) {
    return _changeImmutable(
      dest,
      src,
      path.split('.').map(getKey),
      changeCallback
    );
  }
  let currentPath = path[0];

  if (!dest || dest === src) {
    dest = clone(src, true, isNumber(currentPath));
  }

  if (path.length === 1) {
    return changeCallback(dest, currentPath);
  }

  if (src != null) {
    src = src[currentPath];
  }

  dest[currentPath] = _changeImmutable(
    dest[currentPath],
    src,
    path.slice(1),
    changeCallback
  );

  return dest;
}

function set<T>(dest: any, src: any, path: string, value?: any): T {
  if (isEmpty(path)) {
    return value;
  }
  return _changeImmutable(dest, src, path, (clonedObj: any, finalPath: any) => {
    clonedObj[finalPath] = value;
    return clonedObj;
  });
}

export function deepGet<V>(obj: any, path: any): V {
  if (typeof path === 'number') {
    path = [path];
  }
  if (!path || path.length === 0) {
    return obj;
  }

  if (typeof path === 'string') {
    if (path.includes('.')) {
      return deepGet(obj, path.split('.')) as any;
    } else {
      return obj[path];
    }
  }

  let currentPath = getKey(path[0]);
  let nextObj = getShallowProperty(obj, currentPath);
  if (nextObj === void 0) {
    return undefined as any;
  }

  if (path.length === 1) {
    return nextObj;
  }

  return deepGet(obj[currentPath], path.slice(1));
}

export const deepSet = set.bind(null, null);

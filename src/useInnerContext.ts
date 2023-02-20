import useRefState from './useRefState';
import * as React from 'react';
import { useReferencedCallback } from './utils';
import type { TextInput } from 'react-native';

type RefKeyMap = Record<string, TextInput>;
export type FormRefKeyMap = Record<number, RefKeyMap>;
type IndexKeyMap = Record<string, number>;
type FormIndexKeyMap = Record<number, IndexKeyMap>;

// we need something to keep track of nested forms
export function indexer(): IndexerType {
  let i: number = 0;
  function add() {
    i++;
    return i;
  }
  return {
    add,
    i,
  };
}

export default function useInnerContext(skip?: boolean) {
  const [lastKey, setLastKey] = useRefState<string | undefined>(undefined);
  const refIndex = React.useRef<number>(0);

  const indexForKey = React.useRef<FormIndexKeyMap>({});
  const refForKey = React.useRef<FormRefKeyMap>({});
  const referencedCallback = useReferencedCallback();

  React.useEffect(() => {
    // we would rather not do this hook at all, but we need to keep amount of hooks the same :)
    if (skip) {
      return;
    }
    const elements = Object.keys(refForKey.current).filter(
      (key, _) => refForKey.current[key as any] !== null
    );
    const lKey = elements[elements.length - 1];
    setLastKey(lKey);
  }, [skip, lastKey, setLastKey, refForKey]);

  // we would rather not do this hook at all, but we need to keep amount of hooks the same :)
  if (skip) {
    return undefined;
  }

  const referencer: ReferencerType = (key, formIndex) => {
    return {
      ref: referencedCallback(`ref.${key}`, (e: TextInput) => {
        if (e === null) {
          return;
        }

        const rk = refForKey.current;
        const ik = indexForKey.current;
        // set default state if undefined
        rk[formIndex] = rk[formIndex] || {};
        ik[formIndex] = ik[formIndex] || {};

        const index = rk[formIndex]![key];
        if (index === undefined) {
          refIndex.current = refIndex.current + 1;
          (ik as any)[formIndex][key] = refIndex.current;
        }
        (rk as any)[formIndex][key] = e;
      }),
      onSubmitEditing:
        lastKey.current === key
          ? undefined
          : // TODO: handle submit on last onSubmitEditing
            // referencedCallback(`submitEditing.${key}`, () => {
            //   submit();
            // })
            // TODO: blurOrSubmit on last field?
            referencedCallback(`focusNext.${key}`, () => {
              const rk = refForKey.current[formIndex] || {};
              const ik = indexForKey.current[formIndex] || {};
              const currentField = rk[key];

              // combine fields of current and next form
              const fields = Object.keys(refForKey.current)
                .map((frmKey) => {
                  const fi = Number(frmKey);
                  const refs = refForKey.current[fi] || {};
                  const ixs = indexForKey.current[fi];
                  return Object.keys(refs)
                    .filter((e) => !!e)
                    .map((k) => ({
                      element: refs[k],
                      index: ixs?.[k],
                      fi,
                    }))
                    .sort(
                      (a, b) => a.fi - b.fi && (a.index || 0) - (b.index || 0)
                    );
                })
                .flat();

              const nextField = fields.find((f) => {
                const p = f?.element?.props;
                // TODO: fix this with function components
                // skip disabled fields in focus
                if ((p as any)?.disabled === true || p?.editable === false) {
                  return false;
                }
                // already sorted so the first one to hit above current index is the next field
                return (f.index || 0) > (ik?.[key] || 0);
              });

              nextField?.element?.focus?.();
              currentField?.blur?.();
            }),
      blurOnSubmit: lastKey.current === key,
      returnKeyType: lastKey.current === key ? undefined : 'next',
    };
  };

  return { referencer, indexer: indexer(), refForKey };
}

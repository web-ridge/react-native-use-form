interface FieldParams {
  fieldKey: string;
  label: string | undefined;
}
interface FieldLengthParams extends FieldParams {
  requiredLength: number;
}
interface RegexParams extends FieldParams {
  errorMessage: string | undefined;
}

export interface TranslationsType {
  required: (params: FieldParams) => string;
  lengtShouldBeLongerThan: (params: FieldLengthParams) => string;
  lengthShouldBeShorterThan: (params: FieldLengthParams) => string;
  shouldFollowRegex: (params: RegexParams) => string;
}

let translationsPerLocale: Record<string, TranslationsType> = {};
export let defaultLocale = 'en';
export function getTranslation<K extends keyof TranslationsType>(
  locale: string | undefined,
  key: K
): TranslationsType[K] {
  const l = locale || defaultLocale;
  const translationForLocale = translationsPerLocale[l];
  if (!translationForLocale) {
    console.warn(
      `[react-native-use-form] ${locale} is not registered, key: ${key}`
    );
  }
  const translation = translationsPerLocale[l][key];
  if (!translation) {
    console.warn(
      `[react-native-use-form] ${locale} is registered, but ${key} is missing`
    );
  }
  return translation || key;
}
export function registerDefaultLocale(locale: string) {
  defaultLocale = locale;
}
export function registerTranslation(
  locale: string,
  translations: TranslationsType
) {
  translationsPerLocale[locale] = translations;
}

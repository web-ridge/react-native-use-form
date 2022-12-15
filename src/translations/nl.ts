import type { TranslationsType } from './utils';

const nl: TranslationsType = {
  required: (params) => `${params.label || params.fieldKey} is verplicht`,
  lengtShouldBeLongerThan: (params) =>
    `${params.label || params.fieldKey} moet langer zijn dan ${
      params.requiredLength
    }`,
  lengthShouldBeShorterThan: (params) =>
    `${params.label || params.fieldKey} moet korter zijn dan ${
      params.requiredLength
    }`,
  shouldFollowRegex: (params) =>
    params.errorMessage ||
    `${params.label || params.fieldKey} is niet in het juiste formaat`,
};
export default nl;

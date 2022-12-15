import type { TranslationsType } from './utils';

const nl: TranslationsType = {
  required: (params) => `${params.fieldKey || params.fieldKey} is required`,
  lengtShouldBeLongerThan: (params) =>
    `${params.fieldKey || params.fieldKey} moet langer zijn dan ${
      params.requiredLength
    }`,
  lengthShouldBeShorterThan: (params) =>
    `${params.fieldKey || params.fieldKey} moet korter zijn dan ${
      params.requiredLength
    }`,
  shouldFollowRegex: (params) =>
    params.errorMessage ||
    `${params.fieldKey || params.fieldKey} is niet in het juiste formaat`,
};
export default nl;

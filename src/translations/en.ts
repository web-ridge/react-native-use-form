import type { TranslationsType } from './utils';

const en: TranslationsType = {
  required: (params) => `${params.fieldKey || params.fieldKey} is required`,
  lengtShouldBeLongerThan: (params) =>
    `${params.fieldKey || params.fieldKey} length should be longer than ${
      params.requiredLength
    }`,
  lengthShouldBeShorterThan: (params) =>
    `${params.fieldKey || params.fieldKey} length should be shorter than ${
      params.requiredLength
    }`,
  shouldFollowRegex: (params) =>
    params.errorMessage ||
    `${params.fieldKey || params.fieldKey} is not in the right format`,
};
export default en;

import createEnumUtils from '../utils/create-enum-utils';

enum Locale {
  Arabic = 'ar-EG',
  English = 'en-US',
  Spanish = 'es-ES',
  Filipino = 'fil-PH',
  Japanese = 'ja-JP',
}

export default Locale;

const { isType, validateType } = createEnumUtils('Locale', Locale);
export const isLocale = isType;
export const validateLocale = validateType;

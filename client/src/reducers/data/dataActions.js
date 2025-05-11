export const LOAD_PHONE_DATA = 'LOAD_PHONE_DATA';

export const loadPhoneData = (brand, page, data) => ({
  type: LOAD_PHONE_DATA,
  payload: { brand, page, data }
});

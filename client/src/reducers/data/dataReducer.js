import { LOAD_PHONE_DATA } from './dataActions';

const initialState = {
  phoneData: {}  // Structure: { vivo: { 1: {...}, 2: {...} }, oppo: {...} }
};

export const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_PHONE_DATA: {
      const { brand, page, data } = action.payload;
      return {
        ...state,
        phoneData: {
          ...state.phoneData,
          [brand]: {
            ...(state.phoneData[brand] || {}),
            [page]: data
          }
        }
      };
    }
    default:
      return state;
  }
};

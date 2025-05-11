// redux/reducers/modelsReducer.js
import { LOAD_MODELS_SUCCESS } from './loadStaticModels';

const initialState = {
  vivo: [],
  oppo: [],
  motorola: [],
  samsung: [],
};

export default function modelsReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_MODELS_SUCCESS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

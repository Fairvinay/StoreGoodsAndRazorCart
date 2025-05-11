// App.js or a top-level component
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadStaticModels } from './reducers/data/loadStaticModels';

const InitLoader = ({ store }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    //dispatch(loadStaticModels());
    const fetchData = async () => {
        const action = await loadStaticModels();
        store.dispatch(action);
      };
      fetchData();



  }, [store]);

  return null; // or spinner
};

export default InitLoader;

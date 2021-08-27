import React, { useReducer, createContext, useCallback } from 'react';
import initialState from './initialState';
import id from 'uuid/v4';

export const GrudgeContext = createContext();

const GRUDGE_ADD = 'GRUDGE_ADD';
const GRUDGE_FORGIVE = 'GRUDGE_FORGIVE';

const defaultState = {
  past: [],
  present: initialState,
  future: []
};
const reducer = (state = defaultState, action) => {
  if (action.type === GRUDGE_ADD) {
    return {
      past: [state.present, ...state.past],
      present: [
        {
          id: id(),
          ...action.payload
        },
        ...state.present
      ],
      future: []
    };
  }

  if (action.type === GRUDGE_FORGIVE) {
    return {
      past: [state.present, ...state.past],
      present: state.present.map((grudge) => {
        if (grudge.id === action.payload.id) {
          return { ...grudge, forgiven: !grudge.forgiven };
        }
        return grudge;
      }),
      future: []
    };
  }
  if (action.type === 'UNDO') {
    const [newPresent, ...newPast] = state.past;
    return {
      past: newPast,
      present: newPresent,
      future: [state.present, ...state.present]
    };
  }
  if (action.type === 'REDO') {
    const [newPresent, ...newFuture] = state.future;
    return {
      past: [state.present, ...state.present],
      present: newPresent,
      future: newFuture
    };
  }
  return state;
};

export const GrudgeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const grudges = state.present;
  const isPast = !state.past.length;
  const isFuture = !state.future.length;
  const addGrudge = useCallback(
    ({ person, reason }) => {
      dispatch({
        type: GRUDGE_ADD,
        payload: {
          person,
          reason
        }
      });
    },
    [dispatch]
  );

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, [dispatch]);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, [dispatch]);

  const toggleForgiveness = useCallback(
    (id) => {
      dispatch({
        type: GRUDGE_FORGIVE,
        payload: {
          id
        }
      });
    },
    [dispatch]
  );

  return (
    <GrudgeContext.Provider
      value={{
        grudges,
        addGrudge,
        undo,
        redo,
        isPast,
        isFuture,
        toggleForgiveness
      }}
    >
      {children}
    </GrudgeContext.Provider>
  );
};

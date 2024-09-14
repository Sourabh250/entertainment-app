import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import bookmarksReducer from "./features/bookmarksSlice";
import authReducer from "./features/authSlice";

// Configuration object for redux-persist
const persistConfig = {
    key: 'root', // Key to store the persisted state in storage
    storage, // Storage engine to use (localStorage by default)
    whitelist: ['auth', 'bookmarks'], // Reducers to be persisted
};

const rootReducer = combineReducers({
    auth: authReducer,
    bookmarks: bookmarksReducer,
});

// Creating a persisted reducer with the configuration
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Disabling serializable check to avoid issues with redux-persist
      }),
  });

// Creating a persistor object to manage the persistence
const persistor = persistStore(store);

export { store, persistor };
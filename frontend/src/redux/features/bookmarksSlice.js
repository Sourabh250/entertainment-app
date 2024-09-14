import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getBookmarks, addBookmark, removeBookmark } from "../../utility/bookmarkApi";
import { fetchDetail } from '../../utility/fetchApi';

// Async thunk to fetch bookmarks
export const fetchBookmarks = createAsyncThunk(
    'bookmarks/fetchBookmarks',
    async(token) => {
        const data = await getBookmarks(token);
        return data;
    }
);

// Async thunk to add a bookmark
export const addBookmarkThunk= createAsyncThunk(
    'bookmarks/addBookmark',
    async({itemId, token, mediaType }) => {
        await addBookmark(itemId, token, mediaType);
        const data = await fetchDetail(mediaType, itemId); // Fetching detailed info for the added bookmark
        return { data, itemId, mediaType };
    }
);

// Async thunk to remove a bookmark
export const removeBookmarkThunk = createAsyncThunk(
    'bookmarks/removeBookmark',
    async({itemId, token, mediaType }) => {
        await removeBookmark(itemId, token, mediaType);
        return { itemId, mediaType };
    }
);

const bookmarksSlice = createSlice({
    name: 'bookmarks',
    initialState: {
        movieBookmarks: [],
        tvSeriesBookmarks: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        clearBookmarks(state) {
            state.movieBookmarks = [];
            state.tvSeriesBookmarks = [];
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchBookmarks.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(fetchBookmarks.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.movieBookmarks = action.payload.movieBookmarks;
            state.tvSeriesBookmarks = action.payload.tvSeriesBookmarks;
          })
          .addCase(fetchBookmarks.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
          })
          .addCase(addBookmarkThunk.fulfilled, (state, action) => {
            if (action.payload.mediaType === 'movies') {
                state.movieBookmarks.push( action.payload.data );
              } else if (action.payload.mediaType === 'tv-series') {
                state.tvSeriesBookmarks.push( action.payload.data );
              }
          })
          .addCase(removeBookmarkThunk.fulfilled, (state, action) => {
            if (action.payload.mediaType === 'movies') {
                state.movieBookmarks = state.movieBookmarks.filter(
                  (bookmark) => bookmark.id !== action.payload.itemId
                );
              } else if (action.payload.mediaType === 'tv-series') {
                state.tvSeriesBookmarks = state.tvSeriesBookmarks.filter(
                  (bookmark) => bookmark.id !== action.payload.itemId
                );
              }
          });
      },
});

export const { clearBookmarks } = bookmarksSlice.actions;
export default bookmarksSlice.reducer;
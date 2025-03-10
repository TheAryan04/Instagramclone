import { createSlice } from "@reduxjs/toolkit";

const storySlice = createSlice({
    name: "story",
    initialState: {
        stories: [],
        loading: false,
        error: null,
    },
    reducers: {
        setStories: (state, action) => {
            state.stories = action.payload;
        },
        addStory: (state, action) => {
            state.stories.unshift(action.payload);
        },
        deleteStory: (state, action) => {
            state.stories = state.stories.filter(story => story._id !== action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const { setStories, addStory, deleteStory, setLoading, setError } = storySlice.actions;
export default storySlice.reducer;

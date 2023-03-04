import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "./Post";
import { sub } from "date-fns";
import { RootState } from "../../app/store";

const initialState: Post[] = [
    {
        id: "1",
        title: "First Post!",
        content: "Hello!",
        user: "0",
        date: sub(new Date(), { minutes: 10 }).toISOString(),
        reactions: { thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0 },
    },
    {
        id: "2",
        title: "Second Post",
        content: "More text",
        user: "1",
        date: sub(new Date(), { minutes: 10 }).toISOString(),
        reactions: { thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0 },
    },
];

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.find(post => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
    postAdded: {
      reducer(
        state,
        action: PayloadAction<Post>
      ) {
        state.push(action.payload);
      },
      prepare(title, content, userId) {
        return {
            payload: {
                id: nanoid(),
                date: new Date().toISOString(),
                title,
                content,
                user: userId,
                reactions: {
                    thumbsUp: 0,
                    hooray: 0,
                    heart: 0,
                    rocket: 0,
                    eyes: 0,
                },
            },
        };
      },
    },
    postUpdated(state, action) {
      const { id, title, content } = action.payload;
      const existingPost = state.find((post) => post.id === id);
      if (existingPost) {
        existingPost.title = title;
        existingPost.content = content;
      }
    },
  },
});

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions;
export default postsSlice.reducer;

export const selectAllPosts = (state: RootState) => state.posts;

export const selectPostById = (state: RootState, postId: string) =>
    state.posts.find((post) => post.id === postId);

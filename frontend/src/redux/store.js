import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user.slice'
import conversationReducer from './conversation.slice'
import messageReducer from './message.slice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    conversation: conversationReducer,
    message: messageReducer,
  },
})

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  conversations: [],
  selectedConversation: null,
}

export const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload
    },
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload
    },
    addConversation: (state, action) => {
      state.conversations.unshift(action.payload)
    },
    setConvTitle: (state, action) => {
      const { conversationId, title } = action.payload
      const conv = state.conversations.find(c => c._id === conversationId)
      if (conv) {
        conv.title = title
      }
      if (state.selectedConversation && state.selectedConversation._id === conversationId) {
        state.selectedConversation.title = title
      }
    }
  },
})

export const { setConversations, setSelectedConversation, addConversation, setConvTitle } = conversationSlice.actions
export default conversationSlice.reducer

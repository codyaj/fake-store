import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [], // item objects
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            state.items.push(action.payload);
        },
        removeFromCart: (state, action) => {
            const productToRemove = action.payload;

            const index = state.items.findIndex(item => item.id === productToRemove.id);

            if (index !== -1) {
                state.items.splice(index, 1);
            }
        }
    },
});

export const { addToCart, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;
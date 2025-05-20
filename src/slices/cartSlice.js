import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [], // { id, price, count }
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { id, price } = action.payload;
            const existingItem = state.items.find(item => item.id === id);

            if (existingItem) {
                existingItem.count += 1;
            } else {
                state.items.push({ id, price, count: 1 });
            }
        },
        removeFromCart: (state, action) => {
            const { id } = action.payload;

            const existingItem = state.items.find(item => item.id === id);
            if (existingItem) {
                if (existingItem.count > 1) {
                    existingItem.count -= 1;
                } else {
                    state.items = state.items.filter(item => item.id !== id);
                }
            }
        },
        clearCart: (state) => {
            state.items = [];
        },
        updateCart: (state, action) => {
            state.items = action.payload;
        }
    },
});

export const { addToCart, removeFromCart, updateCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

export const syncCart = (token) => async (dispatch, getState) => {
    try {
        const response = await fetch('http://192.168.20.7:3000/cart', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        });

        const data = await response.json();

        if (data.status === "OK") {
            const items = data.items;
            dispatch(updateCart(items));
            console.log('Cart synced successfully:', items);
        } else {
            console.error('Server responded with:', data);
        }
    } catch (err) {
        console.error('Failed to sync cart:', err);
    }
};

export const addToCartAndSync = (product, token) => async (dispatch, getState) => {
    dispatch(addToCart(product));

    try {
        const updatedCart = getState().cart.items;
        
        const response = await fetch('http://192.168.20.7:3000/cart', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ items: updatedCart }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Server responded with:', errorData);
        } else {
            console.log('Cart synced successfully');
        }
    } catch (err) {
        console.error('Failed to sync cart:', err);
    }
};

export const removeFromCartAndSync = (product, token) => async (dispatch, getState) => {
    dispatch(removeFromCart(product));

    try {
        const updatedCart = getState().cart.items;

        const response = await fetch('http://192.168.20.7:3000/cart', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ items: updatedCart }),
        });

        console.log('Cart synced successfully');
    } catch (err) {
        console.error('Failed to sync cart:', err);
    }
};
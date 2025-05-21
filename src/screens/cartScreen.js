import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, TouchableOpacity, StatusBar, Image, Alert } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCartAndSync, addToCartAndSync, clearCartAndSync } from '../slices/cartSlice';
import NavFooter from '../components/navFooter';

export default function CartScreen({ route, navigation }) {
    const cartItems = useSelector((state) => state.cart.items);
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();

    const [detailedProducts, setDetailedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const uniqueIds = [...new Set(cartItems.map(item => item.id))];

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const responses = await Promise.all(
                    uniqueIds.map(id => fetch(`https://fakestoreapi.com/products/${id}`))
                );

                const products = await Promise.all(responses.map(res => res.json()));

                const merged = products.map(product => {
                    const cartItem = cartItems.find(item => item.id === product.id);
                    return {
                        ...product,
                        count: cartItem?.count || 1
                    };
                });

                setDetailedProducts(merged);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch product details:', error);
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [cartItems]);

    const handleAddToCart = (product) => {
        dispatch(addToCartAndSync({ id: product.id, price: product.price }, token));
    };

    const handleRemoveFromCart = (product) => {
        dispatch(removeFromCartAndSync({ id: product.id }, token));
    };

    const handleOrder = async () => {
        const formattedItems = cartItems.map(item => ({
            prodID: item.id,
            price: item.price,
            quantity: item.count,
        }));

        console.log('Formatted Items:', formattedItems);

        try {
            const response = await fetch('http://192.168.20.7:3000/orders/neworder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ items: formattedItems }),
            });

            const data = await response.json();

            if (response.ok && data.status === "OK") {
                console.log('Order successful:', data);

                Alert.alert('Success', 'Order has been processed');

                dispatch(clearCartAndSync(token));
            } else {
                console.error('Order failed:', data.message || data);
                Alert.alert('Failed', data.message || data);
            }
        } catch (error) {
            console.log('Network error:', error);
        }
    };

    const totalItemCount = detailedProducts.reduce((sum, item) => sum + item.count, 0);
    const totalCost = detailedProducts.reduce((sum, item) => sum + item.price * item.count, 0);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#242424" />

            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Shopping Cart</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#fff" style={styles.loadingScreen} />
            ) : (
                <>
                    {detailedProducts.length > 0 && (
                        <View>
                            <View style={styles.totalContainer}>
                                <Text style={styles.totalText}>Items: {totalItemCount}</Text>
                                <Text style={styles.totalText}>Price: ${totalCost.toFixed(2)}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.btn}
                                onPress={() => handleOrder()}
                            >
                                <Text style={styles.btnText}>Complete order</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <ScrollView contentContainerStyle={detailedProducts.length === 0 ? styles.emptyCartContainer : null}>
                        {detailedProducts.length === 0 ? (
                            <Text style={styles.emptyCartText}>Cart is Empty!</Text>
                        ) : (
                            detailedProducts.map((item) => (
                                <View key={item.id} style={styles.itemContainer}>
                                    <Image
                                        source={{ uri: item.image }}
                                        style={styles.itemImage}
                                    />
                                    <View style={styles.itemContentContainer}>
                                        <Text style={styles.itemText}>{item.title}</Text>
                                        <Text style={styles.itemText}>Price: ${item.price}</Text>
                                        <View style={styles.itemContentBottomContainer}>
                                            <TouchableOpacity onPress={() => handleRemoveFromCart(item)}>
                                                <Ionicons name="remove-circle" size={24} color="white" />
                                            </TouchableOpacity>
                                            <Text style={styles.quanText}>Quantity: {item.count}</Text>
                                            <TouchableOpacity onPress={() => handleAddToCart(item)}>
                                                <Ionicons name="add-circle" size={24} color="white" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            ))
                        )}
                    </ScrollView>
                </>
            )}

            <NavFooter navigation={navigation} route={route} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#242424'
    },
    headerContainer: {
        backgroundColor: '#242424',
        alignItems: "center",
        marginBottom: 15,
        // Shadow IOS
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.25,
        shadowRadius: 7,
        // Android shadow
        elevation: 5,
    },
    headerText: {
        color: '#fff',
        fontSize: 40,
        paddingTop: 50,
        padding: 20,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        borderWidth: 1,
        borderColor: '#fff',
        padding: 20,
        marginBottom: 10,
        marginRight: 30,
        marginLeft: 30,
        marginTop: 0,
        borderRadius: 5,
    },
    totalText: {
        color: '#fff',
        fontSize: 18,
    },
    emptyCartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyCartText: {
        color: '#fff',
        fontSize: 30,
        fontWeight: '500',
    },
    itemContainer: {
        flexDirection: 'row',
        paddingRight: 20,
        paddingLeft: 20,
        paddingBottom: 20,
        borderColor: '#fff',
        borderBottomWidth: 1,
        marginBottom: 20,
        flex: 1,
    },
    itemImage: {
        width: '25%',
        aspectRatio: 1,
        marginRight: 10,
        borderRadius: 5,
    },
    itemContentContainer: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',
    },
    itemText: {
        color: '#fff',
        fontSize: 16,
    },
    itemContentBottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 'auto',
    },
    quanText: {
        color: '#fff',
    },
    loadingScreen: {
        marginTop: 50,
        flex: 1,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 40,
        backgroundColor: '#363636',
        justifyContent: 'center',
        borderRadius: 8,
        paddingHorizontal: 26,
        paddingVertical: 10,
        marginBottom: 20,
    },
    btnText: {
        marginLeft: 5,
        color: '#fff',
    },
});
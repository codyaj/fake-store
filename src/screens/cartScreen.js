import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, TouchableOpacity, StatusBar, Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, addToCart } from '../slices/cartSlice';

export default function CartScreen({ navigation }) {
    const cartItems = useSelector((state) => state.cart.items);
    const dispatch = useDispatch();

    const groupedItems = cartItems.reduce((acc, item) => {
        if (acc.has(item.id)) {
            acc.get(item.id).count += 1;
        } else {
            acc.set(item.id, { ...item, count: 1 });
        }
        return acc;
    }, new Map());

    const itemsArray = Array.from(groupedItems.values());

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };

    const handleRemoveFromCart = (product) => {
        dispatch(removeFromCart(product));
    };

    const totalItemCount = itemsArray.reduce((sum, item) => sum + item.count, 0);
    const totalCost = itemsArray.reduce((sum, item) => sum + item.price * item.count, 0);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#242424" />

            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Shopping Cart</Text>
            </View>

            {itemsArray.length > 0 && (
                <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>Items: {totalItemCount}</Text>
                    <Text style={styles.totalText}>Price: ${totalCost.toFixed(2)}</Text>
                </View>
            )}

            <ScrollView contentContainerStyle={itemsArray.length === 0 ? styles.emptyCartContainer : null}>
                {itemsArray.length === 0 ? (
                    <Text style={styles.emptyCartText}>Cart is Empty!</Text>
                ) : (
                    itemsArray.map((item) => (
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

            <View style={styles.navFooterContainer}>
                <TouchableOpacity 
                    style={styles.navFooterBtn}
                    onPress={() => navigation.replace('category')}
                    activeOpacity={0.7}
                >
                    <Ionicons name="home" size={24} color="white" />
                    <Text style={styles.navFooterText}>Products</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.navFooterBtn}
                    onPress={() => navigation.replace('shopCart')}
                    activeOpacity={0.7}
                >
                    <Ionicons name="cart" size={24} color="#007AFF" />
                    <Text style={styles.navFooterTextSelected}>My Cart</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.navFooterBtn}
                    onPress={() => alert('changeme')}
                    activeOpacity={0.7}
                >
                    <Ionicons name="gift" size={24} color="white" />
                    <Text style={styles.navFooterText}>My Orders</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.navFooterBtn}
                    onPress={() => alert('changeme')}
                    activeOpacity={0.7}
                >
                    <Ionicons name="person" size={24} color="white" />
                    <Text style={styles.navFooterText}>User Profile</Text>
                </TouchableOpacity>
            </View>
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
        marginBottom: 30,
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
    navFooterContainer: {
        backgroundColor: '#242424',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 15,
        paddingBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 10,
    },
    navFooterBtn: {
        alignItems: 'center',
    },
    navFooterText: {
        color: '#fff',
    }, 
    navFooterTextSelected: {
        color: '#007AFF',
    },
});
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, TouchableOpacity, StatusBar, Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from 'react-redux';
import { addToCartAndSync } from '../slices/cartSlice';
import NavFooter from '../components/navFooter';

export default function ProductDetailsScreen({ route, navigation }) {
    const { product } = route.params;
    const token = useSelector((state) => state.auth.token);

    function StarRating({ rating }) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating - fullStars >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
      
        const stars = [];
      
        for (let i = 0; i < fullStars; i++) {
          stars.push(<Ionicons key={`full-${i}`} name="star" size={24} color="gold" />);
        }
        if (hasHalfStar) {
          stars.push(<Ionicons key="half" name="star-half-outline" size={24} color="gold" />);
        }
        for (let i = 0; i < emptyStars; i++) {
          stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={24} color="gold" />);
        }
      
        return <>{stars}</>;
    }

    const dispatch = useDispatch();

    const handleAddToCart = (product) => {
        dispatch(addToCartAndSync({ id: product.id, price: product.price }, token));
        alert('Success, Item added to cart!');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#242424" />

            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Product Details</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Image
                    source={{ uri: product.image }}
                    style={styles.productImage}
                />

                <Text style={styles.productName}>
                    {product.title}
                </Text>

                <View style={styles.ratingPriceContainer}>
                    <View style={styles.ratingExternalContainer}>
                        <View style={styles.ratingInternalContainer}>
                            <StarRating rating={product.rating.rate} />
                            <Text style={styles.ratingValText}> {product.rating.rate}</Text>
                        </View>
                        <Text style={styles.ratingCountText}> ({product.rating.count} reviews)</Text>
                    </View>
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceText}>${product.price}</Text>
                    </View>
                </View>

                <View style={styles.btnContainer}>
                    <TouchableOpacity
                        onPress={() => navigation.replace('prodList', { category: product.category })}
                        style={styles.btn}
                    >
                        <Ionicons name="close-circle-outline" size={24} color="white" />
                        <Text style={styles.btnText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleAddToCart(product)}
                        style={styles.btn}
                    >
                        <Ionicons name="cart-outline" size={24} color="white" />
                        <Text style={styles.btnText}>Add to Cart</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionTitle}>Desciption: </Text>
                    <Text style={styles.descriptionText}>{product.description}</Text>
                </View>
            </ScrollView>

            <NavFooter navigation={navigation} route={route} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#242424'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    content: {
        marginHorizontal: '10%',
    },
    productImage: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 8,
        marginRight: 15,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        paddingTop: 10,
        fontSize: 26,
        fontWeight: 500,
        color: '#fff',
    },
    ratingPriceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    priceContainer: {
        width: '50%',
        alignItems: 'center',
    },
    ratingExternalContainer: {
        paddingTop: 15,
        paddingBottom: 10,
        alignItems: 'center',
        width: '50%',
    },
    ratingInternalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingValText: {
        fontSize: 20,
        color: '#fff',
    },
    ratingCountText: {
        fontSize: 14,
        color: '#e8e8e8',
    },
    priceText: {
        fontSize: 26,
        color: '#fff',
    },
    btnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        backgroundColor: '#363636',
        justifyContent: 'center',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    btnText: {
        marginLeft: 10,
        fontSize: 20,
        color: '#fff',
    },
    descriptionTitle: {
        color: '#fff',
        fontWeight: 500,
        fontSize: 22,
    },
    descriptionContainer: {
        marginTop: 8,
        backgroundColor: '#363636',
        borderRadius: 14,
        padding: 10,
    },
    descriptionText: {
        marginTop: 8,
        color: '#fff',
        fontSize: 16,
    },
});
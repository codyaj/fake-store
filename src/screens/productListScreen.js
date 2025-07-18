import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, TouchableOpacity, StatusBar, Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import NavFooter from '../components/navFooter';

export default function ProductListScreen({ route, navigation }) {
    const { category } = route.params;

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://fakestoreapi.com/products')
            .then((res) => res.json())
            .then((data) => {
                const filteredProducts = data.filter(item => item.category === category);
                setProducts(filteredProducts);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
                setLoading(false);
            });
    }, [category]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#242424" />

            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{category}</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {products.map((product, index) => (
                    <TouchableOpacity 
                        key={index}
                        style={styles.productBtn}
                        onPress={() => navigation.replace('prodDetails', { product })}
                        activeOpacity={0.7}
                    >
                        <View style={styles.productContent}>
                            <Image 
                                source={{ uri: product.image }}
                                style={styles.productImage}
                            />
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{product.title}</Text>
                                <Text style={styles.productPrice}>Price: ${product.price}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
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
    productBtn: {
        backgroundColor: '#242424',
        alignItems: 'center',
        marginBottom: 20,
        padding: 20,
        borderRadius: 5,
        borderColor: '#363636',
        borderWidth: 2,
    },
    productContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 15,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 5,
    },
    productPrice: {
        fontSize: 16,
        color: '#fff',
    },
});
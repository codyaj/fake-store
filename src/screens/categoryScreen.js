import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

export default function CategoryScreen({ navigation }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://fakestoreapi.com/products')
            .then((res) => res.json())
            .then((data) => {
                const uniqueCategories = [...new Set(data.map(item => item.category))];
                setCategories(uniqueCategories);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
                setLoading(false);
            });
    }, []);

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
                <Text style={styles.headerText}>Categories</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {categories.map((category, index) => (
                    <TouchableOpacity 
                        key={index}
                        style={styles.categoryBtn}
                        onPress={() => navigation.navigate('prodList', { category })}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.categoryBtnText}>{category}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.navFooterContainer}>
                <TouchableOpacity 
                    style={styles.navFooterBtn}
                    onPress={() => navigation.navigate('category')}
                    activeOpacity={0.7}
                >
                    <Ionicons name="home" size={24} color="#007AFF" />
                    <Text style={styles.navFooterTextSelected}>Products</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.navFooterBtn}
                    onPress={() => navigation.navigate('shopCart')}
                    activeOpacity={0.7}
                >
                    <Ionicons name="cart" size={24} color="white" />
                    <Text style={styles.navFooterText}>My Cart</Text>
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
    categoryBtn: {
        backgroundColor: '#242424',
        alignItems: 'center',
        marginBottom: 20,
        padding: 20,
        borderRadius: 5,
        borderColor: '#363636',
        borderWidth: 2,
    },
    categoryBtnText: {
        fontSize: 20,
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
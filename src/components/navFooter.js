import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const NavFooter = ({ navigation, route }) => {
    const cartItems = useSelector(state => state.cart.items);

    const groupedItems = cartItems.reduce((acc, item) => {
        if (acc.has(item.id)) {
          acc.get(item.id).count += 1;
        } else {
          acc.set(item.id, { ...item, count: 1 });
        }
        return acc;
    }, new Map());

    const itemsArray = Array.from(groupedItems.values());
    const totalItemCount = itemsArray.reduce((sum, item) => sum + item.count, 0);

    const currentRoute = route?.name || '';

    return (
        <View style={styles.navFooterContainer}>
            <TouchableOpacity 
                style={styles.navFooterBtn}
                onPress={() => navigation.replace('category')}
                activeOpacity={0.7}
            >
                <Ionicons 
                    name="home" 
                    size={24} 
                    color={currentRoute === 'category' || currentRoute === 'prodDetails' || currentRoute === 'prodList' ? '#007AFF' : 'white'}
                />
                <Text style={currentRoute === 'category' || currentRoute === 'prodDetails' || currentRoute === 'prodList' ? styles.navFooterTextSelected : styles.navFooterText}>
                    Products
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.navFooterBtn}
                onPress={() => navigation.replace('shopCart')}
                activeOpacity={0.7}
            >
                <View style={{ position: 'relative' }}>
                    <Ionicons 
                        name="cart" 
                        size={24} 
                        color={currentRoute === 'shopCart' ? '#007AFF' : 'white'}
                    />
                    {totalItemCount >= 1 && (
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{totalItemCount}</Text>
                        </View>
                    )}
                </View>
                <Text style={currentRoute === 'shopCart' ? styles.navFooterTextSelected : styles.navFooterText}>
                    My Cart
                </Text>
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
    );
}

const styles = StyleSheet.create({
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
    cartBadge: {
        position: 'absolute',
        right: -6,
        top: -4,
        backgroundColor: 'red',
        borderRadius: 8,
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    cartBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default NavFooter;
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useNavigationState } from '@react-navigation/native';

const NavFooter = ({ navigation, route }) => {
    const cartItems = useSelector(state => state.cart.items);
    const totalItemCount = cartItems.reduce((sum, item) => sum + item.count, 0);

    const currentRoute = route?.name || '';

    const user = useSelector(state => state.auth.user);

    const navigateIfLoggedIn = (destination) => {
        if (user) {
            navigation.replace(destination);
        } else {
            alert('Not logged in!');
            if (currentRoute !== 'login'){
                navigation.replace('login');
            }
        }
    }

    return (
        <View style={styles.navFooterContainer}>
            <TouchableOpacity 
                style={styles.navFooterBtn}
                onPress={() => navigateIfLoggedIn('category')}
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
                onPress={() => navigateIfLoggedIn('shopCart')}
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
                onPress={() => navigateIfLoggedIn('order')}
                activeOpacity={0.7}
            >
                <Ionicons 
                    name="gift" 
                    size={24} 
                    color={currentRoute === 'order' ? '#007AFF' : 'white'}
                />
                <Text style={currentRoute === 'order' ? styles.navFooterTextSelected : styles.navFooterText}>My Orders</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.navFooterBtn}
                onPress={() => navigateIfLoggedIn('profile')}
                activeOpacity={0.7}
            >
                <Ionicons 
                    name="person" 
                    size={24} 
                    color={currentRoute === 'profile' ? '#007AFF' : 'white'}
                />
                <Text style={currentRoute === 'profile' ? styles.navFooterTextSelected : styles.navFooterText}>User Profile</Text>
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
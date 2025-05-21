import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const NavFooter = ({ navigation, route }) => {
    const cartItems = useSelector(state => state.cart.items);
    const token = useSelector((state) => state.auth.token);
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

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

    const [unpaidUndelivered, setUnpaidUndelivered] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://192.168.20.7:3000/orders/all', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                const data = await response.json();
    
                if (response.ok) {
                    const allOrders = data.orders;
                    
                    const unpaid = allOrders.filter(order => order.is_paid === 0 && order.is_delivered === 0);
                    
                    setUnpaidUndelivered(unpaid);
                } else {
                    console.error('Order failed:', data.message || data);
                    Alert.alert('Failed', data.message || data);
                }
            } catch (err) {
                console.error('Order failed:', data.message || data);
                Alert.alert('Failed', data.message || data);
            } finally {
                setLoading(false);
            }
        };

        if (isLoggedIn) {
            fetchOrders();
        }
    }, []);

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
                <View style={{ position: 'relative' }}>
                    <Ionicons 
                        name="gift" 
                        size={24} 
                        color={currentRoute === 'order' ? '#007AFF' : 'white'}
                    />
                    {unpaidUndelivered.length > 0 && (
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{unpaidUndelivered.length}</Text>
                        </View>
                    )}
                </View>
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
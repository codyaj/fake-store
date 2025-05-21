import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, TouchableOpacity, StatusBar, Image, Alert } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from 'react-redux';
import NavFooter from '../components/navFooter';

export default function OrderScreen({ route, navigation }) {
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();

    const [unpaidUndelivered, setUnpaidUndelivered] = useState([]);
    const [paidOrders, setPaidOrders] = useState([]);
    const [deliveredOrders, setDeliveredOrders] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrders, setExpandedOrders] = useState([]);
    const [orderDetails, setOrderDetails] = useState({});

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
                const paid = allOrders.filter(order => order.is_paid === 1 && order.is_delivered === 0);
                const delivered = allOrders.filter(order => order.is_delivered === 1);
                
                setOrders(allOrders);
                setUnpaidUndelivered(unpaid);
                setPaidOrders(paid);
                setDeliveredOrders(delivered);
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

    useEffect(() => {
        fetchOrders();
    }, [])

    const toggleExpand = async (orderId, orderItems) => {
        const isAlreadyExpanded = expandedOrders.includes(orderId);
    
        if (isAlreadyExpanded) {
            setExpandedOrders(prev => prev.filter(id => id !== orderId));
            return;
        }
    
        try {
            if (!orderDetails[orderId]) {
                const prodIDs = [...new Set(orderItems.map(item => item.prodID))];
    
                const responses = await Promise.all(
                    prodIDs.map(id =>
                        fetch(`https://fakestoreapi.com/products/${id}`).then(res => res.json())
                    )
                );
    
                const productMap = {};
                responses.forEach(product => {
                    productMap[product.id] = product;
                });
    
                const detailedItems = orderItems.map(orderItem => {
                    const product = productMap[orderItem.prodID];
                    return {
                        ...product,
                        quantity: orderItem.quantity,
                        price: orderItem.price,
                    };
                });
    
                setOrderDetails(prev => ({ ...prev, [orderId]: detailedItems }));
            }
    
            setExpandedOrders(prev => [...prev, orderId]);
        } catch (error) {
            console.error('Failed to fetch order item details:', error);
        }
    };    
      
    const payForOrder = async (orderID) => {
        try {
            const response = await fetch('http://192.168.20.7:3000/orders/updateorder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    orderID: orderID,
                    isPaid: 1,
                    isDelivered: 0
                })
            });
    
            const data = await response.json();
    
            if (response.ok) {
                Alert.alert('Success', 'Order has been paid');
    
                fetchOrders();
            } else {
                console.error('Order failed:', data.message || data);
                Alert.alert('Failed', data.message || data);
            }
        } catch (err) {
            console.error('Order failed:', err);
            Alert.alert('Failed', 'An error occurred');
        }
    }    

    const receiveOrder = async (orderID) => {
        try {
            const response = await fetch('http://192.168.20.7:3000/orders/updateorder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    orderID: orderID,
                    isPaid: 1,
                    isDelivered: 1
                })
            });
    
            const data = await response.json();
    
            if (response.ok) {
                Alert.alert('Success', 'Order has been received');
    
                fetchOrders();
            } else {
                console.error('Order failed:', data.message || data);
                Alert.alert('Failed', data.message || data);
            }
        } catch (err) {
            console.error('Order failed:', err);
            Alert.alert('Failed', 'An error occurred');
        }
    }
    

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#242424" />

            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Orders</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#fff" style={styles.loadingScreen} />
            ) : (
                <>
                    <ScrollView contentContainerStyle={orders.length === 0 ? styles.emptyOrderContainer : null}>
                        <View style={styles.divider}>
                            <Text style={styles.dividerText}>New Orders</Text>
                        </View>
                        {unpaidUndelivered.length === 0 ? (
                            <Text style={styles.emptyOrderText}>No Orders Here!</Text>
                        ) : (
                            unpaidUndelivered.map((item) => {
                                const isExpanded = expandedOrders.includes(item.id);
                                const orderItems = JSON.parse(item.order_items);
                            
                                return (
                                    <View key={item.id}>
                                        <View style={styles.listContainer}>
                                            <Text style={styles.listText}>Order ID: {item.id}</Text>
                                            <Text style={styles.listText}>Items: {item.item_numbers}</Text>
                                            <Text style={styles.listText}>${item.total_price / 100}</Text>
                                            <Text style={styles.itemText}>{item.is_paid}</Text>
                                    
                                            <TouchableOpacity onPress={() => toggleExpand(item.id, orderItems)}>
                                                <Ionicons
                                                    name={isExpanded ? "caret-up-outline" : "caret-down-outline"}
                                                    size={24}
                                                    color="white"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <View>
                                            {isExpanded && (
                                                <View style={styles.dropdownContainer}>
                                                    {orderDetails[item.id]?.map((product, index) => (
                                                        <View key={index} style={styles.itemContentContainer}>
                                                            <Image
                                                                source={{ uri: product.image }}
                                                                style={styles.itemImage}
                                                            />
                                                            <View style={styles.itemContainer}>
                                                                <Text style={styles.itemText}>{product.title}</Text>
                                                                <Text style={styles.itemText}>${product.price}</Text>
                                                                <Text style={styles.itemText}>Quantity: {product.quantity}</Text>
                                                            </View>
                                                        </View>
                                                    )) || (
                                                        <Text style={styles.dropdownItem}>Loading...</Text>
                                                    )}

                                                        <TouchableOpacity
                                                            style={styles.payButton}
                                                            onPress={() => payForOrder(item.id)}
                                                        >
                                                            <Text style={styles.payButtonText}>Pay for Order</Text>
                                                        </TouchableOpacity>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                );
                            })
                        )}

                        <View style={styles.divider}>
                            <Text style={styles.dividerText}>Paid Orders</Text>
                        </View>
                        {paidOrders.length === 0 ? (
                            <Text style={styles.emptyOrderText}>No Orders Here!</Text>
                        ) : (
                            paidOrders.map((item) => {
                                const isExpanded = expandedOrders.includes(item.id);
                                const orderItems = JSON.parse(item.order_items);
                            
                                return (
                                    <View key={item.id}>
                                        <View style={styles.listContainer}>
                                            <Text style={styles.listText}>Order ID: {item.id}</Text>
                                            <Text style={styles.listText}>Items: {item.item_numbers}</Text>
                                            <Text style={styles.listText}>${item.total_price / 100}</Text>
                                    
                                            <TouchableOpacity onPress={() => toggleExpand(item.id, orderItems)}>
                                                <Ionicons
                                                    name={isExpanded ? "caret-up-outline" : "caret-down-outline"}
                                                    size={24}
                                                    color="white"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <View>
                                            {isExpanded && (
                                                <View style={styles.dropdownContainer}>
                                                    {orderDetails[item.id]?.map((product, index) => (
                                                        <View key={index} style={styles.itemContentContainer}>
                                                            <Image
                                                                source={{ uri: product.image }}
                                                                style={styles.itemImage}
                                                            />
                                                            <View style={styles.itemContainer}>
                                                                <Text style={styles.itemText}>{product.title}</Text>
                                                                <Text style={styles.itemText}>${product.price}</Text>
                                                                <Text style={styles.itemText}>Quantity: {product.quantity}</Text>
                                                            </View>
                                                        </View>
                                                    )) || (
                                                        <Text style={styles.dropdownItem}>Loading...</Text>
                                                    )}

                                                        <TouchableOpacity
                                                            style={styles.payButton}
                                                            onPress={() => receiveOrder(item.id)}
                                                        >
                                                            <Text style={styles.payButtonText}>Receive Order</Text>
                                                        </TouchableOpacity>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                );
                            })
                        )}

                        <View style={styles.divider}>
                            <Text style={styles.dividerText}>Delivered Orders</Text>
                        </View>
                        {deliveredOrders.length === 0 ? (
                            <Text style={styles.emptyOrderText}>No Orders Here!</Text>
                        ) : (
                            deliveredOrders.map((item) => {
                                const isExpanded = expandedOrders.includes(item.id);
                                const orderItems = JSON.parse(item.order_items);
                            
                                return (
                                    <View key={item.id}>
                                        <View style={styles.listContainer}>
                                            <Text style={styles.listText}>Order ID: {item.id}</Text>
                                            <Text style={styles.listText}>Items: {item.item_numbers}</Text>
                                            <Text style={styles.listText}>${item.total_price / 100}</Text>
                                    
                                            <TouchableOpacity onPress={() => toggleExpand(item.id, orderItems)}>
                                                <Ionicons
                                                    name={isExpanded ? "caret-up-outline" : "caret-down-outline"}
                                                    size={24}
                                                    color="white"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <View>
                                            {isExpanded && (
                                                <View style={styles.dropdownContainer}>
                                                    {orderDetails[item.id]?.map((product, index) => (
                                                        <View key={index} style={styles.itemContentContainer}>
                                                            <Image
                                                                source={{ uri: product.image }}
                                                                style={styles.itemImage}
                                                            />
                                                            <View style={styles.itemContainer}>
                                                                <Text style={styles.itemText}>{product.title}</Text>
                                                                <Text style={styles.itemText}>${product.price}</Text>
                                                                <Text style={styles.itemText}>Quantity: {product.quantity}</Text>
                                                            </View>
                                                        </View>
                                                    )) || (
                                                        <Text style={styles.dropdownItem}>Loading...</Text>
                                                    )}
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                );
                            })
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
    content: {
        marginHorizontal: '10%',
    },
    loadingScreen: {
        marginTop: 50,
        flex: 1,
    },
    divider: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fff',
        padding: 20,
        marginBottom: 20,
        marginRight: 30,
        marginLeft: 30,
        marginTop: 0,
        borderRadius: 5,
    },
    dividerText: {
        color: '#fff',
        fontSize: 20,
    },
    emptyOrderText: {
        fontWeight: '500',
        color: '#fff',
        fontSize: 18,
        marginLeft: 150,
        marginBottom: 20,
    },
    itemContentContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
        alignItems: 'flex-start',
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 5,
        resizeMode: 'contain',
    },
    itemContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: 10,
    },
    itemText: {
        color: '#fff',
        fontSize: 16,
    },
    dropdownContainer: {
        marginTop: 10,
        paddingLeft: 10,
    },
    dropdownItem: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 5,
    },
    listContainer: {
        flexDirection: 'row',
        paddingRight: 30,
        paddingLeft: 30,
        paddingBottom: 20,
        borderColor: '#fff',
        borderBottomWidth: 1,
        marginBottom: 20,
        flex: 1,
        justifyContent: 'space-between',
    },
    listText: {
        color: '#fff',
        fontSize: 16,
    },
    payButton: {
        backgroundColor: '#00C851',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        marginHorizontal: 20,
    },
    payButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },    
});
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, StatusBar, Modal, Alert } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from 'react-redux';
import { logout, login } from '../slices/authSlice';
import { clearCart } from '../slices/cartSlice';
import NavFooter from '../components/navFooter';

export default function ProfileScreen({ route, navigation }) {
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();

    const [modalVisible, setModalVisible] = useState(false);
    const [newName, setNewName] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const signout = () => {
        dispatch(logout());
        dispatch(clearCart());
        navigation.replace('login');
    };

    const updateTest = async () => {
        try {
            const response = await fetch('http://192.168.20.7:3000/users/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: newName,
                    password: newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok && data.status === "OK") {
                console.log('Change successful:', data);
                Alert.alert("Success", "User info updates successfully.");
                setModalVisible(false);

                dispatch(login({
                    token: token,
                    user: { name: newName, email: user.email, id: user.id }
                }));

            } else {
                console.error('Change failed:', data.message || data);
                Alert.alert("Error", data.message || "Update failed.");
            }
        } catch (error) {
            console.log('Network error:', error);
            Alert.alert("Error", "Network error occured.");
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#242424" />

            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>User Profile</Text>
            </View>

            <View style={styles.contentContainer}>
                <Text style={styles.infoText}>Username: {user?.name}</Text>
                <Text style={styles.infoText}>Email: {user?.email}</Text>
                <View style={styles.btnContainer}>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => setModalVisible(true)}
                    >
                        <Ionicons name="color-wand-outline" size={24} color="white" />
                        <Text style={styles.btnText}>Update</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => signout()}
                    >
                        <Ionicons name="log-out-outline" size={24} color="white" />
                        <Text style={styles.btnText}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <NavFooter navigation={navigation} route={route} />

            {/* Modal for user info updating */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Update Info</Text>
                        <TextInput
                            placeholder="New Name"
                            placeholderTextColor="#999"
                            style={styles.input}
                            onChangeText={setNewName}
                            value={newName}
                        />
                        <TextInput
                            placeholder="New Password"
                            placeholderTextColor="#999"
                            secureTextEntry
                            style={styles.input}
                            onChangeText={setNewPassword}
                            value={newPassword}
                        />
                        <View style={styles.btnContainer}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalBtn}>
                                <Ionicons name="arrow-back-circle-outline" size={24} color="white" />
                                <Text style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={updateTest} style={styles.modalBtn}>
                                <Ionicons name="save-outline" size={24} color="white" />
                                <Text style={styles.btnText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    infoText: {
        paddingLeft: 20,
        fontSize: 20,
        color: '#fff',
    },
    btnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
        marginHorizontal: 20,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        backgroundColor: '#363636',
        justifyContent: 'center',
        borderRadius: 8,
        paddingHorizontal: 26,
        paddingVertical: 10,
    },
    btnText: {
        marginLeft: 5,
        color: '#fff',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#333',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#666',
        borderRadius: 8,
        padding: 10,
        marginVertical: 10,
        color: '#fff',
        backgroundColor: '#444',
    },
    modalBtn: {
        backgroundColor: '#555',
        padding: 10,
        borderRadius: 8,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    
});
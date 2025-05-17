import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../slices/authSlice';
import NavFooter from '../components/navFooter';

export default function SignupScreen({ route, navigation }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const clearAll = () => {
        setEmail('');
        setPassword('');
    }

    const dispatch = useDispatch();

    const signup = async () => {
        console.log('Signup Attempting');
        try {
            const response = await fetch('http://192.168.20.7:3000/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: username,
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok && data.status === "OK") {
                console.log('Signup successful:', data);

                // Store token
                dispatch(login({
                    token: data.token,
                    user: { name: data.name, email: data.email, id: data.id }
                }));

                navigation.replace('profile');
            } else {
                console.error('Signup failed:', data.message || data);
            }
        } catch (error) {
            console.log('Network error:', error);
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#242424" />

            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Sign up</Text>
            </View>

            <View style={styles.contentContainer}>
                <TextInput 
                    placeholder='Username'
                    placeholderTextColor='#525252'
                    autoCapitalize='none'
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput 
                    placeholder='Email'
                    placeholderTextColor='#525252'
                    autoCapitalize='none'
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput 
                    placeholder='Password'
                    placeholderTextColor='#525252'
                    secureTextEntry={true}
                    autoCapitalize='none'
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                />
                <View style={styles.btnContainer}>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => clearAll()}
                    >
                        <Ionicons name="ban-outline" size={24} color="white" />
                        <Text style={styles.btnText}>Clear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => signup()}
                    >
                        <Ionicons name="log-in-outline" size={24} color="white" />
                        <Text style={styles.btnText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.switchBtn}
                    onPress={() => navigation.replace('login')}
                >
                    <Text style={styles.switchBtnText}>Would you like to sign in instead?</Text>
                </TouchableOpacity>
            </View>

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
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    input: {
        marginBottom: 20,
        padding: 15,
        fontSize: 16,
        borderRadius: 15,
        borderColor: '#363636',
        borderWidth: 2,
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
    switchBtn: {
        marginTop: 15,
        alignItems: 'center',
    },
    switchBtnText: {
        color: '#525252',
        fontSize: 16,
    },
});
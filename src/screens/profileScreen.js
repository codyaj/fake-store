import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slices/authSlice';
import NavFooter from '../components/navFooter';

export default function ProfileScreen({ route, navigation }) {
    const user = useSelector((state) => state.auth.user);

    const dispatch = useDispatch();

    const signout = () => {
        dispatch(logout());
        navigation.replace('login');
    }

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
                        onPress={() => clearAll()}
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
});
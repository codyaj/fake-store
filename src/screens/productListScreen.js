import React from 'react';
import { View, Text, Button } from 'react-native';

export default function ProductListScreen({ route, navigation }) {
    return (
        <View>
            <Text>Product List Screen Screen</Text>
            <Button onPress={() => navigation.navigate('category')} title={'hello'} />
        </View>
    );
}
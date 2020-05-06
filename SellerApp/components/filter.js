import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { AsyncStorage } from 'react-native';

export default function Filter({ updateList }) {
    [text, setText] = useState('');

    const onChangeInput = (value) => {
        setText(value);
        getSpecificProducts();
    };

    const getSpecificProducts = async () => {
        var TOKEN = await AsyncStorage.getItem('token');
        fetch("https://cash-register-server-si.herokuapp.com/api/products" + "?search=" + text, {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + TOKEN
            }}).then((res) => res.json()).then((specificProducts) => {
                updateList(specificProducts);
                return specificProducts;
            }).done();
    }
    
    return (
        <View>
            <TextInput value={text} onChangeText={onChangeInput} placeholder="Enter product's name"  placeholderTextColor = "#f0ffff" style={styles.input} />
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        borderBottomWidth: 2,
        borderBottomColor: '#ddd',
        marginBottom: 10,
        paddingHorizontal: 8,
        paddingVertical: 6,
        fontWeight:'bold',
        color:'#f0ffff'
    },
});
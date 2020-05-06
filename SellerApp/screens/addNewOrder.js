import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { WingBlank, WhiteSpace } from '@ant-design/react-native';
import styles from '../styles/productStyles';
import { Card, TextInput } from 'react-native-paper';
import { saveNewOrder } from '../functions/storage';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { useTablesContext } from '../contexts/tablesContext';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { AsyncStorage } from 'react-native';

export default function AddNewOrder({ navigation }) {
    const param = navigation.getParam('data');
    const order = param.newOrder; // objekat koji sadrzi kao atribute: products-niz proizvoda,tableNr i served
    order.served = false; // ako se ne unese napomena znaci da nije usluzeno

    const checkTableNumber = (number) => {

        if (number != null) {
            order.tableNr = number;
        }
    }

    const [ tables, setTables ] = useState(async () => {
        var TOKEN = await AsyncStorage.getItem('token');
        fetch("https://cash-register-server-si.herokuapp.com/api/tables", {
          method: "GET",
          headers: {
            'Authorization': 'Bearer ' + TOKEN
          }
        })
          .then((response) => response.json())
          .then((serverTables) => {
            var modifiedTables = [];
            serverTables.map((table) => {
              modifiedTables.push({
                  id: table.id,
                  name: table.tableNumber.toString()
                });
            })
            //console.log(modifiedTables + "KKKKKKKKK");
            setTables(modifiedTables);
            return modifiedTables;
            })
          .done();
    })

    return (
        <ImageBackground source={require('../images/background2.png')}
            style={styles.container}>
            <View style={{...styles.btnContainer, marginBottom: 10}}>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity
                        style={styles.saveBtn}
                        onPress={() => {
                            saveNewOrder(navigation.state.params.data.newOrder); // spašava u AsyncStorage
                            navigation.navigate('DisplayProducts');
                        }}
                        underlayColor='#fff'>
                        <Text style={styles.sumbitText}>Save order</Text>
                    </TouchableOpacity></View>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={() => {
                            navigation.navigate('DisplayProducts');
                        }}
                        underlayColor='#fff'>
                        <Text style={styles.sumbitText}>Cancel</Text>
                    </TouchableOpacity></View>
            </View>
            <SearchableDropdown
              keyboardType={'numeric'} 
              placeholderTextColor = {"white"}
              placeholder='Table number' 
              items = {tables}
              containerStyle={{ 
                marginBottom: 10,
                height: 120, 
                justifyContent: "center",
                width: 160,
                alignSelf: "center",
                borderRadius: 10,
              }} 
              textInputProps={
                {
                  underlineColorAndroid: "transparent",
                  style: {
                      padding: 12,
                      borderWidth: 1,
                      borderColor: '#ccc',
                      borderRadius: 5,
                      marginBottom: 5,
                      color: "white",
                      textAlign: "center",
                      fontSize: 20,
                      fontWeight: "bold"
                  },
                  onTextChange: text => checkTableNumber(text)
                }
              }
              itemStyle={{
                backgroundColor: 'white',
                borderColor: '#bbb',
                borderWidth: 1,
                borderRadius: 5,
                marginBottom: 2,
                width: 50,
                paddingLeft: 20,
                marginTop: 5,
                alignSelf: "center",
              }}
              onItemSelect={(item) => {
                checkTableNumber(item.name)
              }}
            />
            <ScrollView>
                {navigation.state.params.data.newOrder.products.map((item) => {
                    return (
                        <WingBlank size="lg" key={item.id}>
                            <Card.Title
                                title={item.name}
                                titleStyle={{ paddingTop: 10, color: '#000000' }}
                                left={(props) => {
                                    const img = item.imageBase64;
                                    return <Image {...props}
                                        style={{ width: 35, height: 35, opacity: 1 }}
                                        source={{ uri: img }} />
                                }}
                                right={(props) => (
                                    <View {...props} style={{flexDirection: 'row', 
                                      backgroundColor: 'white', 
                                      justifyContent: 'center', 
                                      alignItems: 'center', width: 130}
                                    }>  
                                      <Text style={styles.tableNum1}>{item.times}</Text>
                                      <Text style = {{flex: 5, textAlign: "center", marginBottom: 3}}>{item.price} KM</Text>
                                    </View>
                                )}
                                style={styles.card}
                            />
                        </WingBlank>
                    )
                })}

                <WhiteSpace size="lg" />
            </ScrollView>
        </ImageBackground>
    );
}
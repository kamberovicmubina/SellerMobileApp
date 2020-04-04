import React from 'react'
import { View, Text, ScrollView, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { WingBlank, WhiteSpace } from '@ant-design/react-native';
import styles from '../styles/productStyles';
import { Card } from 'react-native-paper';
import { saveNewOrder } from '../functions/storage';

export default function AddNewOrder ({ navigation }) {
    return (
        <ImageBackground source={require('../images/background2.png')} 
        style={styles.container}>

            <View style={styles.btnContainer}>
                <View style={{flex: 1}}>
                <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={ () => {                  
                        saveNewOrder(navigation.state.params.data.newOrder); // spašava u AsyncStorage
                        navigation.navigate('DisplayProducts');
                    }}
                    underlayColor='#fff'>
                    <Text style={styles.sumbitText}>Save order</Text>
                </TouchableOpacity></View>
                <View style={{flex: 1}}>
                <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={ () => {                    
                        navigation.navigate('DisplayProducts');
                    }}
                    underlayColor='#fff'>
                    <Text style={styles.sumbitText}>Cancel</Text>
                </TouchableOpacity></View>
            </View>

            <ScrollView>
                {navigation.state.params.data.newOrder.products.map(( item ) => {
                    return (
                        <WingBlank size="lg" key={item.id}>
                        <Card.Title            
                            title={item.name}
                            titleStyle={{paddingTop: 10, color: '#000000'}}
                            left={(props) => {
                                const img = item.imageBase64;
                                return <Image {...props} 
                                    style={{width: 35, height: 35, opacity: 1}}
                                    source={{ uri: img }} /> 
                            }}
                            right={(props) => (
                            <View {...props} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{
                                    marginRight: 30, 
                                    paddingHorizontal: 10, 
                                    paddingVertical: 10,
                                    backgroundColor: '#bae7ff',
                                    borderRadius: 10,
                                    borderWidth: 0.2,
                                    borderColor: '#bae7ff'
                                }}>
                                <Text>{item.times}</Text>
                                </View>                    
                                <Text style={{ color: '#000000' }}>{item.price} KM</Text>
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
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Image, Modal, RefreshControl, Dimensions } from 'react-native';
import { WingBlank, WhiteSpace, Button } from '@ant-design/react-native';
import { Card } from 'react-native-paper';
import { AsyncStorage } from 'react-native';
import styles from '../styles/productStyles';
import { getTitleStyle, getSubtitleStyle, getTextStyle } from '../functions/productStyleFunc';
import { MaterialIcons } from '@expo/vector-icons';

export default function ModalProductPicker({ modalVisible, setModalVisible, setProducts, invokeUpdateOrders, products, listEmpty, setListEmpty}) {
    const [refreshing, setRefreshing] = React.useState(false);
    const [staticProducts, setStaticProducts] = useState([]);
    const [forbidenProducts, setForbidenProducts] = useState([]);

    useEffect(() => {
        setForbidenProducts(products);
        getAllProducts()
    }, []);

    const addNewProduct = async (item) => {
        item.times = 0;

        setProducts((prevProducts) => {
            return [
                ...prevProducts,
                item
            ];
        });

        await invokeUpdateOrders();

        setForbidenProducts((prevForbidenProducts) => {
            return [
                ...prevForbidenProducts,
                item
            ];
        });

        if(forbidenProducts.length + 1 === staticProducts.length) {
            setListEmpty(!listEmpty);
            setModalVisible(!modalVisible);
        }
    }

    const getAllProducts = async () => {
        var TOKEN = await AsyncStorage.getItem('token');
        fetch("https://cash-register-server-si.herokuapp.com/api/products", {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + TOKEN
            }
        }).then((res) => res.json()).then((products) => {
            setStaticProducts(products);
            return products;
        }).done();
    }

    const isForbiden = (id) => {
        let forbiden = false;
        forbidenProducts.map(fp => {
            if (fp.id === id) forbiden = true;
        });

        return forbiden;
    }

    return (
        <View>
            <Modal animationIn="slideInUp" animationOut="slideOutDown" visible={modalVisible} >
                <View>
                    <Button style={styles.confirmButton} onPress={() => setModalVisible(false)}>
                        <MaterialIcons size={40} name="done" style={styles.confirmIcon}></MaterialIcons>
                    </Button>
                </View>
                <ScrollView style={styles.modalProducts} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getProducts} />}>
                    {staticProducts.map((item) => {
                        if (!isForbiden(item.id)) {
                            return (
                                <TouchableOpacity key={item.id} onPress={() => addNewProduct(item)}>
                                    <WingBlank size="lg">
                                        <Card.Title
                                            title={item.name}
                                            titleStyle={getTitleStyle(item.quantity)}
                                            subtitleStyle={getSubtitleStyle(item.quantity)}

                                            left={(props) => {
                                                const img = item.imageBase64;
                                                return <Image {...props}
                                                    style={[{ width: 35, height: 35 }, modalVisible ? { opacity: 0 } : '1']}
                                                    source={{ uri: img }} />
                                            }}
                                            right={(props) => (
                                                <View {...props} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={[getTextStyle(item.quantity),
                                                    modalVisible ? { color: 'black' } : '']}>{item.price} KM</Text>
                                                </View>
                                            )}
                                            style={[styles.card,
                                            modalVisible ? { backgroundColor: 'white' } : '',
                                            modalVisible ? { borderColor: 'rgba(0,0,0,0.7)' } : '']}
                                        />
                                    </WingBlank>
                                    <WhiteSpace size="lg" />
                                </TouchableOpacity>
                            )
                        }
                    }
                    )}
                </ScrollView>

            </Modal>
        </View>
    );
}
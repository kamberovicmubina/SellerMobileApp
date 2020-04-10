import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Image, ImageBackground, TouchableOpacity, TextInput, Alert, AsyncStorage } from 'react-native';
import { WingBlank, WhiteSpace, Button } from '@ant-design/react-native';
import styles from '../styles/productStyles';
import { Card } from 'react-native-paper';
import { deleteUnservedOrder } from '../functions/storage';
import { MaterialIcons } from '@expo/vector-icons';
import orderStyles from '../styles/orderStyles';
import CheckBox from 'react-native-check-box';
import ModalProductPicker from '../components/modalProductPicker';
import { updateOrders, postOrder, updateOrderState, deleteOrder } from '../functions/storage';
import Swipeout from 'react-native-swipeout';

export default function OrderContent({ navigation }) {
  const [products, setProducts] = useState(navigation.state.params.data.item.products);
  const [price, setPrice] = useState();
  const [narudzba, setNarudzba] = useState(navigation.state.params.data.item);
  const [served, setServed] = useState(navigation.state.params.data.item.served);
  const [editInputVisible, setEditInputVisible] = useState(false);
  const [editButtonVisible, setEditButtonVisible] = useState(true);
  const [orders, setOrders] = useState(navigation.state.params.orders.orders);
  const [prevProductsQuantity, setPrevProductsQuantity] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [clickedOrder, setClickedOrder] = useState(navigation.state.params.data.item);
  const [listEmpty, setListEmpty] = useState(false);
  const [addButtonDisabled, setAddButtonDisabled] = useState(true);

  var receiptItems = [];
  var backupObject = {};
  var message = '';
  const calculateTotalPrice = async (receiptItems) => {
    var toPay = 0;
    receiptItems = [];
    if (receiptItems != null) products.map((item) => {
      toPay = toPay + item.times * item.price;
      receiptItems.push({ id: item.id, quantity: item.times });
      backupObject = { receiptItems };
    });
    else products.map((item) => {
      toPay = toPay + item.times * item.price;
    });
    backupObject = {message, receiptItems };
    await setPrice(Math.round(toPay * 100) / 100);
  }

  useEffect(() => {
    calculateTotalPrice(null);
  }, []);

  useEffect(() => {
    invokeUpdate();
  },[products]);

  useEffect(() => {
    //receiptItems = [];
    //backupObject = {};
    calculateTotalPrice(receiptItems);
    /* backupObject je objekat koji sadrzi niz reciptItems, jer ga kao takvog saljemo serveru */
    //backupObject = { receiptItems };
  }, [price]);

  const updateProducts = async (newProducts) => {
    await setProducts(newProducts);
  }

  const editButton = () => {
    setEditButtonVisible(!editButtonVisible);
    setEditInputVisible(!editInputVisible);
    setAddButtonDisabled(!addButtonDisabled);
    let newProductsQuantity = [];
    products.map(product => {
      newProductsQuantity.push({ id: product.id, quantity: product.times });
    });
    setPrevProductsQuantity(newProductsQuantity);
  }

  const checkButton = () => {
    setEditButtonVisible(!editButtonVisible);
    setEditInputVisible(!editInputVisible);
    setAddButtonDisabled(!addButtonDisabled);
    updateProducts(products.filter(p => {
      return (p.times != 0)
    }));
  }

  const invokeUpdate = () => {
    clickedOrder.products = products;
    updateOrders(orders);
    calculateTotalPrice();
  }

  const onChangeQuantity = (value, item) => {
    if (value === "" || allCharactersSame(value, "0")) {
      prevProductsQuantity.map(product => {
        if (product.id === item.id) item.times = product.quantity;
      });
    }
    else item.times = value.replace(/^0+/, '');
    calculateTotalPrice();
  }

  const allCharactersSame = (str, c) => {
    if (str.length === 0) return;
    if (c == undefined || c == null) c = str[0];
    for (let i = 0; i < str.length; i++) {
      if (str[i] != c) return false;
    }
    return true;
  }

  const setPlaceholder = (item) => {
    let ph = "";
    prevProductsQuantity.map(product => {
      if (product.id === item.id) ph = product.quantity.toString();
    });

    return ph;
  }

  const addButton = () => {
    if (listEmpty == true) Alert.alert('EMPTY LIST', 'No more products available', [{
      text: 'OK'
    }]);
    else setModalVisible(true);
  }

  const submitOrder = () => {
    postOrder(navigation, narudzba, backupObject);
  }

  const changeOrderServeState = () => {
    setServed(!served);
    updateOrderState(navigation.state.params.data.item);
  }

  return (
    <ImageBackground source={require('../images/background2.png')}
      style={styles.container}>
      <ModalProductPicker modalVisible={modalVisible} setModalVisible={setModalVisible} orders={orders} products={products}
        setProducts={setProducts} invokeUpdate={invokeUpdate} products={products} listEmpty={listEmpty}
        setListEmpty={setListEmpty} ></ModalProductPicker>
      <View style={styles.showPrice}>
        <Text style={{ ...styles.sumbitText, fontSize: 18 }}>To pay: {price + " KM"}</Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        {editButtonVisible &&
          <Button onPress={editButton} style={styles.editButton}>
            <MaterialIcons name='edit' size={30} style={styles.editIcon} />
          </Button>}
        {!editButtonVisible &&
          <Button onPress={checkButton} style={{ marginBottom: 20, marginLeft: 15 }}>
            <MaterialIcons name='check' size={30} style={styles.editIcon} />
          </Button>}
        <View style={orderStyles.orderServedView}>
          <Text style={orderStyles.textServed}>Served: </Text>
          <CheckBox isChecked={served} onClick={changeOrderServeState} />
        </View>
        <Button onPress={addButton} style={
          (addButtonDisabled && styles.addButtonDisabled) || (!addButtonDisabled && styles.addButton)} disabled={addButtonDisabled}>
          <MaterialIcons name='add' size={30} style={styles.addIcon} />
        </Button>
      </View>

      <ScrollView>
        {products.map((item) => {
          return (
            <Swipeout style={styles.swipeDeleteButton} key = {item.id} right={ [{
              text: 'Delete',
              backgroundColor: 'red',
              onPress: () => { 
               var newProducts = products.filter( p => {return p.id != item.id} );
               setProducts(newProducts);
              }
            }] } autoClose={true} backgroundColor= 'transparent'>

            <TouchableOpacity key={item.id}
            >
              <WingBlank size="lg">
                <Card.Title
                  title={item.name}
                  titleStyle={item.quantity}
                  subtitleStyle={item.quantity}

                  left={(props) => {
                    const img = item.imageBase64;
                    return <Image {...props}
                      style={{ width: 35, height: 35 }}
                      source={{ uri: img }} />
                  }}
                  right={(props) => (
                    <View {...props} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                      {!editInputVisible &&
                        <View style={styles.tableNum}>
                          <Text>{item.times}</Text>
                        </View>}
                      {editInputVisible &&
                        <View style={styles.productQuantity} >
                          <TextInput style={styles.inputQuantity} onChangeText={(value) => onChangeQuantity(value, item)} placeholder={setPlaceholder(item)}
                            keyboardType={'numeric'} underlineColor="transparent"></TextInput>
                        </View>}
                      <Text>{item.price} KM</Text>
                    </View>
                  )}
                  style={styles.card}
                />
              </WingBlank>
              <WhiteSpace size="lg" />
            </TouchableOpacity></Swipeout>
          )
        }
        )}
      </ScrollView>
      <View style={styles.btnContainer2}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={submitOrder}>
            <View style={styles.submitOrderButton}>
              <Text style={styles.submitOrderButtonText}>Submit order</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => {
              deleteUnservedOrder(navigation.state.params.data.item);
              navigation.navigate('DisplayOrders');
            }}
            underlayColor='#fff'>
            <Text style={styles.submitOrderButtonText}>Delete order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

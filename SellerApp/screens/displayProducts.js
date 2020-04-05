import React, { useState, useEffect }  from 'react';
import { Text, View, TouchableOpacity, ScrollView, Image, ImageBackground, 
        Modal, TouchableHighlight, RefreshControl, 
        TouchableWithoutFeedback, Keyboard } from 'react-native';
import { WingBlank, WhiteSpace, Button } from '@ant-design/react-native';
import { Card } from 'react-native-paper';
import {AsyncStorage} from 'react-native';
import Filter from '../components/filter';
import styles from '../styles/productStyles';
import { getStyle, getTitleStyle, getSubtitleStyle, getTextStyle, isProductQuantitySmall } from '../functions/productStyleFunc';
import { checkIfOrdersEmpty } from '../functions/storage';


export default function DisplayProducts( { navigation } ) {
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [orderProducts, setOrderProducts] = useState([]);
  const [newOrder, setNewOrder] = useState({
    'products': orderProducts,
    'tableNr': 0,
    'served': null,
  }); // lokalna narudžba za ovaj screen koja se tek kreira

  /* Podaci o proizvodu za koji tražimo dodatne informacije. */
  const [modalData, setModalData] = useState({name: null, 
    price: null, 
    image: null, 
    unit: null, 
    discount: null, 
    quantity: null});
  /* Popunjavanje dodatnih informacija o nekom proizvodu */  
  const ModalFetcher = (id) =>{
    products.map((item) => {
      if(id == item.id){
        const img = item.imageBase64;
        setModalData({name: item.name,
            price: item.price, 
            image: img, 
            unit: item.measurementUnit, 
            discount: item.discount, 
            quantity: item.quantity
          })
          return;
      }
      }
    )
  }
  
  getProducts = async () => {
    setRefreshing(true);
    var TOKEN = await AsyncStorage.getItem('token');
    fetch("https://cash-register-server-si.herokuapp.com/api/products", {
      method: "GET",
      headers: {
        'Authorization': 'Bearer ' + TOKEN
      }
    })
      .then((response) => response.json())
      .then((products) => {
        setProducts(products);
        setRefreshing(false);
        return products;
      })
      .done();
  }

  useEffect( () => {
    checkIfOrdersEmpty();
  }, []);

  useEffect(() => {
    getProducts();
  }, []);

  useEffect( () => {
    //Nakon što se promijeni newOrder, izvršava se sljedeće
    if (orderProducts.length != 0) { // ali ne i prilikom prvog učitavanja ekrana
      setButtonVisible(true); // postavlja se na true da bi se dole izrendala komponenta s količinom
    }
  }, [orderProducts]);

  const addNewItemToOrder = (item, timesPressed) => {
    // ako je element već u nizu, obriše se
    orderProducts.map( (orderObject) => {
      if (orderObject.name === item.name) {    
        var index = orderProducts.indexOf(orderObject);
        orderProducts.splice(index, 1);
        return;
      }                         
    });
    // sada se doda novi objekat
    setOrderProducts( selectedProducts => [...selectedProducts, {
        'id' : item.id,
        'name' : item.name,
        'times' : timesPressed,
        'price' : item.price,
        'imageBase64': item.imageBase64,
    }]);            
  }

  useEffect(() => {
    setNewOrder({
      'products': orderProducts,
      'tableNr': 0,
      'served': null,
    })
  }, [orderProducts]);

  const updateList = (specificProducts) => {
      setProducts(specificProducts);
  }

  return (
    <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss();}}>
      <ImageBackground source={require('../images/background2.png')} 
        style={[styles.container, 
        modalVisible ? {opacity: 0.05} : '1']}>
        <Modal
          style={styles.centeredView}
          animationType="fade"
          transparent={true}
          visible={modalVisible}>
          <View style={styles.modal}>
              <Image
                style={styles.modalImage}
                source={{ uri: modalData.image }}
              />
          </View>
          <View style={styles.centeredView}>
            <View style={{...styles.modalView, marginBottom: '50%'}}>
                <Text style={styles.modalTitle}>{modalData.name}</Text>
              <Text style={styles.modalText}>Price: <Text style={{fontWeight: "bold"}}>{modalData.price} KM</Text></Text>
              <Text style={getStyle(modalData.quantity)}>Quantity: <Text style={{fontWeight: "bold"}}>{modalData.quantity} {modalData.unit}</Text><Text> {isProductQuantitySmall(modalData.quantity)}</Text></Text>
              <Text style={styles.modalText}>Discount: <Text style={{fontWeight: "bold"}}>{modalData.discount} %</Text></Text>
              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: 'rgba(0,0,55,50)' }}
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text style={styles.textStyle}>&#215;</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        {buttonVisible && <TouchableOpacity
          style={styles.proceedBtn}
          onPress={ () => {
            navigation.navigate('AddNewOrder', { data: {newOrder} } );
            setOrderProducts([]);
            setNewOrder({});
            setButtonVisible(false);
          }}
          underlayColor='#fff'>
          <Text style={styles.sumbitText}>Proceed</Text>
        </TouchableOpacity>}

        <Filter updateList={updateList} />
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={getProducts} />
          }>
          
          {products.map((item) => { 
            //update količine proizvoda
            var timesPressed = '0';
            orderProducts.map( (orderObject) => {
              if (orderObject.name === item.name) {
                timesPressed = orderObject.times.toString();
                return;
              } 
              
            });

            return (
              <TouchableOpacity key={item.id}
                  onLongPress={ () => {
                      ModalFetcher(item.id); 
                      setModalVisible(true);
                    }
                  }
                  onPress={ () => {   
                      if (item.quantity != 0) {                   
                        timesPressed++;  
                        addNewItemToOrder(item, timesPressed); 
                      }                              
                    }
                  }
              >
                <WingBlank size="lg">
                  <Card.Title            
                    title={item.name}
                    titleStyle={getTitleStyle(item.quantity)}
                    subtitleStyle={getSubtitleStyle(item.quantity)}

                    left={(props) => {
                      const img = item.imageBase64;
                      return <Image {...props} 
                        style={[{width: 35, height: 35}, modalVisible ? {opacity: 0} : '1']}
                        source={{ uri: img }} /> 
                    }}
                    right={(props) => (
                      <View {...props} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        {buttonVisible && 
                          <View style={styles.tableNum}>
                          <Text>{timesPressed}</Text>
                          </View>}                      
                        <Text style={[getTextStyle(item.quantity),
                           modalVisible ? {color: 'rgba(0,0,0,0.7)'} : '']}>{item.price} KM</Text>
                      </View>
                    )}
                    style={[styles.card, 
                      modalVisible ? {backgroundColor: 'rgba(0,0,0,0.7)'} : '', 
                      modalVisible ? {borderColor: 'rgba(0,0,0,0.7)'} : '']}
                  />
                </WingBlank>
                <WhiteSpace size="lg" />
                </TouchableOpacity>
            )
          }
          )}
        </ScrollView>
      </ImageBackground>
    </TouchableWithoutFeedback>    
  )             
}
import React, { useState, useEffect } from 'react';
import { Text, View, Image, AsyncStorage, Modal, ImageBackground} from 'react-native';
import Swiper from 'react-native-swiper';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput, Button } from 'react-native-paper';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import styles from '../styles/menuStyles';
import { WingBlank } from '@ant-design/react-native';
import { Card } from 'react-native-paper';


const getFonts = () => {
  return Font.loadAsync({
    'courgette-regular': require('../assets/fonts/Courgette-Regular.ttf')
  });
}

export default function GuestMenu({ navigation }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [products, setProducts] = useState([]);
  const [orderProducts, setOrderProducts] = useState([]);
  const [newOrder, setNewOrder] = useState({
    'products': orderProducts,
    'tableNr': 0,
    'served': null,
  }); // lokalna narudžba

  const getProducts = async () => {
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
        return products;
      })
      .done();
  }

  useEffect(() => {
      getProducts();
  }, [])

  const addNewItemToOrder = (item, timesPressed) => {
    // ako je element već u nizu, obriše se
    orderProducts.map((orderObject) => {
      if (orderObject.name === item.name) {
        var index = orderProducts.indexOf(orderObject);
        orderProducts.splice(index, 1);
        return;
      }
    });
    // sada se doda novi objekat
    if(timesPressed != 0)
      setOrderProducts(selectedProducts => [...selectedProducts, {
        'id': item.id,
        'name': item.name,
        'times': timesPressed,
        'price': item.price,
        'imageBase64': item.imageBase64,
      }]);

      //console.log(timesPressed);
  }

  const [visibility, setVisibility] = useState(false);
  const showModal = () => setVisibility(true);
  const hideModal = () => setVisibility(false);

  if (fontsLoaded) {
    return (
      <Swiper
          loop={false}
          showsPagination={false}
          index={0}>
              {products != undefined && products.map((item) => {
                  var timesPressed = '0';
                  orderProducts.map((orderObject) => {
                    if (orderObject.name === item.name) {
                      timesPressed = orderObject.times.toString();
                      return;
                    }
      
                  });
                  return (
                    <View style={styles.container} key={item.id}> 
                      <Modal 
                      visible={visibility}
                      style = {{presentationStyle: "fullScreen"}}>
                        <ImageBackground 
                         source={require('../images/greyBackground.jpg')}
                         style = {{height: "100%", width: "100%",}}>
                          <View style = {styles.headerForOrder}>
                            <Text style={{color: 'white',
                             fontWeight: 'bold',
                             fontSize: 20,
                             letterSpacing: 1,
                             alignSelf: "center",
                             paddingLeft: 20}}>Your choice</Text>
                            <MaterialIcons name='delete' size={40} style={styles.deleteIcon} />
                          </View>
                           <ScrollView>
                             {orderProducts.map((item) => {
                               return(
                                 <TouchableOpacity key={item.id}>
                                   <WingBlank size="lg">
                                     <Card.Title
                                       title={item.name}
                                       left={(props) => {
                                        return <Image {...props}
                                          style={{ width: 35, height: 35 }}
                                          source={{ uri: item.imageBase64 }} />
                                      }}
                                      right={(props) => (
                                        <View {...props} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={styles.tableNum}>
                                              <Text>{item.times}</Text>
                                            </View>
                                          <Text>{item.price} KM</Text>
                                        </View>
                                      )}
                                      style={styles.card}
                                     />
                                   </WingBlank>
                                 </TouchableOpacity>
                               )
                             })}
                           </ScrollView>
                           <View style = {styles.footerForOrder}>
                            <Button 
                             onPress = {hideModal}
                             style={styles.backBtn}>
                              <Text style = {styles.btnText}>Go back to edit</Text>
                            </Button>
                            <Button 
                             //onPress = {hideModal}
                             style={styles.orderBtn}>
                              <Text style = {styles.btnText}>Order &#x2714;</Text>
                            </Button>
                          </View>
                        </ImageBackground>
                      </Modal> 
                      <View style={styles.btnContainer}>
                            <TouchableOpacity style = {{borderStyle: "solid", 
                              borderColor: 'grey',
                              borderWidth: 2,
                              marginLeft: 5, 
                              height: 45,
                              borderRadius: 10, 
                              padding: 0, 
                              margin: 0}} 
                              onPress={() => navigation.navigate('Start')}>
                                <MaterialIcons name='close' size={30} style={{marginLeft: 10, 
                                  paddingRight: 10, 
                                  paddingTop: 5, 
                                  opacity: 0.5}}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.shoppingCart}>
                                <MaterialIcons name='shopping-cart' size={30} style={styles.shopping} />
                                <TextInput 
                                    keyboardType='number-pad' 
                                    style={styles.numberInput}
                                    placeholder='0'
                                    onChange={(number) => {
                                      addNewItemToOrder(item, number.nativeEvent.text);
                                    }}>                    
                                </TextInput>
                            </TouchableOpacity>
                            <TouchableOpacity 
                             onPress={showModal}
                             style={styles.finishBtn} > 
                                <Text style={{color:"white", fontWeight: 'bold',}}>Finish</Text>
                                </TouchableOpacity>
                        </View>
                    <Image
                        style={styles.image}
                        source={{ uri: item.imageBase64 }}
                        resizeMode="contain"
                    />          
                    <View style={styles.textContainer}>
                        <View style={styles.headingText}>
                        <Text style={styles.text}>{item.name}</Text>
                        <Text style={styles.price}>{item.price} KM</Text>
                        </View>      
                        <ScrollView>
                        <Text style={{...styles.smallerText, color: '#404040'}}>Ingredients:
                        <Text style={styles.smallerText}>{item.description}</Text>
                        </Text></ScrollView>
                    </View>
                    
                    </View>
                  );
              })}
        
      </Swiper>
    );
  } else {
    return (
      <AppLoading
        startAsync={getFonts}
        onFinish={() => setFontsLoaded(true)}
    />
    );
  }
}

import React, { useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Image, ImageBackground } from 'react-native';
import { WingBlank, WhiteSpace, Button } from '@ant-design/react-native';
import { Card } from 'react-native-paper';
import styles from '../styles/productStyles';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationEvents } from 'react-navigation';
import { useProductsContext } from '../contexts/productsContext';
import { useOrdersContext } from '../contexts/ordersContext';

export default function DisplayOrders({ navigation }) {
  const { orders, guestOrders, getOrders, getOrdersServer } = useOrdersContext();
  const { products, getProducts } = useProductsContext();

  useEffect(() => {
    getOrders();
    getProducts();
  }, []);

  const setText = (num) => {
    if (num != 0)
      return ("Table: " + num);
    else return "Shopping"
  }
  const setPrice = (singleOrder) => {
    var ammount = 0;
    {
      singleOrder.products.map((singleProduct) => {
        ammount += singleProduct.times * singleProduct.price
      });
    }
    return ammount.toFixed(2);
  }

  useEffect(() => {
    getOrdersServer(); // odmah ucita narudzbe
  }, []);

  useEffect(() => { // ucitava narudzbe svakih 20 sekundi
    const timer = setInterval(() => {
      getOrdersServer();
    }, 20000);
    return () => clearTimeout(timer);
  }, [guestOrders]);   

  return (
    <ImageBackground source={require('../images/background2.png')}
      style={styles.container}>
      <NavigationEvents
        onDidFocus={getOrders}
      />
      <ScrollView>
        {orders.map((item) => {
          return (
            <TouchableOpacity key={Math.random()}
              onPress={() => {
                navigation.navigate('OrderContent', { data: { item } });
              }}>
              <WingBlank size="lg">
                <Card.Title
                  title={setText(item.tableNr)}
                  titleStyle={{fontWeight: 'normal'}}
                  left={(props) => {
                    return <Image {...props}
                      style={[{ width: 35, height: 35 }, !item.served ? { opacity: 0.2 } : '1']}
                      source={{ uri: 'https://cdn4.iconfinder.com/data/icons/categories-5/28/34_serve_tray_service_hot_dinner_restaurant_hotel-512.png', }} />
                  }}
                  right={(props) => (
                    <View {...props} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                      <Button style={{ borderColor: "white", right: 80 }}>
                        <MaterialIcons name='shopping-cart' size={30} style={styles.shopping} />
                      </Button>
                      <Text style={{ position: 'absolute', right: 0 }}>{setPrice(item) + " KM"}</Text>
                    </View>
                  )}
                  style={styles.card}
                />
              </WingBlank>
              <WhiteSpace size="lg" />
            </TouchableOpacity>
          )
        }
        )}
        <View
  style={{
    borderBottomColor: 'white',
    borderBottomWidth: 5,
    marginVertical: 25
  }}
/>
        {guestOrders.map((item) => {
          return (
            <TouchableOpacity key={Math.random()}
              onPress={() => {
                navigation.navigate('GuestOrderContent', { data: { item } });
              }}>
              <WingBlank size="lg">
                <Card.Title
                  title={setText(item.tableNr)}
                  titleStyle={{fontWeight: !item.seen ? "bold" : "normal",}}
                  left={(props) => {
                    return <Image {...props}
                      style={[{ width: 35, height: 35 }, !item.served ? { opacity: 0.2 } : '1']}
                      source={{ uri: 'https://cdn4.iconfinder.com/data/icons/categories-5/28/34_serve_tray_service_hot_dinner_restaurant_hotel-512.png', }} />
                  }}
                  right={(props) => (
                    <View {...props} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                      <Button style={{ borderColor: "white", right: 80 }}>
                        <MaterialIcons name='shopping-cart' size={30} style={styles.shopping} />
                      </Button>
                      <Text style={{ position: 'absolute', right: 0, fontWeight: !item.seen ? "bold" : "normal", }}>{setPrice(item) + " KM"}</Text>
                    </View>
                  )}
                  style={styles.card}
                />
              </WingBlank>
              <WhiteSpace size="lg" />
            </TouchableOpacity>
          )
        }
        )}
        
      </ScrollView>
    </ImageBackground>
  )
}

import React, {useState, useEffect} from 'react'
import { View, Text, ScrollView, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { WingBlank, WhiteSpace, Button } from '@ant-design/react-native';
import styles from '../styles/productStyles';
import { Card } from 'react-native-paper';
import { deleteOrder } from '../functions/storage';
import { MaterialIcons } from '@expo/vector-icons';


export default function OrderContent ({navigation}) {
    const [products, setProducts] = useState(navigation.state.params.data.item.products);
    const [price, setPrice] = useState();
    useEffect(() => {
      var toPay = 0;
      {products.map((item) => {
        toPay = toPay + item.times*item.price;
      });
      }
        setPrice(toPay);
    }, [price]);
    return (
        <ImageBackground source={require('../images/background2.png')} 
        style={styles.container}>
         <View style={styles.showPrice}>
         <Text style={{...styles.sumbitText, fontSize: 18}}>To pay: {price + " KM"}</Text>
         </View>
         <View style={{flexDirection: "row"}}>
         <MaterialIcons name='edit' size={30} style={styles.editIcon} />
           <MaterialIcons name='add' size={30} style={styles.addIcon} />
         </View>
         
        <ScrollView>
          {products.map((item) => { 
            return (
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
                        style={{width: 35, height: 35}}
                        source={{ uri: img }} /> 
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
                <WhiteSpace size="lg" />
                </TouchableOpacity>
            )
          }
          )}
        </ScrollView> 
        <View>
            <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={ () => {          
                    deleteOrder(navigation.state.params.data.item);             
                    navigation.navigate('DisplayOrders');
                  }}
                  underlayColor='#fff'>
                  <Text style={styles.sumbitText}>Delete order</Text>
            </TouchableOpacity>
        </View>
      </ImageBackground>
    );
}
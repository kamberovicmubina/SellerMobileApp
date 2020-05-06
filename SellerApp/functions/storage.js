import { AsyncStorage, Alert } from 'react-native';
import { useNotificationsContext } from '../contexts/notificationsContext';


export const checkIfAlreadyLoggedIn = async (navigation) => {
  
  const GUESTTOKEN = await AsyncStorage.getItem('guestToken');
  if (GUESTTOKEN != undefined) {// guest je ulogovan
    navigation.navigate('LogIn');
  } else {
    const TOKEN = await AsyncStorage.getItem('token');
    if (TOKEN != undefined) navigation.navigate('DisplayProducts');
  }
}

export const createOrders = async () => {
  try {
    const orders = [];
    await AsyncStorage.setItem('orders', JSON.stringify(orders));
  } catch (error) {
    console.log("Error saving orders");
  }
}

export const checkIfOrdersEmpty = async () => {
  const orders = await AsyncStorage.getItem('orders');

  if (typeof orders === 'undefined') {
    createOrders();
  }
}

export const saveNewOrder = async (newOrder) => {
  // spašavaju se podaci iz newOrder u AsyncStorage
  if (Number(newOrder.tableNr) === parseInt(Number(newOrder.tableNr))) {
    try {
      // uzmemo postojeće orders iz AsyncStorage
      const existingOrders = await AsyncStorage.getItem('orders');
      // u slučaju da ih nema
      let ordersRec = JSON.parse(existingOrders);
      if (!ordersRec) {
        ordersRec = []; // kreiramo novi niz
      }
      // ubacimo novu narudžbu u niz narudžbi
      ordersRec.push(newOrder);
      // spasimo novi niz narudžbi
      await AsyncStorage.setItem('orders', JSON.stringify(ordersRec))
        .then(() => {
          Alert.alert('Success', 'New order saved successfully!', [{
            text: 'Okay'
          }]);
        })
        .catch(() => {
          Alert.alert('Error', 'Error saving new order!', [{
            text: 'Okay'
          }]);
        })
    } catch (error) {
      Alert.alert('Error', 'Error saving new order!', [{
        text: 'Okay'
      }]);
    }
  }
}


export const deleteUnservedOrder = async (order) => {
  //ne treba obrisat usluzenu narudzbu
  if (order.served == true) {
    Alert.alert('Error', 'You cannot delete served order!', [{
      text: 'Okay'
    }])
    return;
  }
  else {
    let indexOfOrder = 0;
    try {
      // uzmemo postojeće orders iz AsyncStorage
      const existingOrders = await AsyncStorage.getItem('orders');
      let ordersRec = JSON.parse(existingOrders);
      //pretrazimo da nadjemo nasu narudzbu
      for (let i = 0; i < ordersRec.length; i++) {
        indexOfOrder = i;
        if (ordersRec[i].products.length != order.products.length) continue;
        if (ordersRec[i].tableNr != order.tableNr) continue;
        for (var j = 0; j < ordersRec[i].products.length; j++) {
          if (ordersRec[i].products[j].id != order.products[j].id) break;
          if (ordersRec[i].products[j].times != order.products[j].times) break;
        }
        if (j == ordersRec[i].products.length) {
          //znaci da je nasao istu narudzbu i da je treba obrisati
          ordersRec.splice(indexOfOrder, 1);
          break;
        }
      }
      // spasimo novi niz narudžbi
      await AsyncStorage.setItem('orders', JSON.stringify(ordersRec))
        .then(() => {
          Alert.alert('Success', 'Order deleted successfully!', [{
            text: 'Okay'
          }]);
        })
        .catch(() => {
          Alert.alert('Error', 'Error deleting order!', [{
            text: 'Okay'
          }]);
        })
    } catch (error) {
      Alert.alert('Error', 'Error deleting order!', [{
        text: 'Okay'
      }]);
    }
  }
}

export const updateOrders = async (newOrders) => {
  try {
    await AsyncStorage.setItem('orders', JSON.stringify(newOrders)).then(() => {
      //console.log("Orders updated succesfully");
    }).catch((err) => {
      console.log(err);
    })
  }
  catch (err) {
    console.log(err);
  }
}

export const clearAsyncStorage = async () => {
  AsyncStorage.clear();
}

export const deleteOrder = async (order) => {
  let indexOfOrder = 0;
  try {
    // uzmemo postojeće orders iz AsyncStorage
    const existingOrders = await AsyncStorage.getItem('orders');
    let ordersRec = JSON.parse(existingOrders);
    //pretrazimo da nadjemo nasu narudzbu
    for (let i = 0; i < ordersRec.length; i++) {
      indexOfOrder = i;
      if (ordersRec[i].products.length != order.products.length) continue;
      if (ordersRec[i].tableNr != order.tableNr) continue;
      for (var j = 0; j < ordersRec[i].products.length; j++) {
        if (ordersRec[i].products[j].id != order.products[j].id) break;
        if (ordersRec[i].products[j].times != order.products[j].times) break;
      }
      if (j == ordersRec[i].products.length) {
        //znaci da je nasao istu narudzbu i da je treba obrisati
        ordersRec.splice(indexOfOrder, 1);
        break;
      }
    }
    // spasimo novi niz narudžbi
    await AsyncStorage.setItem('orders', JSON.stringify(ordersRec))
      .then(() => {
        console.log('Uspjesno obrisana narudzba');
      })
      .catch(() => {
        Alert.alert('Error', 'Error deleting order!', [{
          text: 'Okay'
        }]);
      })
  } catch (error) {
    Alert.alert('Error', 'Error deleting order!', [{
      text: 'Okay'
    }]);
  }

}

/* POST zahtjev serveru za slanje narudzbe*/
export const postOrder = async (navigation, narudzba, backupObject) => {
  var data = backupObject;
  console.log(data);
  var TOKEN = await AsyncStorage.getItem('token');
  fetch("https://cash-register-server-si.herokuapp.com/api/orders", {
    method: "POST",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + TOKEN
    },
    body: JSON.stringify(data)
  })
    .then((response) => response.text())
    .then((res) => {
      //removeCurrentOrder(brojStola);
      deleteOrder(narudzba);
      console.log(res);
      Alert.alert('Submited!', 'Order was successfully submitted.', [
        {
          text: 'OK'
        }])
      navigation.navigate('DisplayOrders');
      //console.log('table broj: ', brojStola);
    }).catch((error) => console.error(error))
    .done();
}

// POST zahtjev za slanje narudzbe serveru OD STRANE GUESTA
export const postGuestOrder = async (sendToServerObject) => {
  var data = sendToServerObject;
  var TOKEN = await AsyncStorage.getItem('guestToken');
  fetch("https://cash-register-server-si.herokuapp.com/api/orders", {
    method: "POST",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + TOKEN
    },
    body: JSON.stringify(data)
  })
    .then((response) => response.text())
    .then((res) => {
      console.log(res);
    }).catch((error) => console.error(error))
    .done();
}
//
export const updateOrderState = async (order) => {
  let indexOfOrder = 0;
  try {
    // uzmemo postojeće orders iz AsyncStorage
    const existingOrders = await AsyncStorage.getItem('orders');
    let ordersRec = JSON.parse(existingOrders);
    //pretrazimo da nadjemo nasu narudzbu
    for (let i = 0; i < ordersRec.length; i++) {
      indexOfOrder = i;
      if (ordersRec[i].products.length != order.products.length) continue;
      if (ordersRec[i].tableNr != order.tableNr) continue;
      for (var j = 0; j < ordersRec[i].products.length; j++) {
        if (ordersRec[i].products[j].id != order.products[j].id) break;
        if (ordersRec[i].products[j].times != order.products[j].times) break;
      }
      if (j == ordersRec[i].products.length) {
        //znaci da je nasao istu narudzbu i azurira njenu usluzenost
        ordersRec[indexOfOrder].served = !ordersRec[indexOfOrder].served;
        break;
      }
    }
    // spasimo novi niz narudžbi
    await AsyncStorage.setItem('orders', JSON.stringify(ordersRec))
      .then(() => {
        console.log('Uspjesno editovana usluzenost narudzbe');
      })
      .catch(() => {
        Alert.alert('Error', 'Error updating order!', [{
          text: 'Okay'
        }]);
      })
  } catch (error) {
    Alert.alert('Error', 'Error updating order!', [{
      text: 'Okay'
    }]);
  }
}

export const setItemStorage = async (key, value) => {
  try {
      await AsyncStorage.setItem(key, value);
      console.log(value);
  }
  catch (err) {
      console.log("greska u store");
  }
}

export const guestLogIn = async () => {
  const settings = {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },

      body: JSON.stringify({
          username: 'guest',
          password: 'password',
      })
  };
  try {
      const fetchResponse = await fetch('https://cash-register-server-si.herokuapp.com/api/login', settings);
      const data = await fetchResponse.json();

      if (fetchResponse.ok) {
          setItemStorage('guestToken', data.token);
      }
      else {
          Alert.alert('Error', 'Bad credentials!', [{
              text: 'Okay'
          }])
      }
      return data;
  } catch (e) {
      Alert.alert('Error', 'Server timeout!', [{
          text: 'Okay'
      }])
      return e;
  }
}
//logout
export const logOut = async (stompContext, topicId) => {
  try{
    //stompContext.getStompClient().unsubscribe(topicId);
   /* stompContext.getStompClient().disconnect(function() {
      console.log("DIskonektovanoo");
    });*/
    stompContext.removeStompClient();
    await AsyncStorage.removeItem('token');
    guestLogIn();    
  }
  catch(error){
      console.log('Greska prilikom logouta!', error);
  }
};

export const guestLogOut = async () => {
  try{
    await AsyncStorage.removeItem('guestToken');
    await AsyncStorage.removeItem('token');
  }
  catch(error){
      console.log('Greska prilikom logouta!');
  }
}

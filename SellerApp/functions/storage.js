import {AsyncStorage} from 'react-native';

export const createOrders = async () => {
    try {
        const orders = [];
        await AsyncStorage.setItem('orders', JSON.stringify(orders));
    } catch (error) {
        console.log("Error saving orders");
    }
}

export const checkIfAlreadyLoggedIn = async (navigation) => {
  const TOKEN = await AsyncStorage.getItem('token');
  if (TOKEN != undefined) navigation.navigate('DisplayProducts');
}

export const checkIfOrdersEmpty = async () => {
  const orders = await AsyncStorage.getItem('orders');

  //console.log(JSON.parse(orders));

  if (typeof orders === 'undefined') {
    createOrders();
  }
}

export const saveNewOrder = async (newOrder) => {
    // spašavaju se podaci iz newOrder u AsyncStorage
    try {
      // uzmemo postojeće orders iz AsyncStorage
      const existingOrders = await AsyncStorage.getItem('orders');
      // u slučaju da ih nema
      let ordersRec = JSON.parse(existingOrders);
      if( !ordersRec ){
        ordersRec = []; // kreiramo novi niz
      }
      // ubacimo novu narudžbu u niz narudžbi
      ordersRec.push(newOrder);
      // spasimo novi niz narudžbi
      await AsyncStorage.setItem('orders', JSON.stringify(ordersRec) )
        .then( ()=>{
          console.log('New order saved succesfully');
          //console.log(ordersRec);
        } )
        .catch( ()=>{
        console.log('Error saving new order');
        } )
    } catch (error) {
      console.log("Error saving new order");
    }    
}    

export const deleteOrder = async (order) => {
 //ne treba obrisat usluzenu narudzbu
  if( order.Served == true ){
    Alert.alert ('Error', 'You cannot delete served order!',[{
      text: 'Okay'
     }])
   return;
  }
  else {
    let indexOfOrder=0;
    try {
      // uzmemo postojeće orders iz AsyncStorage
      const existingOrders = await AsyncStorage.getItem('orders');
      let ordersRec = JSON.parse(existingOrders);
     //pretrazimo da nadjemo nasu narudzbu
      for(let i=0; i<ordersRec.length; i++){
        indexOfOrder=i;
        if(ordersRec[i].products.length != order.products.length) continue;
        if(ordersRec[i].tableNr != order.tableNr) continue;
        for(var j=0;j<ordersRec[i].products.length; j++){
            if(ordersRec[i].products[j].id!=order.products[j].id) break;
            if(ordersRec[i].products[j].times!=order.products[j].times) break;
        }
        if(j==ordersRec[i].products.length){
          //znaci da je nasao istu narudzbu i da je treba obrisati
          ordersRec.splice(indexOfOrder, 1);
          break;
        }
      }
      // spasimo novi niz narudžbi
     await AsyncStorage.setItem('orders', JSON.stringify(ordersRec) )
        .then( ()=>{
          console.log('Order deleted succesfully');
          console.log(ordersRec);
        } )
        .catch( ()=>{
        console.log('Error deleting order');
        } )
    } catch (error) {
      console.log("Error deleting order");
    } 
  }  
}     
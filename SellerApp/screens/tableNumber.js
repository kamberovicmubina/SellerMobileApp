import React, { useState, useEffect } from 'react'
import { View, Text, AsyncStorage, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import styles from '../styles/productStyles';
import SearchableDropdown from 'react-native-searchable-dropdown';

export default function ChangeTableNr({ navigation }) {
    const [ tables, setTables ] = useState(async () => {
        var TOKEN = await AsyncStorage.getItem('token');
        if(TOKEN != undefined) {
          fetch("https://cash-register-server-si.herokuapp.com/api/tables", {
            method: "GET",
            headers: {
              'Authorization': 'Bearer ' + TOKEN
            }
          })
            .then((response) => response.json())
            .then((serverTables) => {
              var modifiedTables = [];
              console.log("Stolovi ", serverTables);
              if (serverTables != undefined) {
                serverTables.map((table) => {
                  modifiedTables.push({
                      id: table.id,
                      name: table.tableNumber.toString()
                    });
                })
              }             
              setTables(modifiedTables);
              return modifiedTables;
              })
            .done();
        }
        
    })

    const  [text1, setText1] = useState("")
    const  [text2, setText2] = useState("")
    const  [text3, setText3] = useState("Table number")
    
    async function setTextFields(){
      var tableNr = await AsyncStorage.getItem('tableNumber');
      if(tableNr != null){
          setText1("A table number for this device was already set!");
          setText2("To change, insert new value.");
          setText3(tableNr.toString());
      }
      else{
          setText1("A table number for this device is not set yet!");
          setText2("Please, insert its value to continue.");
      }
    };
    
    useEffect(() => {
      setTextFields();
    }, [])
    
    const checkTableNumber = async (number) => {
      if (number != null) {
        await AsyncStorage.setItem('tableNumber', number); 
        console.log(await AsyncStorage.getItem('tableNumber'));
        setText1("A table number for this device was already set!");
        setText2("To change, insert new value.");
      }
    }

    return(
      <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }}>
          <View style={styles.centeredView}>
            <View style={{flex: 1, alignContent: 'center', alignItems: 'center'}}>
              <Text style={{...styles.textStyle, color: "#181819"}}>{text1}</Text>
              <Text style = {{marginTop: 20, fontSize: 20, }}>{text2}</Text>
            </View>
            <View style={{flex: 5, marginVertical: 10,}}>
              <SearchableDropdown
                keyboardType={'numeric'} 
                placeholderTextColor = {"#181819"}
                placeholder={text3} 
                style={{marginTop: 0,}}
                items = {tables}
                containerStyle={{ 
                  marginBottom: 10,
                  //height: '100%', 
                  justifyContent: "center",
                  width: 160,
                  alignSelf: "center",
                  borderRadius: 10,
                  marginTop: 30,
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
                        color: "#181819",
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
                  navigation.navigate('DisplayProducts')
                  Alert.alert(
                    "Success!",
                    "A table number is set correctly.",
                    [
                      { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                  );
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
    )
}

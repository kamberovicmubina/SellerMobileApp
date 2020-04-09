import { StyleSheet, Dimensions } from 'react-native';
import { getFonts } from '../functions/async';

getFonts();

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white', 
        alignItems: 'center',
        justifyContent: 'center',
      },
      btnContainer: {
          flex: 1, 
          width: '100%',
          flexDirection: 'row', 
          alignContent: 'space-between',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        shoppingCart: { 
            borderColor: "white", 
            flexDirection: 'row',
        },
        shopping: {
            alignSelf: 'center',
            opacity: 0.5,
        },
        numberInput: {
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: '#696969',
          width: 60,
          height: 45,
          textAlign: 'center',
          opacity: 0.8,
          borderRadius: 10,
          paddingLeft: 7,
        },    
        finishBtn: {
            width: 100, 
            height: 50, 
            backgroundColor: 'grey',
            marginRight: 10, 
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
        },
      image: {
        flex: 2,
        width: Dimensions.get('window').width, 
        
      },
      textContainer: {
        flex: 1,
        backgroundColor: 'white',
        marginBottom: 20,
        borderColor: '#C0C0C0',
        borderWidth: 1,
        borderRadius: 10,
        overflow: 'hidden',
      },  
      headingText: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        borderBottomWidth: 1, 
        borderBottomColor: '#C0C0C0',
        backgroundColor: 'white',
      },
      text: {
        flex: 3,
        color: "#404040",   
        fontSize: 30, 
        padding: 10,
        textAlign: "left",
        fontFamily: 'courgette-regular',
      },
      price: {
        flex: 1,
        color: '#696969',
        padding: 10,
        textAlign: 'right',
        fontSize: 20,
        marginRight: 10,
        alignSelf: 'flex-end',
        fontFamily: 'courgette-regular',
      },
      smallerText: { 
        flex: 1,
        color: "#696969",   
        fontSize: 18, 
        padding: 10,
        textAlign: "left",
        fontFamily: 'courgette-regular',
      },
});
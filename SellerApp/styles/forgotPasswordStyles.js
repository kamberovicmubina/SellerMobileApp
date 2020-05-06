import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      alignContent: 'center',
    },
    heading: {
        fontSize: 30,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 50,
        marginTop: 20,
        color: 'white'
    }, 
    textStyle:{
        fontSize: 15,
        textAlign: 'center',
        paddingLeft: 50,
        paddingRight: 50,
        marginBottom: 30,
        color: 'white'
    },
    userMail: {
        //marginLeft:13,
        justifyContent:'center',
        flexDirection:'row',
        height: 40,
      }, 
      input: {
        //marginLeft: 20,
        //marginRight: 20,
        backgroundColor:'#fff',
        borderRadius:5,
        //marginBottom:30,
        borderWidth:1.5,
        borderColor: 'darkblue',
        //width:300,
        width: '80%',
      },
      loginScreenButton: {
        //marginLeft:63,
        justifyContent: 'center',
        flexDirection:'row',
        marginTop:10,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'#05132e',
        borderRadius:10,
        borderWidth: 1,
//        width:300,
       // width: '80%',
       marginHorizontal: 30,
        marginBottom: 30
      },
      loginText:{
        color:'#fff',
        fontWeight:'bold',
        fontSize:15,
        textAlign:'center',
        paddingLeft : 10,
        paddingRight : 10
      },
      
})
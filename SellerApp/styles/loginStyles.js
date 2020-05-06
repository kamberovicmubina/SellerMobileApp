import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  heading: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 50,
    color:'#fff'
  },
  input: {
    marginRight: 20,
    backgroundColor:'#fff',
    borderRadius:5,
    marginBottom:30,
    borderBottomWidth:1.5,
    borderBottomColor: 'darkblue',
    flex: 9,
    padding: 10,
  },
  parent: {
    flex: 1,
    justifyContent: 'center',
  },
  employeeImage: {
    width:100,
    height:100, 
    alignSelf:'center',
    marginBottom:40,
    marginTop: 10,
  },
  userPass: {
    marginLeft:13,
    justifyContent:'center',
    flexDirection:'row',
    height: 70,
    flex: 1,
  }, 
  loginScreenButton: {
    marginRight:20,
    marginLeft:20,
    marginTop:10,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'#05132e',
    borderRadius:10,
    borderWidth: 1,
    marginBottom: 10,
  },
  loginText:{
    color:'#fff',
    fontWeight:'bold',
    fontSize:15,
    textAlign:'center',
    paddingLeft : 10,
    paddingRight : 10
  },
  forgotPasswordText:{
    color:'#fff',
    fontWeight:'bold',
  },
  forgotPasswordButton:{
    marginRight: 20,
    marginBottom: 15,
    justifyContent: 'flex-end',
    flexDirection:'row',
  }
})


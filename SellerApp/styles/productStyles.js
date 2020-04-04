import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
      },
      card: {
        height: 60,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderWidth: 0.2,
        borderColor: '#d9d9d9',
        borderRadius: 20,
        backgroundColor:'white'
      },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        ...Platform.select({
          ios: {
            height: 350,
          },
        }),
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "rgba(0,0,55,50)",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      openButton: {
        backgroundColor: "#F194FF",
        justifyContent: "center",
        height: 40,
        width: 40,  
        borderRadius:400
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center", 
        fontSize: 30
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 20
      },
      modalTitle: {
        color: "white", 
        backgroundColor: 'rgba(0,0,55,50)', 
        fontWeight: "bold", 
        fontSize: 30, 
        marginBottom: 30, 
        padding: 10,
        textAlign: "center", 
        width: 250
      },
      modalImage: { width: Dimensions.get('window').width, 
      height: '55%', 
      resizeMode: 'stretch', 
      marginTop: '20%',
      },
      rightIcon : {
        position: 'absolute',
        left: 20,
        marginTop: 20,
        marginBottom: 30,
      },
      proceedBtn: {
        marginRight:20,
        marginLeft:20,
        marginBottom: 30,
        paddingTop:20,
        paddingBottom:20,
        backgroundColor:'#237804',
        borderRadius:10,
        borderWidth: 1,
        height: 70,
        justifyContent: 'center'
      },
      sumbitText: {
        color:'#fff',
        fontWeight:'bold',
        fontSize:16,
        textAlign:'center',
        paddingLeft : 10,
        paddingRight : 10
      },
      btnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        marginHorizontal: 15, 
      },
      saveBtn: {
        paddingTop:20,
        paddingBottom:20,
        backgroundColor:'#237804',
        borderRadius:10,
        borderWidth: 1,
        height: 70,
        justifyContent: 'center'
      },
      cancelBtn: {
        paddingTop:20,
        paddingBottom:20,
        backgroundColor:'#8c8c8c',
        borderRadius:10,
        borderWidth: 1,
        height: 70,
        justifyContent: 'center',
      },
      deleteBtn: {
        paddingTop:18,
        paddingBottom:18,
        backgroundColor:'#237804',
        borderRadius:10,
        borderWidth: 1,
        height: 60,
        justifyContent: 'center',
        marginBottom: 10,
      },

      showPrice: {
        marginRight:10,
        marginLeft:10,
        marginBottom: 10,
        paddingTop:10,
        backgroundColor:'#237804',
        borderRadius:10,
        borderWidth: 1,
        height: 50,
        justifyContent: 'center'
      },
      shopping: {
        borderColor: "white",
        marginRight: 10, 
        paddingVertical: 8,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 0.2,
        width: "12%",
        marginBottom: 12,
        color: '#237804',
      },
      editIcon: {
        borderColor: "white",
        marginLeft: 10,  
        paddingVertical: 8,
        backgroundColor: '#237804',
        borderRadius: 10,
        borderWidth: 0.2,
        width: "12%",
        marginBottom: 12,
        borderColor: '#237804',
        textAlign: 'center',
        color: "white"
      },
      addIcon: {
        borderColor: "white",
        marginRight: 10, 
        //paddingHorizontal: 10, 
        paddingVertical: 8,
        backgroundColor: '#237804',
        borderRadius: 10,
        borderWidth: 0.2,
        width: "12%",
        marginBottom: 12,
        borderColor: '#237804',
        textAlign: 'center',
        color: "white",
        position: 'absolute',
        right: 0
      },
      tableNum: {
        marginRight: 30, 
        paddingHorizontal: 10, 
        paddingVertical: 10,
        backgroundColor: '#bae7ff',
        borderRadius: 10,
        borderWidth: 0.2,
        borderColor: '#bae7ff'
    },
    
});
import React, { useState } from 'react';
import { View, Text, ImageBackground, Keyboard, TextInput, Alert } from 'react-native';
import { TouchableWithoutFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import styles from '../styles/forgotPasswordStyles.js';
import { AsyncStorage } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function ForgotPassword ({navigation}) {
    const { heading, textStyle, userMail, input, loginScreenButton, loginText, container } = styles;
    const [email, setEmail] = useState("");
    const [safetyCode, setSafetyCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [hidden, setHidden] = useState(true);
    const [hiddenPasswordInput, setHiddenPasswordInput] = useState(true);
    const [pressedSendCodeButton, setPressedSendCodeButton] = useState(false);
    const [editableTextInput ,setEditableTextInput] = useState(true);
    const [pressedSendConfirmCodeButton, setPressedSendConfirmCodeButton] = useState(false);
    const [pressedConfirmNewPasswordButton, setPressedConfirmNewPasswordButton] = useState(false);
    // onPress funkcija na dugme send code
    const sendCode = async () => {
       if(pressedSendCodeButton == false)
       {
        const requestBody = { userInfo: email};
        getSecurityCode(requestBody);
        //setHidden(!hidden); 
       }
      else{
        Alert.alert('Oops!', 'Code already sent!', [
            {
              text: 'OK'
            }])
      }
     
    }

    // onPress funkcija na dugme confirm code
    const confirmCode = async () => {
        if(pressedSendConfirmCodeButton == false)
        {
        const codeRequestBody = { userInfo: email,
                                  resetToken: safetyCode                            
        };
        sendSecurityCode(codeRequestBody);
        //setHiddenPasswordInput(!hiddenPasswordInput);
        }
        else {
            Alert.alert('Oops!', 'Code confirmed, please enter your new password below!', [
                {
                  text: 'OK'
                }])
        }
    }

    // onPress funkcija na dugme confirm password
    const confirmPassword = async () => {
        if(pressedConfirmNewPasswordButton == false)
        {
        const passwordRequestbody = { userInfo: email,
                                      newPassword: newPassword                              
        };
        sendNewPassword(passwordRequestbody);
        }
        else{
            Alert.alert('Oops!', 'New password already confirmed!', [
                {
                  text: 'OK'
                }])
        }
    }

    // Funkcija za dobavljanje security code-a za promjenu sifre
    const getSecurityCode = async (requestBody) => {
        var token = await AsyncStorage.getItem('guestToken');
        console.log(requestBody);
        
        fetch('https://cash-register-server-si.herokuapp.com/api/reset-token',{
            method: "POST",
             headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(requestBody)
        }).then((response) => response.json())
        .then((res) => {
            console.log(res);
          if(res.message == "The username or email you entered doesn't belong to an account. Please check and try again!")
          {
            Alert.alert('Error!', 'Invalid username or email!', [
                {
                  text: 'OK'
                }])
          }
          else if(res.message == "Token is sent!")
          {
              console.log(res.message);
              setPressedSendCodeButton(true);
              setEditableTextInput(false);
           setHidden(!hidden); 
          }
          
        }).catch((error) => console.log(error))
        .done();
    }

    // Funkcija za slanje novodobivenog security codea serveru
    const sendSecurityCode = async (codeRequestBody) => {
        var token = await AsyncStorage.getItem('guestToken');
        console.log(codeRequestBody);
        fetch('https://cash-register-server-si.herokuapp.com/api/verification-info',{
            method: "POST",
             headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(codeRequestBody)
        }).then((response) => response.json())
        .then((res) => {
            console.log(res);
          if(res.message == "Incorrect verification info!")
          {
            Alert.alert('Error!', 'Invalid code!', [
                {
                  text: 'OK'
                }])
          }
          else if(res.message == "OK")
          {
              console.log(res.message);
            //setHidden(!hidden); 
            setPressedSendConfirmCodeButton(true);
           setHiddenPasswordInput(!hiddenPasswordInput);
          }
          
        }).catch((error) => console.log(error))
        .done();
    }

    // Funkcija za slanje nove šifre na server
    const sendNewPassword = async (newPasswordBody) => {
        console.log(newPasswordBody);
        var token = await AsyncStorage.getItem('guestToken');
        fetch('https://cash-register-server-si.herokuapp.com/api/password',{
            method: "PUT",
             headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(newPasswordBody)
        }).then((response) => response.json())
        .then((res) => {
            console.log(res);
          if(res.message == "Incorrect verification info!")
          {
            Alert.alert('Error!', 'Invalid code!', [
                {
                  text: 'OK'
                }])
          }
          else if(res.message == "Password successfully changed!")
          {
            Alert.alert('Success!', 'Password successfully changed!', [
                {
                  text: 'OK'
                }])
                setPressedConfirmNewPasswordButton(true);
          }
          
        }).catch((error) => console.log(error))
        .done();
    }

    return(
        <ImageBackground source={require('../images/background2.png')}
      style={container}>
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }}>
            <KeyboardAwareScrollView>
        <View>
            <Text style={heading}>Trouble logging in?</Text>
        </View>
        <View>
            <Text style={textStyle}>Enter your email or username and we'll send you a password reset code to get back into your account.</Text>
        </View>
        <View style={userMail}>
            <TextInput style={input} editable={editableTextInput} placeholder="E-mail or username" onChangeText={text => setEmail(text)}></TextInput>
        </View>
        <View style={loginScreenButton}>
          <TouchableOpacity
                      //style={loginScreenButton}
                      underlayColor='#fff'
                      onPress={sendCode}>
                      <Text style={loginText} >Send code!</Text>
          </TouchableOpacity>
        </View>
        
        <View style={userMail}>
            { !hidden ? (<TextInput style={input} placeholder="Enter code" onChangeText={text => setSafetyCode(text)}></TextInput>) : null}
        </View>
        <View>
            { !hidden ? (<TouchableOpacity
                    style={loginScreenButton}
                    underlayColor='#fff'
                    onPress={confirmCode}>
                    <Text style={loginText} >Confirm code!</Text>
        </TouchableOpacity>) : null}
        </View>
        <View style={userMail}>
            { !hiddenPasswordInput ? <TextInput style={input} placeholder="Enter new password" onChangeText={text => setNewPassword(text)}></TextInput> : null }
        </View>
        <View>
            { !hiddenPasswordInput ? (<TouchableOpacity
                    style={loginScreenButton}
                    underlayColor='#fff'
                    onPress={confirmPassword}>
                    <Text style={loginText} >Confirm new password!</Text>
        </TouchableOpacity>) : null}
        </View>
        </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
        </ImageBackground>
    )
}

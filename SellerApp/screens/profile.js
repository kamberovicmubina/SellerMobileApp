import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Button, Alert, Image, ImageBackground, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import styles from '../styles/loginStyles.js';
import { AsyncStorage } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function Profile({ navigation }) {
    const { heading, input, parent, employeeImage, userPass, loginScreenButton, loginText} = styles;
    
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const updateNewPassword = async (profileData) =>{
        var token = await AsyncStorage.getItem('token');
        fetch('https://cash-register-server-si.herokuapp.com/api/password',{
            method: "PUT",
             headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ 
                userInfo: profileData.username,
                newPassword: newPassword                              
            })
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
              setNewPassword("");
              setOldPassword("");
              setRepeatPassword("");
            Alert.alert('Success!', 'Password successfully changed!', [
                {
                  text: 'OK'
                }])
                if(profileData.otp === true){
                    profileData.otp = false;
                }
                
          }
          
        }).catch((error) => console.log(error))
        .done();

        
    };
    
    const changePassword = async () =>{
        var correctPassword = await AsyncStorage.getItem('password');
        if(newPassword.length < 4){
            Alert.alert('Password too short', 'Password must contain at least 4 chars!', [{
                text: 'Okay'
            }])
        }
        else{
            if(oldPassword === correctPassword){
                if(newPassword === repeatPassword){
                    //uraditi poziv serveru
                    var TOKEN = await AsyncStorage.getItem('token');
                    fetch("https://cash-register-server-si.herokuapp.com/api/profile", {
                        method: "GET",
                        headers: {
                            'Authorization': 'Bearer ' + TOKEN
                        }
                        }).then((response) => response.json()).then((response) => { 
                            let profileData = response;
                            console.log(profileData);
                            updateNewPassword(profileData);
                    
                        });
                }
                else{
                    Alert.alert('Error', 'Incorrect password!', [{
                        text: 'Okay'
                    }])
                }
            }
            else{
                Alert.alert('Error', 'Incorrect old password!', [{
                    text: 'Okay'
                }])
            }
        }     
    }


    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }}>
            <ImageBackground source={require('../images/background2.png')} style={parent}>
                <KeyboardAwareScrollView>
                    <Image source={require('../images/employee.png')} style={employeeImage} />
                    <Text style={heading}>Password change</Text>
                    <View style={userPass}>
                        <FontAwesome name='lock' size={30} color='#fff' style={{flex: 1,}}></FontAwesome>
                        <TextInput style={input} secureTextEntry={true} placeholder="Old password" onChangeText={text => setOldPassword(text)} />
                    </View>
                    <View style={userPass}>
                        <FontAwesome name='lock' size={30} color='#fff' style={{flex: 1,}}></FontAwesome>
                        <TextInput style={input} secureTextEntry={true} placeholder="New password" onChangeText={text => setNewPassword(text)} />
                    </View>
                    <View style={userPass}>
                        <FontAwesome name='lock' size={30} color='#fff' style={{flex: 1,}}></FontAwesome>
                        <TextInput style={input} secureTextEntry={true} placeholder="Repeat new password" onChangeText={text => setRepeatPassword(text)} />
                    </View>
                    <TouchableOpacity
                        style={loginScreenButton}
                        underlayColor='#fff'>
                        <Text style={loginText} onPress={changePassword}>Submit</Text>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
            </ImageBackground>
        </TouchableWithoutFeedback>
    )
}
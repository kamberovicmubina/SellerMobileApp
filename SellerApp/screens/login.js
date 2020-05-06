import React, { useState } from 'react';
import { View, TextInput, Text, Button, Alert, Image, ImageBackground, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import styles from '../styles/loginStyles.js';
import { AsyncStorage } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { checkIfAlreadyLoggedIn } from '../functions/storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { useNotificationsContext } from '../contexts/notificationsContext';
import { StompEventTypes, withStomp  } from "react-stompjs";

const Login = ({ navigation, stompContext }) => {
    checkIfAlreadyLoggedIn(navigation); // ako je već ulogovan, nema potrebe za prikazom ovog ekrana

    const { heading, input, parent, employeeImage, userPass, loginScreenButton, loginText, forgotPasswordText, forgotPasswordButton } = styles;
    const { subscribeToServer } = useNotificationsContext();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const ACCESS_TOKEN = 'access_token';

    const setItemStorage = async (key, value) => {
        try {
            //AsyncStorage.clear();
            await AsyncStorage.setItem(key, value);
            console.log(value);
        }
        catch (err) {
            console.log("greska u store");
        }
    }

    const registerForPushNotifications = async () => {
        if (Constants.isDevice) {            
            const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.log('Error: cannot get push token for Push Notification!');
                return;
            }

            let expoPushToken = await Notifications.getExpoPushTokenAsync();
            setItemStorage('expoPushToken', expoPushToken);
        }
        else {
            console.log('Error: You must use physical device for Push Notifications!');
        }

        if (Platform.OS === 'android') {
            Notifications.createChannelAndroidAsync('default', {
                name: 'default',
                sound: true,
                priority: 'max',
                vibrate: [0, 250, 250, 250],
            });
        }
    };

    const checkLogin = async () => {
        // const location = window.location.hostname;
        const settings = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                username: username,
                password: password,
            })
        };
        try {
            const fetchResponse = await fetch('https://cash-register-server-si.herokuapp.com/api/login', settings);
            const data = await fetchResponse.json();

            if (fetchResponse.ok) {
                setItemStorage('token', data.token);
                await AsyncStorage.removeItem('guestToken'); // brisemo guest token sada

                registerForPushNotifications();
                subscribeToServer(stompContext, StompEventTypes);
                var TOKEN = await AsyncStorage.getItem('token');
                    fetch("https://cash-register-server-si.herokuapp.com/api/profile", {
                        method: "GET",
                        headers: {
                            'Authorization': 'Bearer ' + TOKEN
                        }
                        }).then((response) => response.json()).then((response) => { 
                            let profileData = response;
                            if(profileData.otp === true){
                                Alert.alert('One time password', 'You just logged in with one time password, please change it!', [
                                    {text: 'Later'},
                                    {text: 'Go to profile', onPress: () => navigation.navigate('Profile')  }
                                ])
                            }
                        });
                setItemStorage('password', password);
                navigation.navigate('DisplayProducts')
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
    const forgotPassScreen = async () => {
        navigation.navigate('ForgotPassword');
    }
    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }}>
            <ImageBackground source={require('../images/background2.png')} style={parent}>
                <KeyboardAwareScrollView>
                    <Image source={require('../images/employee.png')} style={employeeImage} />
                    <Text style={heading}>Login</Text>
                    <View style={userPass}>
                        <FontAwesome name='user' size={30} color='#fff' style={{flex: 1,}}></FontAwesome>
                        <TextInput style={input} placeholder="Username" onChangeText={text => setUsername(text)} />
                    </View>
                    <View style={userPass}>
                        <FontAwesome name='lock' size={30} color='#fff' style={{flex: 1,}}></FontAwesome>
                        <TextInput style={input} secureTextEntry={true} placeholder="Password" onChangeText={text => setPassword(text)} />
                    </View>
                    <TouchableOpacity
                            style={forgotPasswordButton}
                            onPress={forgotPassScreen}>
                            <Text style={forgotPasswordText}>Forgot password?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={loginScreenButton}
                        onPress={checkLogin}
                        underlayColor='#fff'>
                        <Text style={loginText}>Submit</Text>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
            </ImageBackground>
        </TouchableWithoutFeedback>
    )
}

export default withStomp(Login);

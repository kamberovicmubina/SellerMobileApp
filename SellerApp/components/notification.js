import { useState, useEffect } from 'react';
import { AsyncStorage, Vibration } from 'react-native';
import { Notifications } from 'expo';

export default function Notification() {
    const [localNotifications, setLocalNotifications] = useState([]);
    const [notificationMessage, setNotificationMessage] = useState('');

    useEffect(() => {
        Notifications.addListener(handlePushNotification);
    }, []);

    useEffect(() => {
        notifyTheWaiter();
    }, [localNotifications]);

    useEffect(() => {
        sendPushNotification();
    }, [notificationMessage]);

    /*const handlePushNotification = notification => {
        //ovdje se moze raditi bilo sta sa dobijenom push notifikacijom

        //console.log(notification.data); // podaci koji su proslijedjeni uz notifikaciju

        Vibration.vibrate();
    };*/

   /* const sendPushNotification = async () => {
        if (!notificationMessage.includes("Guest is calling you to the table number")) return;

        const expoPushToken = await AsyncStorage.getItem('expoPushToken');

        const message = {
            to: expoPushToken,
            sound: 'default',
            title: 'WARNING!',
            body: notificationMessage,
            // data: { data: 'nesto' } // slanje podataka uz notifikaciju
            _displayInForeground: true,
        };

        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        setNotificationMessage('');
    }*/

    const notifyTheWaiter = async () => {
        if (typeof localNotifications === 'undefined' || localNotifications == null || localNotifications.length === 0) return;

        localNotifications.map(notification => {
            let message = notification.message;
            setNotificationMessage(message);
        });

        await AsyncStorage.setItem('lastNotificationID', localNotifications[localNotifications.length - 1].id.toString());
    }

  /*  let setTimeoutID = setTimeout(async () => {
        var token = await AsyncStorage.getItem('token');
        var lastNotificationID = await AsyncStorage.getItem('lastNotificationID');

        if (token != 'undefined' && token != null && lastNotificationID != 'undefined' && lastNotificationID != null) {
            fetch('https://cash-register-server-si.herokuapp.com/api/notifications/' + lastNotificationID, {
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).then((res) => res.json()).then(res => {
                if (res != 'undefined' && res != null) setLocalNotifications(res);
            }).done();
        }
        else clearTimeout(setTimeoutID);
    }, 30000);*/

    return (
        null
    );
}
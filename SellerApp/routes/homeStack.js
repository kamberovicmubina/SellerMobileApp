import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import DisplayProducts from '../screens/displayProducts';
import AddNewOrder from '../screens/addNewOrder';
import Header from '../components/header';
import React from 'react';


const screens = {
    DisplayProducts: {
        screen: DisplayProducts,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} title='Products' reload='true' />
            }
        }
    },
    AddNewOrder : {
        screen: AddNewOrder,
        navigationOptions: ({ navigation }) => {
            return {
                title: 'New order',
                headerBackTitle: 'Back',
            }
        }
    },
    /* Ovdje dodati screen za dodatne informacije o proizvodima, ali umjesto headerTitle treba imati prop title koji prima obicni string */
};

const HomeStack = createStackNavigator (screens, {
    defaultNavigationOptions: {
        headerStyle: { backgroundColor: '#05132e',height: 80},
        headerTintColor: '#fff'
   }
});

export default createAppContainer(HomeStack);
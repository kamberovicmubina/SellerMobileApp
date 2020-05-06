import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import DisplayOrders from '../screens/displayOrders';
import Header from '../components/header';
import React from 'react';
import OrderContent from '../screens/orderContent';
import GuestOrderContent from '../screens/guestOrderContent';

const screens = {
    DisplayOrders: {
        screen: DisplayOrders,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} title='Orders' />
            }
        }
    },
    OrderContent: {
        screen: OrderContent,
        navigationOptions: ({ navigation }) => {
            return {
                title: 'Order',
                headerBackTitle: 'Back',
            }
        }
    },
    GuestOrderContent: {
        screen: GuestOrderContent,
        navigationOptions: ({ navigation }) => {
            return {
                title: 'Order',
                headerBackTitle: 'Back',
            }
        }
    },
};

const OrderStack = createStackNavigator (screens, {
    defaultNavigationOptions: {
        headerStyle: { backgroundColor: '#05132e', height: 80, },
        headerTintColor: '#fff',
   }
});

export default createAppContainer(OrderStack);
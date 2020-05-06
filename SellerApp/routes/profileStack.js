import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Profile from '../screens/profile';
import Header from '../components/header';

const screens = {
    Profile: {
        screen: Profile,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} title='Profile' />
            }
        }
    }
};
const ProfileStack = createStackNavigator (screens, {
    defaultNavigationOptions: {
        headerStyle: { backgroundColor: '#05132e', height: 80, },
        headerTintColor: '#fff',
   }
});

export default createAppContainer(ProfileStack);
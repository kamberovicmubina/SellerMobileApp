import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import styles from '../styles/global.js';

export default function HeaderLogin ({ navigation, title }) {

    return (
        <View style={styles.header}>
            <View>
                <Text style={styles.headerText}>{ title }</Text>
            </View>
        </View>
    )

}

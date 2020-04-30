import React, { useState } from 'react';
import { View, Text, Image, ImageBackground,TouchableOpacity, FlatList} from 'react-native';
import styles from '../styles/tablesStyles';
import { useTablesContext } from '../contexts/tablesContext';

export default function DisplayTables({ navigation }) {
    //ovo otkomentarisati kada ruta bude gotova
    //const { tables, getTables, setTables } = useTablesContext();
    const test= [
        {table: 1},
        {table: 2},
        {table: 3},
        {table: 4},
        {table: 5},
        {table: 6},
        {table: 7},
        {table: 8},
        {table: 9},
        {table: 10},
        {table: 11},
        {table: 12},
        {table: 13},
        {table: 14},
        {table: 15},
        {table: 16},
        {table: 17}
    ];
    
    const makeTableMap = (tables, columnNumber) => {
        var tableMap = tables;
        const numberOfFullRows = Math.floor(tables.length / columnNumber);
        let numberOfElementsInLastRow = tables.length - (numberOfFullRows*columnNumber);
        const empty = {
            table: 0,
            empty:true
        };
        while(numberOfElementsInLastRow != columnNumber && numberOfElementsInLastRow != 0) {
            tableMap.push(empty);
            numberOfElementsInLastRow = numberOfElementsInLastRow + 1;
        }
        //u slucaju potrebe za posebnim rasporedom stolova
        /*tables.sort(function(t1, t2) {
            return t1.y - t2.y;
        });
        tables.sort(function(t1, t2) {
            return t1.x - t2.x;
        });
        var rowN = numberOfRows(tables);
        var column = numberOfColumns(tables);
        //var temp = 1;
        var tableMap = [];
        var empty = {
            table: 0,
            x: 0, 
            y:0,
            empty:true
        };
        var borja = 0;
        for(var i=1; i <= rowN; i++) {
            for(var j=1; j <= column; j++) {
                var containTableOnIJ = tables.filter(function(table) {
                    return table.x == i && table.y == j;
                });
                if(containTableOnIJ.length==0) {
                    borja++;
                    tableMap.push(empty);
                }
                else {
                    tableMap.push(containTableOnIJ[0]);
                }
            }
        }*/
        return tableMap;
    }
    const columnNumber = 3;
    const tablesList = makeTableMap(test, columnNumber);
    return (
        <ImageBackground style={styles.imageBackground} source={require('../images/background2.png')}>
            <View style={styles.tablesView}>
            <FlatList 
                data={tablesList}
                renderItem={({item}) => {
                    if(item.empty === true) {
                        return(
                            <View style={styles.invisible}>
                                <Image style={styles.imageTable}/>
                                <Text></Text>
                            </View>
                        );
                    }
                    else {
                        return(  
                            <TouchableOpacity style={styles.tableStyle}>
                                <Image style={styles.imageTable} source={require("../images/circle.png")}/>
                                <Text style={styles.text}>Table {item.table}</Text>
                            </TouchableOpacity> 
                        );  
                    }
                }}
                numColumns={columnNumber}
                keyExtractor={(item) => item.table.toString()}
            />
            </View>
        </ImageBackground>
    )
}
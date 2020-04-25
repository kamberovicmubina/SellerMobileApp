import React, { useState, createContext, useContext } from 'react';
import { AsyncStorage } from 'react-native';

export const ProductsContext = createContext();

export const ProductsContextProvider = (props) => {
    const { children } = props;

    const [products, setProducts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const getProducts = async () => {
        setRefreshing(true);
        var TOKEN = await AsyncStorage.getItem('token');
        fetch("https://cash-register-server-si.herokuapp.com/api/products", {
          method: "GET",
          headers: {
            'Authorization': 'Bearer ' + TOKEN
          }
        })
          .then((response) => response.json())
          .then((products) => {
            setProducts(products);
            setRefreshing(false);
            return products;
          })
          .done();
    }

    const productsData = {
        products, 
        getProducts,
        setProducts,
        refreshing,
    }

    return <ProductsContext.Provider value={productsData}>{ children }</ProductsContext.Provider>;

}

export const { Consumer } = ProductsContext;

export const useProductsContext = () => useContext(ProductsContext);
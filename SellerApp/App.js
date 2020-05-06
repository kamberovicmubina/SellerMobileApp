import React from 'react';
import Navigator from './routes/drawer';
import { ProductsContextProvider } from './contexts/productsContext';
import { OrdersContextProvider } from './contexts/ordersContext';
import { TablesContextProvider } from './contexts/tablesContext';
import { NotificationsContextProvider } from './contexts/notificationsContext';

export default function App() {
  return (    
    <ProductsContextProvider>
      <OrdersContextProvider>
        <TablesContextProvider>
          <NotificationsContextProvider>
            <Navigator />
          </NotificationsContextProvider>
        </TablesContextProvider>
      </OrdersContextProvider>
    </ProductsContextProvider>
    
  );
}

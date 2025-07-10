import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen.jsx';
import ProfileScreen from './screens/ProfileScreen';
import ProviderScreen from './screens/ProviderScreen.jsx';
import ProviderDashboard from './screens/ProviderDashboard.jsx';
import MiaHiladosScreen from './screens/MiaHiladosScreen.jsx';
import PankyHiladosScreen from './screens/PankyHiladosScreen.jsx';
import PankyAdminDashboard from './screens/PankyAdminDashboard.jsx';
import ProductEditScreen from './screens/ProductEditScreen.jsx';
import Header from './components/Header';
import Footer from './components/Footer';
import DebugInfo from './components/DebugInfo';
import { Container } from 'react-bootstrap';
import './App.scss';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <DebugInfo />
        <Header />
        <main className='py-3'>
          <Container>
            <Routes>
              <Route path='/' element={<HomeScreen />} />
              <Route path='/page/:pageNumber' element={<HomeScreen />} />
              <Route path='/login' element={<LoginScreen />} />
              <Route path='/register' element={<RegisterScreen />} />
              <Route path='/profile' element={<ProfileScreen />} />
              <Route path='/proveedor' element={<ProviderScreen />} />
              <Route path='/dashboard' element={<ProviderDashboard />} />
              <Route path='/panky-admin' element={<PankyAdminDashboard />} />
              <Route path='/mia-hilados' element={<MiaHiladosScreen />} />
              <Route path='/panky-hilados' element={<PankyHiladosScreen />} />
              <Route path='/panky/productos/:id/editar' element={<ProductEditScreen />} />
              <Route path='/productos/:id/editar' element={<ProductEditScreen />} />
              {/* 
              <Route path='/shipping' element={<ShippingScreen />} />
              <Route path='/payment' element={<PaymentScreen />} />
              <Route path='/placeorder' element={<PlaceOrderScreen />} />
              <Route path='/order/:id' element={<OrderScreen />} />
              <Route path='/product/:id' element={<ProductScreen />} />
              <Route path='/cart/:id?' element={<CartScreen />} />
              */}
            </Routes>
          </Container>
        </main>
        <Footer />
      </Router>
    </Provider>
  );
}

export default App;

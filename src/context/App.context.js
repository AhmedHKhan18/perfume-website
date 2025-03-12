'use client'
import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase.config'; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDocs, getDoc, collection, addDoc, updateDoc, documentId, deleteDoc, onSnapshot } from 'firebase/firestore'; 
import { uploadMultipleToCloudinary } from '../lib/Cloudinary';

export const AppContext = createContext({
  user: null,
  authError: null,
//   handleSignUp: async () => {},
//   handleLogin: async () => {},
//   handleLogout: async () => {},
  fetchInventory: async () => {},
  SaveProduct: async () => {},
  loading: true,
  inventory: [],
});

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
//   const [usersList, setUsersList] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

//   const fetchInventory = async () => {
//     try {
//       const inventoryCollection = collection(db, 'inventory');
//       const unsubscribe = onSnapshot(inventoryCollection, snapshot => {
//         const inventoryList = snapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//       setInventory(inventoryList);
//     })
//     return unsubscribe;
//   } catch (error) {
//     console.error('Error fetching inventory:', error.message);
//       showToast('error', 'Error', 'Failed to fetch inventory data');
//     }
//   };
  
  const SaveProduct = async (data) => {
    try {
      const imagesUrl = await uploadMultipleToCloudinary(data.images);
      
      const docRef = collection(db, 'products')
      await addDoc(docRef, {
        ...data,
        images: imagesUrl,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error(error);
    }
  };

//   const handleSignUp = async (email, password) => {
//     try {
//       setAuthError(null);
//       await createUserWithEmailAndPassword(auth, email, password);
//       showToast(
//         'info',
//         `Welcome ${user.displayName}`,
//         "We're glad to have you with us."
//       );
//     } catch (err) {
//       setAuthError(err.message);
//       showToast('error', 'Error', err.message);
//     }
//   };

//   const handleLogin = async (email, password) => {
//     console.log('Attempting login...');
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
//       setUser(user);
//       router.push('/');
//       showToast(
//         'info',
//         `Welcome ${user.email}`,
//         "Welcome Back! We're glad to have you with us again."
//       );
//     } catch (error) {
//       console.error('Login error:', error.message);
//       setAuthError(error.message);
//       showToast('error', 'Error', error.message);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       await AsyncStorage.removeItem('userSession');
//       console.log('User logged out successfully.');
//       router.push('/screens/auth/Login');
//       showToast(
//         'success',
//         'Logged Out',
//         "Hope you come back soon!."
//       );
//     } catch (error) {
//       console.error('Error logging out:', error.message);
//       showToast('error', 'Error', error.message);
//     }
//   };
  return (
    <AppContext.Provider value={{ user, authError, loading, inventory, setInventory, SaveProduct }}>
      {children}
    </AppContext.Provider>
  );
};
import React from "react";
import "./App.css";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Home from "./Home";

export default function App() {
  console.log('App component rendering');

  React.useEffect(() => {
    console.log('useEffect running');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'User signed in' : 'User signed out');
    });

    return () => unsubscribe();
  }, []);

  return (
    <main>
      <Home />
    </main>
  );
}
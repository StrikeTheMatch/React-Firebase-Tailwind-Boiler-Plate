import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UploadCloud } from 'lucide-react';
import { auth, ui, storage } from './firebase.ts';
import { onAuthStateChanged, GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#4F46E5"/>
    <path d="M20 10L28 25H12L20 10Z" fill="white"/>
  </svg>
);

const Home = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUiRendered, setIsUiRendered] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthModalOpen && isUiRendered) {
      const uiConfig = {
        signInOptions: [
          GoogleAuthProvider.PROVIDER_ID,
          EmailAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
          signInSuccessWithAuthResult: () => {
            setIsAuthModalOpen(false);
            return false; // Prevent redirect
          },
        },
        signInFlow: 'popup',
      };

      setTimeout(() => {
        try {
          ui.start('#firebaseui-auth-container', uiConfig);
        } catch (error) {
          console.error('Error starting FirebaseUI:', error);
        }
      }, 100);
    }
  }, [isAuthModalOpen, isUiRendered]);

  const handleSignInClick = () => {
    if (isSignedIn) {
      auth.signOut();
    } else {
      setIsAuthModalOpen(true);
      setIsUiRendered(false);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadProgress(0);
    setUploadError(null);
  };

  const handleUpload = () => {
    if (selectedFile && isSignedIn) {
      const storageRef = ref(storage, `uploads/${auth.currentUser.uid}/${selectedFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          setUploadError('An error occurred during upload. Please try again.');
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            // Here you could save the downloadURL to Firestore if you want to keep track of uploaded files
          });
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Logo />
            <h1 className="text-2xl font-bold text-indigo-600">My App</h1>
          </div>
          <Dialog open={isAuthModalOpen} onOpenChange={(open) => {
            setIsAuthModalOpen(open);
            if (open) {
              setTimeout(() => setIsUiRendered(true), 50);
            } else {
              setIsUiRendered(false);
            }
          }}>
            <DialogTrigger asChild>
              <Button 
                onClick={handleSignInClick} 
                variant={isSignedIn ? "outline" : "default"}
                className={`text-sm ${isSignedIn ? 'text-indigo-600 border-indigo-600 hover:bg-indigo-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
              >
                {isSignedIn ? 'Sign Out' : 'Sign In / Sign Up'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-indigo-600">Sign In / Sign Up</DialogTitle>
              </DialogHeader>
              <div id="firebaseui-auth-container"></div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isSignedIn ? (
          <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-indigo-600">Upload a File</h2>
            <div className="flex items-center space-x-4">
              <Input
                type="file"
                onChange={handleFileChange}
                className="flex-grow border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
              <Button 
                onClick={handleUpload} 
                disabled={!selectedFile || uploadProgress > 0}
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <UploadCloud className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </div>
            {selectedFile && (
              <p className="text-sm text-indigo-600">
                Selected file: {selectedFile.name}
              </p>
            )}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${uploadProgress}%`}}></div>
              </div>
            )}
            {uploadProgress === 100 && (
              <p className="text-sm text-green-600">Upload completed successfully!</p>
            )}
            {uploadError && (
              <p className="text-sm text-red-600">{uploadError}</p>
            )}
          </div>
        ) : (
          <div className="text-center bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-indigo-600">Welcome</h2>
            <p className="mt-2 text-indigo-800">Please sign in to upload files.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
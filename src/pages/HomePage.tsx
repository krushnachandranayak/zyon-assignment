// src/pages/HomePage.tsx
import { useEffect } from 'react'; // Import useEffect
import { Button, Space, message } from 'antd'; // Import Button, Space, message from antd
import { GoogleOutlined } from '@ant-design/icons'; // Import Google icon from antd
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth'; // Import Firebase auth methods
import { auth, googleProvider } from '../firebaseConfig'; // Import your Firebase auth instance and provider

function HomePage() {
  const navigate = useNavigate();

  // Function to handle Google Sign-in/Sign-up
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      message.success('Successfully signed in with Google!');
      // User will be redirected by the auth state observer in useEffect
    } catch (error: unknown) {
      console.error("Google Sign-in Error:", error);
      let errorMessage = "Failed to sign in with Google.";
      if (typeof error === "object" && error !== null && "code" in error) {
        errorMessage += ` Error Code: ${(error as { code: string }).code.replace('auth/', '')}.`;
      }
      message.error(errorMessage);
    }
  };

  // Effect to observe authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, redirect to admin portal
        console.log("User logged in:", user.email);
        navigate('/admin');
      } else {
        // User is signed out or no user is signed in
        console.log("No user logged in.");
        // Keep on homepage if already here, or navigate back if came from elsewhere
        if (window.location.pathname !== '/') {
             navigate('/'); // Ensure we are on homepage if logged out
        }
      }
    });

    // Clean up the observer on component unmount
    return () => unsubscribe();
  }, [navigate]); // navigate is a dependency of useEffect

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100 text-blue-800">
      <h1 className="text-5xl font-extrabold mb-8 text-center">Welcome to Zyon Technology Admin Portal</h1>
      <p className="text-lg mb-8 text-center">Please sign in or sign up with Google to access the dashboard.</p>

      <Space size="large">
        <Button
          type="primary"
          size="large"
          icon={<GoogleOutlined />}
          onClick={handleGoogleSignIn}
        >
          Sign In with Google
        </Button>
        {/* For signup, we'll use the same Google method for simplicity as per requirement */}
        <Button
          type="default"
          size="large"
          icon={<GoogleOutlined />}
          onClick={handleGoogleSignIn}
        >
          Sign Up with Google
        </Button>
      </Space>
    </div>
  );
}

export default HomePage;
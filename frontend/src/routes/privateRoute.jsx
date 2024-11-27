import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children, requiredRole }) => {
  // Replace with actual authentication and role logic
  const isAuthenticated = true; // Example: replace with actual authentication state
  const userRole = 'admin'; // Example: replace with the actual user role (e.g., 'admin', 'user')

  const navigate = useNavigate();
  console.log('first');

  useEffect(() => {
    // Check if the user is authenticated and authorized
    if (!isAuthenticated) {
      navigate('/finance'); // Redirect unauthenticated users to home
    } else if (requiredRole && userRole !== requiredRole) {
      navigate('/testprep'); // Redirect users who don't have the correct role/permission
    }
  }, [isAuthenticated, userRole, requiredRole, navigate]);

  // If user is not authenticated or authorized, show loading state
  if (!isAuthenticated || (requiredRole && userRole !== requiredRole)) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        <div>Loading...</div> {/* You can replace this with a spinner or loading animation */}
      </div>
    );
  }

  // If authenticated and authorized, render the child component
  return <>{children}</>;
};

export default PrivateRoute;

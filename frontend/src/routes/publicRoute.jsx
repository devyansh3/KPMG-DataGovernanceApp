import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PublicRoute = ({ component: Component }) => {
  const isLoggedIn = false; // Replace with actual authentication logic
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/admin'); // Redirect authenticated users to private route
    }
  }, [isLoggedIn]);

  return <Component />;
};

export default PublicRoute;

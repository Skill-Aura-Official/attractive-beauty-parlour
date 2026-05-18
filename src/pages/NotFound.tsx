import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="mb-4 font-display text-6xl text-primary">404</h1>
        <p className="mb-6 text-lg text-muted-foreground">Oops! This page doesn't exist.</p>
        <Link to="/" className="text-primary underline hover:text-primary/80 transition-colors">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

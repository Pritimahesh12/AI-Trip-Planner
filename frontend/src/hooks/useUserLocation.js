import { useState, useEffect } from "react";

function useUserLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        setError("Unable to fetch your location. Please allow location access.");
      }
    );
  }, []);

  return { location, error };
}

export default useUserLocation;
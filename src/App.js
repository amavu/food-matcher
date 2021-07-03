import { useState } from "react";
import GoogleMapReact from "google-map-react";
import { Icon } from "@iconify/react";
import markerIcon from "@iconify/icons-mdi/map-marker";

const App = () => {
  const defaultCenter = {
    lat: 59.9350692,
    lng: 10.7989794,
  };
  const [restaurants, setRestaurants] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(defaultCenter);
  const [chosenRestaurant, setChosenRestaurant] = useState();

  const defaultRequest = {
    location: currentPosition,
    radius: "1000",
    type: "restaurant",
  };

  const Marker = ({ text }) => (
    <div>
      <Icon icon={markerIcon} style={{ fontSize: "2rem", color: "red" }} />
      {text}
    </div>
  );

  const handleApiLoaded = (map, maps) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
    const service = new maps.places.PlacesService(map);
    service.textSearch(defaultRequest, handleRestaurantsResults);
  };

  const handleRestaurantsResults = (results) => {
    setRestaurants(results);
  };

  const handleRestaurantClick = (restaurant) => {
    setChosenRestaurant(restaurant);
    console.log(restaurant);
  };

  return (
    <div>
      <h1>Food Matcher</h1>
      <div style={{ height: "1000px", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: `${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`,
            libraries: "places",
          }}
          defaultCenter={defaultCenter}
          center={currentPosition}
          defaultZoom={14}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
        >
          <Marker
            lat={defaultCenter.lat}
            lng={defaultCenter.lng}
            text="My Marker"
          />
          {restaurants.map((restaurant, index) => (
            <Marker
              key={index}
              lat={restaurant.geometry.location.toJSON().lat}
              lng={restaurant.geometry.location.toJSON().lng}
              text={restaurant.name}
            />
          ))}
        </GoogleMapReact>
        <h2>{chosenRestaurant && chosenRestaurant.name}</h2>
        <ul>
          {restaurants.map((restaurant, index) => (
            <li key={index} onClick={() => handleRestaurantClick(restaurant)}>
              {restaurant.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;

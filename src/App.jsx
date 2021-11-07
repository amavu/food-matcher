import { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";

import { Marker } from "./Components/Marker";
import { RestaurantMatcher } from "./Components/RestaurantMatcher";
import { GoogleMapsLoader } from "./Components/GoogleMapsLoader";
import { RestaurantList } from "./Components/RestaurantList/RestaurantList";

const App = () => {
  const defaultCenter = {
    lat: 59.92481,
    lng: 10.70715,
  };
  const [restaurants, setRestaurants] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(defaultCenter);

  const [placesService, setPlacesService] = useState();

  const ViewState = {
    FoodMatcher: "food-matcher",
    FoodList: "food-list",
  };

  const [viewState, setViewState] = useState(ViewState.FoodList);

  useEffect(() => {
    if (placesService) {
      placesService.textSearch(defaultRequest, handleRestaurantsResults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPosition]);

  const defaultRequest = {
    location: currentPosition,
    radius: "1000",
    type: "restaurant",
    query: "mexican OR sushi OR kebab OR indian OR pizza OR burger",
  };

  const handleViewChange = (view) => {
    setViewState(view);
  };

  const handleApiLoaded = (map, maps) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
      const service = new maps.places.PlacesService(map);
      setPlacesService(service);
      service.textSearch(defaultRequest, handleRestaurantsResults);
    }
  };

  const handleRestaurantsResults = (results) => {
    setRestaurants(results);
  };

  const switchView = () => {
    switch (viewState) {
      case ViewState.FoodMatcher:
        return <RestaurantMatcher restaurants={restaurants} />;
      case ViewState.FoodList:
        return (
          <div style={{ height: "700px", display: "flex", width: "100%" }}>
            <GoogleMapReact
              bootstrapURLKeys={{
                key: `${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`,
                libraries: "places",
              }}
              defaultCenter={defaultCenter}
              center={currentPosition}
              defaultZoom={12}
            >
              <Marker
                lat={currentPosition.lat}
                lng={currentPosition.lng}
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
            <RestaurantList restaurants={restaurants} />
          </div>
        );
      default:
        return <div>Choose something</div>;
    }
  };

  return (
    <div>
      <h1>Food Matcher</h1>
      <GoogleMapsLoader
        handleApiLoaded={handleApiLoaded}
        currentPosition={currentPosition}
      />
      <div>
        <button onClick={() => handleViewChange(ViewState.FoodMatcher)}>
          Food Matcher
        </button>
        <button onClick={() => handleViewChange(ViewState.FoodList)}>
          Restaurant List
        </button>
      </div>
      {switchView()}
    </div>
  );
};

export default App;

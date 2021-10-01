import { useState } from "react";
import GoogleMapReact from "google-map-react";
import { Icon } from "@iconify/react";
import markerIcon from "@iconify/icons-mdi/map-marker";
import starIcon from "@iconify/icons-mdi/star-outline";

const App = () => {
  const defaultCenter = {
    lat: 59.9350692,
    lng: 10.7989794,
  };
  const [restaurants, setRestaurants] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(defaultCenter);
  const [chosenRestaurant, setChosenRestaurant] = useState();
  const [tinderedRestaurant, setTinderedRestaurant] = useState();
  const [placesService, setPlacesService] = useState();

  const defaultRequest = {
    location: currentPosition,
    radius: "1000",
    type: "restaurant",
    query: "burger",
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

        const service = new maps.places.PlacesService(map);
        setPlacesService(service);
        service.textSearch(defaultRequest, handleRestaurantsResults);
      });
    }
  };

  const updateRestaurants = () => {
    placesService.textSearch(defaultRequest, handleRestaurantsResults);
  };

  const iFeelLucky = () => {
    const randomNumber = Math.floor(Math.random() * 20);
    const randomRestaurant = restaurants[randomNumber];

    const restaurantObject = {
      name: randomRestaurant.name,
      address: randomRestaurant.formatted_address,
      photoUrl:
        typeof randomRestaurant.photos !== "undefined"
          ? randomRestaurant.photos[0].getUrl({ maxWidth: 200, maxHeight: 200 })
          : "",
      rating: randomRestaurant.rating,
      totalRatings: randomRestaurant.user_ratings_total,
    };

    setTinderedRestaurant(restaurantObject);
    console.log(restaurants[randomNumber]);
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
      <div style={{ height: "700px", display: "flex", width: "100%" }}>
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

        <ul>
          <h2>{chosenRestaurant && chosenRestaurant.name}</h2>
          {restaurants.map((restaurant, index) => (
            <li key={index} onClick={() => handleRestaurantClick(restaurant)}>
              {restaurant.name}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={() => updateRestaurants()}>Test</button>
      <button onClick={() => iFeelLucky()}>Tinder my burger</button>
      <div>
        {tinderedRestaurant ? (
          <div
            style={{
              border: "1px solid black",
              margin: "1rem",
              padding: "1rem",
              width: "20rem",
            }}
          >
            <img src={tinderedRestaurant.photoUrl} />
            <h1>{tinderedRestaurant.name}</h1>
            <p>{tinderedRestaurant.address}</p>
            <p style={{ display: "flex", alignItems: "center" }}>
              <Icon
                icon={starIcon}
                style={{ fontSize: "2rem", color: "black" }}
              />
              {tinderedRestaurant.rating} ({tinderedRestaurant.totalRatings})
            </p>
          </div>
        ) : (
          <span></span>
        )}
      </div>
    </div>
  );
};

export default App;

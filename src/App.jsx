import { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";

import { Marker } from "./Components/Marker";
import { RestaurantMatcher } from "./Components/RestaurantMatcher";
import { GoogleMapsLoader } from "./Components/GoogleMapsLoader";
import { RestaurantList } from "./Components/RestaurantList/RestaurantList";
import { FilterCheckBox } from "./Components/FilterCheckBox";

const App = () => {
  const defaultCenter = {
    lat: 59.92481,
    lng: 10.70715,
  };
  const [restaurants, setRestaurants] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(defaultCenter);
  const [searchList, setSearchList] = useState([]);
  const [placesService, setPlacesService] = useState();

  const ViewState = {
    FoodMatcher: "food-matcher",
    FoodList: "food-list",
  };

  const [viewState, setViewState] = useState(ViewState.FoodList);

  useEffect(() => {
    if (placesService && defaultRequest.query !== "") {
      placesService.textSearch(defaultRequest, handleRestaurantsResults);
    } else {
      setRestaurants([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPosition, searchList]);

  const defaultRequest = {
    location: currentPosition,
    radius: "1000",
    type: "restaurant",
    query: searchList.join(" OR "),
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
      if (defaultRequest.query !== "") {
        service.textSearch(defaultRequest, handleRestaurantsResults);
      }
    }
  };

  const handleRestaurantsResults = (results) => {
    setRestaurants(results);
  };

  const handleAddToSearchList = (searchString) => {
    if (searchList.length < 1) {
      setSearchList([searchString]);
    } else {
      let newSearchList = searchList;
      setSearchList(newSearchList.concat(searchString));
    }
  };

  const handleRemoveFromSearchList = (searchElement) => {
    setSearchList(searchList.filter((item) => item !== searchElement));
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
                text="Im here"
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
        <div>
          <div>
            <FilterCheckBox
              name={"Burger"}
              filterAdd={handleAddToSearchList}
              filterRemove={handleRemoveFromSearchList}
            />

            <FilterCheckBox
              name={"Sushi"}
              filterAdd={handleAddToSearchList}
              filterRemove={handleRemoveFromSearchList}
            />

            <FilterCheckBox
              name={"Pizza"}
              filterAdd={handleAddToSearchList}
              filterRemove={handleRemoveFromSearchList}
            />

            <FilterCheckBox
              name={"Kebab"}
              filterAdd={handleAddToSearchList}
              filterRemove={handleRemoveFromSearchList}
            />
          </div>
        </div>
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

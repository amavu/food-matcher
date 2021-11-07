import { useState } from "react";
export const RestaurantList = ({ restaurants }) => {
  const [chosenRestaurant, setChosenRestaurant] = useState();
  const handleRestaurantClick = (restaurant) => {
    setChosenRestaurant(restaurant);
    console.log(restaurant);
  };

  return (
    <ul>
      <h2>{chosenRestaurant && chosenRestaurant.name}</h2>
      {restaurants.map((restaurant, index) => (
        <li key={index} onClick={() => handleRestaurantClick(restaurant)}>
          {restaurant.name}
        </li>
      ))}
    </ul>
  );
};

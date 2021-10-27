import { useState } from "react";
import { Icon } from "@iconify/react";
import starIcon from "@iconify/icons-mdi/star-outline";

export const RestaurantMatcher = ({ restaurants }) => {
  const [tinderedRestaurant, setTinderedRestaurant] = useState();

  const iFeelLucky = () => {
    const randomNumber = Math.floor(Math.random() * restaurants.length);
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

  return (
    <div>
      <button onClick={() => iFeelLucky()}>Tinder my restaurant</button>
      {tinderedRestaurant ? (
        <div
          style={{
            border: "1px solid black",
            margin: "1rem",
            padding: "1rem",
            width: "20rem",
          }}
        >
          <img
            src={tinderedRestaurant.photoUrl}
            alt={tinderedRestaurant.name}
          />
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
  );
};

import GoogleMapReact from "google-map-react";

export const GoogleMapsLoader = ({ handleApiLoaded, currentPosition }) => {
  const defaultCenter = {
    lat: 59.92481,
    lng: 10.70715,
  };

  return (
    <div>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: `${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`,
          libraries: "places",
        }}
        defaultCenter={defaultCenter}
        center={currentPosition}
        defaultZoom={12}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      ></GoogleMapReact>
    </div>
  );
};

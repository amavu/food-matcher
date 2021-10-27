import { Icon } from "@iconify/react";
import markerIcon from "@iconify/icons-mdi/map-marker";

export const Marker = ({ text }) => (
    <div>
      <Icon icon={markerIcon} style={{ fontSize: "2rem", color: "red" }} />
      {text}
    </div>
  );
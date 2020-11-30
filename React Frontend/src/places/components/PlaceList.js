import React, {useContext} from "react";

import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import Button from '../../shared/components/FormElements/Button';
import {AuthContext} from '../../shared/context/auth-context';
import "./PlaceList.css";

const PlaceList = (props) => {

  const auth = useContext(AuthContext);
  
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found. Maybe create one ?</h2>
          {auth.userId === props.userId && <Button to="/places/new">Share Place</Button>}
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map((place) => (
        <PlaceItem
          onDelete={props.onDelete}
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
        />
      ))}
    </ul>
  );
};

export default PlaceList;

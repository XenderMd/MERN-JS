import React from "react";
import { useParams } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";

import "./UpdatePlace.css";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous places in New York",
    imageUrl:
      "https://www.tripsavvy.com/thmb/dbsEKjGUVeS2vQ86qu2NaE14zHg=/3865x2174/smart/filters:no_upscale()/empire-state-building-at-sunset-171080501-59f9d0c6d088c000102668bb.jpg",
    address: "20 W 34th St, New York, NY 10001, United States",
    location: {
      lat: 40.7484405,
      lng: -73.9856644,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "One of the most famous places in New York",
    imageUrl:
      "https://www.tripsavvy.com/thmb/dbsEKjGUVeS2vQ86qu2NaE14zHg=/3865x2174/smart/filters:no_upscale()/empire-state-building-at-sunset-171080501-59f9d0c6d088c000102668bb.jpg",
    address: "20 W 34th St, New York, NY 10001, United States",
    location: {
      lat: 40.7484405,
      lng: -73.9856644,
    },
    creator: "u2",
  },
];

const UpdatePlace = (props) => {
  const placeId = useParams().placeId;

  const identifiedPlace = DUMMY_PLACES.find((place) => {
    return place.id === placeId;
  });

  if (!identifiedPlace) {
    return (
      <div className="center">
        <h2>Could not find place!</h2>
      </div>
    );
  }

  return (
    <form>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please add a valid title."
        onIput={() => {}}
        value={identifiedPlace.title}
        valid={true}
      ></Input>
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH()]}
        errorText="Please add a valid description (min 5 characters)."
        onIput={() => {}}
        value={identifiedPlace.description}
        valid={true}
      ></Input>
      <Button type="submit" disabled={true}>
        UPDATE PLACE
      </Button>
    </form>
  );
};

export default UpdatePlace;

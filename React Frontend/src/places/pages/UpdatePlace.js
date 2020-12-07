import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import {useHttpClient} from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import "./PlaceForm.css";

const UpdatePlace = (props) => {
  
  const auth=useContext(AuthContext);
  const history = useHistory();
  const placeId = useParams().placeId;
  const [loadedPlace, setLoadedPlace]=useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: { value: "", isValid: false },
      description: { value: "", isValid: false },
    },
    false
  );

  useEffect(() => {

    try {
      const fetchPlace = async ()=>{
        const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + `/places/${placeId}`);
        setLoadedPlace(responseData.place);
        setFormData({
          title:{
            value:responseData.place.title,
            isValid:true
          },
          description:{
            value:responseData.place.description,
            isValid:true
          }
        });
      };
      fetchPlace();
      
    } catch (err) {};
    
  }, [setFormData, placeId]);

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          "authorization": 'Bearer ' + auth.token,
        }
      );

      history.push(`/${auth.userId}/places`);
    
    } catch (error) {}

  };

  if (!isLoading&&!loadedPlace) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner/>
      </div>
    );
  };

  
  return (
    <React.Fragment>
    <ErrorModal error={error} onClear={clearError}/>
    <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please add a valid title."
        onInput={inputHandler}
        initialValue={loadedPlace.title}
        initialValid={true}
      ></Input>
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please add a valid description (min 5 characters)."
        onInput={inputHandler}
        initialValue={loadedPlace.description}
        initialValid={true}
      ></Input>
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
    </React.Fragment>
  );
};

export default UpdatePlace;

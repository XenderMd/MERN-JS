import React, {useContext } from "react";
import {useHistory} from 'react-router-dom';

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from "../../shared/hooks/http-hook";

import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import {useForm} from '../../shared/hooks/form-hook';
import "./PlaceForm.css";

const NewPlace = () => {

  const history = useHistory();
  const auth=useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler] = useForm({
    title: { value: "", isValid: false },
    description: { value: "", isValid: false },
    address: { value: "", isValid: false },
    image: {value:null, isValid:false},
  }, false)

  const placeSubmitHandler= async (event) =>{
      
    event.preventDefault();

    try {

      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("image", formState.inputs.image.value);
      
      const responseData = await sendRequest(
        "http://localhost:5000/api/places/",
        "POST",
        formData,
        {authorization: 'Bearer ' + auth.token}
      );

      history.push('/');

    } catch (err) {
       console.log(err);
    }
  }

  const errorHandler = ()=>{
    clearError();
  }

  return (
    <React.Fragment>
    <ErrorModal error={error} onClear={errorHandler}/>
    <form className="place-form" onSubmit={placeSubmitHandler}>
    {isLoading && <LoadingSpinner asOverlay/>}
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title"
        onInput={inputHandler}
      ></Input>
      <ImageUpload center id="image" onInput={inputHandler} errorText="Please provide and image"/>
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)"
        onInput={inputHandler}
      ></Input>
        <Input
        id="address"
        element="input"
        label="Adress"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid address."
        onInput={inputHandler}
      ></Input>
      <Button type="submit" disabled={!formState.isValid}>
        ADD PLACE
      </Button>
    </form>
    </React.Fragment>
  );
};

export default NewPlace;

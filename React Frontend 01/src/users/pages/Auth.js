import React, { useCallback, useReducer } from "react";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";

import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import "./Auth.css";

const Auth = () => {
  const [formState, inputHandler] = useForm(
    {
      email: { value: "", isValid: false },
      password: { value: "", isValid: false },
    },
    false
  );

  const onRegisterHandler = (event) => {
    event.preventDefault();
    console.log(formState);
  };

  return (
    <Card className="authentication">
      <form>
        <h1>Login Required</h1>
        <hr></hr>
        <Input
          id="email"
          element="input"
          type="email"
          label="E-mail"
          validators={[VALIDATOR_EMAIL()]}
          onInput={inputHandler}
          initialValue={""}
          placeholder={"Your email here"}
          errorText="Please enter a valid email"
        ></Input>
        <Input
          id="password"
          element="input"
          type="password"
          label="Password"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(6)]}
          onInput={inputHandler}
          initialValue={""}
          placeholder={"Password"}
          errorText="Please enter a password, at least 6 characters"
        ></Input>
        <Button
          type="submit"
          disabled={!formState.isValid}
          onClick={onRegisterHandler}
        >
          LOGIN
        </Button>
      </form>
    </Card>
  );
};

export default Auth;

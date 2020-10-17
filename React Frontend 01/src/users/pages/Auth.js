import React, { useState,useContext } from "react";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";

import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import {AuthContext} from '../../shared/context/auth-context';
import "./Auth.css";

const Auth = () => {

  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: { value: "", isValid: false },
      password: { value: "", isValid: false },
    },
    false
  );

  const onSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState);
    auth.login();
  };

  const switchModeHandler = () => {

    if(isLoginMode){
      setFormData({
        ...formState.inputs,
        name:{value:"", isValid:false}
      }, false)
    } else {
      setFormData({
        ...formState.inputs,
        name:undefined
      }, formState.inputs.email.isValid&&formState.inputs.password.isValid)
    }

    setIsLoginMode((prevMode) => !prevMode);

  };

  return (
    <Card className="authentication">
      <h1>Login Required</h1>
      <hr></hr>
      <form onSubmit={onSubmitHandler}>
        {!isLoginMode && (
          <Input
            element="input"
            id="name"
            type="text"
            label="Your Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid name"
            onInput={inputHandler}
          />
        )}
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
        >
          {isLoginMode ? "LOGIN" : "SIGNUP"}
        </Button>
      </form>
      <Button inverse onClick={switchModeHandler}>
        SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
      </Button>
    </Card>
  );
};

export default Auth;

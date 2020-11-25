import React, { useEffect, useState } from "react";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import UsersList from "../components/UsersList";

const Users = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    try {
      const sendRequest = async () => {
        setIsLoading(true);

        const response = await fetch("http://localhost:5000/api/users", {
          method: "GET",
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setLoadedUsers(responseData.users);

        setIsLoading(false);
      };

      sendRequest();
    } catch (error) {
      setError(error);
    }
  }, []);

  const errorHandler = () => {
    setError(null);
  };

  return (
    <React.Fragment>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <ErrorModal error={error} onClear={errorHandler} />
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;

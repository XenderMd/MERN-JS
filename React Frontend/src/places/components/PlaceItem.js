import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import {AuthContext} from '../../shared/context/auth-context';
import {useHttpClient} from '../../shared/hooks/http-hook';


import "./PlaceItem.css";

const PlaceItem = (props) => {

  const auth=useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal]=useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const openMapHandler = () => {
    setShowMap(true);
  };
  const closeMapHandler = () => {
    setShowMap(false);
  };

  const showDeleteWarningHandler= ()=>{
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler= ()=>{
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler= async ()=>{
    setShowConfirmModal(false);
    
    try {

      const ResponseData = await sendRequest(`http://localhost:5000/api/places/${props.id}`, "DELETE", null, {"authorization": 'Bearer ' + auth.token});
      props.onDelete(props.creatorId);  

    } catch (err) {
        console.log(err);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-conent"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16}></Map>
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
            <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
          </React.Fragment>
        }
      >
        <p>Do you want to proceed and delete this item?</p>
      </Modal>
      <li className="place-item">
        {isLoading && <LoadingSpinner asOverlay/>}
        <Card className="place-item__content">
          <div className="place-item__image">
            <img src={`http://localhost:5000/${props.image}`} alt={props.title}></img>
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button onClick={openMapHandler} inverse>
              VIEW ON MAP
            </Button>
            {auth.isLoggedIn && auth.userId===props.creatorId && <Button to={`/places/${props.id}`}>EDIT</Button>}
            {auth.isLoggedIn && auth.userId===props.creatorId && <Button danger onClick={showDeleteWarningHandler}>DELETE</Button>}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;

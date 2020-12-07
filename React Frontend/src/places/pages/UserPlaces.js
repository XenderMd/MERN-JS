import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";

import PlaceList from '../components/PlaceList';
import {useHttpClient} from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';


const UserPlaces = (props)=>{

    const userId = useParams().userId;
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedPlaces, setLoadedPlaces]=useState([]);

    const fetchPlaces = async (userId)=>{
        try {

            const ResponseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + `/places/user/${userId}`);
            setLoadedPlaces(ResponseData.userPlaces);
            
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(()=>{

        fetchPlaces(userId);

    },[userId]);


    if(isLoading){
        return(
            <div className="center">
                <LoadingSpinner/>
            </div>
        )
    }

    return(
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            <PlaceList userId = {userId} items={loadedPlaces} onDelete={fetchPlaces}/>
        </React.Fragment>
    )
};


export default UserPlaces;
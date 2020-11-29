import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";

import PlaceList from '../components/PlaceList';
import {useHttpClient} from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';


const DUMMY_PLACES = [
    {
        id:'p1',
        title:'Empire State Building',
        description:'One of the most famous places in New York',
        imageUrl:'https://www.tripsavvy.com/thmb/dbsEKjGUVeS2vQ86qu2NaE14zHg=/3865x2174/smart/filters:no_upscale()/empire-state-building-at-sunset-171080501-59f9d0c6d088c000102668bb.jpg',
        address:'20 W 34th St, New York, NY 10001, United States',
        location:{
            lat:40.7484405,
            lng:-73.9856644
        },
        creator:"u1"

    },
    {
        id:'p2',
        title:'Emp. State Building',
        description:'One of the most famous places in New York',
        imageUrl:'https://www.tripsavvy.com/thmb/dbsEKjGUVeS2vQ86qu2NaE14zHg=/3865x2174/smart/filters:no_upscale()/empire-state-building-at-sunset-171080501-59f9d0c6d088c000102668bb.jpg',
        address:'20 W 34th St, New York, NY 10001, United States',
        location:{
            lat:40.7484405,
            lng:-73.9856644
        },
        creator:"u2"
    }
]

const UserPlaces = (props)=>{

    const userId = useParams().userId;
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedPlaces, setLoadedPlaces]=useState([]);

    useEffect(()=>{

        const fetchPlaces = async ()=>{
            try {

                const ResponseData = await sendRequest(`http://localhost:5000/api/places/user/${userId}`);
                setLoadedPlaces(ResponseData.userPlaces);
                
            } catch (err) {
                console.log(err);
            }
        }

        fetchPlaces();

    },[userId]);

    return(
        <React.Fragment>
             {isLoading&&<LoadingSpinner/>}
            <ErrorModal error={error} onClear={clearError}/>
            {!isLoading&&<PlaceList items={loadedPlaces}/>}
        </React.Fragment>
    )
};


export default UserPlaces;
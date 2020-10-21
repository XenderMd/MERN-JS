const express = require('express');

const router = express.Router();

const DUMMY_PLACES=[{
    id:'p1',
    title:"Empire State Building",
    description:'The Empire State Building is a 102-story Art Deco skyscraper in Midtown Manhattan in New York City. It was designed by Shreve, Lamb & Harmon and built from 1930 to 1931. Its name is derived from "Empire State", the nickname of the state of New York.',
    location: {
        lat:'40.7484405',
        long:'-73.9856644'
    },
    address:'20 W 34th St, New York, NY 10001, United States',
    creator:'u1'
}];

router.get('/:pid',(req, res, next)=>{

    const placeId=req.params.pid;
    const place = DUMMY_PLACES.find((place)=>{return place.id===placeId;});
    res.json(place);
});

router.get('/user/:uid',(req, res, next)=>{

    const userId=req.params.uid;
    const place = DUMMY_PLACES.find((place)=>{return place.creator===userId;});
    res.json(place);
});

module.exports=router;
import React from 'react';

import UsersList from '../components/UsersList';

const Users = ()=>{
    const USERS = [{id:'u1', name:"Sensei", image:"https://geekculture.co/wp-content/uploads/2018/03/karate-kid-sequel-cobra-kai-johnny-featured-886x500.jpg", places:3}];

    return <UsersList items={USERS}/>
};

export default Users;
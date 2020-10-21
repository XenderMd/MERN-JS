import React from 'react';

import UsersList from '../components/UsersList';

const Users = ()=>{
    const USERS = [{id:'u1', name:"Sensei", image:"https://i.pinimg.com/originals/f5/f8/3a/f5f83a9cf722d486b859f623d298b2dc.jpg", places:3}];

    return <UsersList items={USERS}/>
};

export default Users;
import React from 'react';

import "./NewGoal.css"

const NewGoal = ()=>{

    const addGoalHandler = (event) =>{
        event.preventDefault();

        const newGoal={
            id: Math.random().toString(),
            text:"dummy text"
        };

        console.log(newGoal);
    };

    return(
    <form className='new-goal' onSubmit={addGoalHandler}>
        <input type="text"></input>
        <button type="submit">Add Goal</button>
    </form>
    )
};

export default NewGoal;
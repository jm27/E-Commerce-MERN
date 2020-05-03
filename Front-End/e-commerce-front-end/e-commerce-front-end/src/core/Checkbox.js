import React, {useState, UseEffect} from 'react';

const Checkbox = ({categories}) =>{
    const [checked, setChecked] = useState([]);

    const handleToggle = (category)=>()=>{
        const currentCategoryId = checked.indexOf(category) // return first index or -1 
        const newCheckedCategoryId = [... checked]

        // if currently checked was not already in checked state > push
        // else pull/take off
        if(currentCategoryId === -1) {
            newCheckedCategoryId.push(category)
        } else {
            newCheckedCategoryId.splice(currentCategoryId, 1)
        }
        console.log(newCheckedCategoryId)
        setChecked(newCheckedCategoryId)
    }

    return categories.map((c,i)=>(
        <li key={i} className='list-unstyled'>
            <input onChange={handleToggle(c._id)} value={checked.indexOf(c._id===-1)} type='checkbox' className='form-check-input'></input>
            <label className='form-check-label'>{c.name}</label>
        </li>
    ))
}

export default Checkbox;
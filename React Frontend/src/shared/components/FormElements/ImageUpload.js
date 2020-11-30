import React, {useRef} from "react";

import Button from './Button';

import "./ImageUpload.css";

const ImageUpload = (props) => {

const filePickRef=useRef();

const pickImageHandler=()=>{
    filePickRef.current.click();
};

const pickedHandler=(event)=>{
    console.log(event.target);
}


  return (
    <div className="form-control">
      <input
        ref={filePickRef}
        id={props.id}
        style={{ display: "none" }}
        type="file"
        accept=".jpg, .png, .jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className="image-upload__preview">
            <img src="" alt="Preview"/>
        </div>
        <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
      </div>
    </div>
  );
};

export default ImageUpload;


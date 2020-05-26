import React from "react";
import Button from "@material-ui/core/Button";

import Icon from "@material-ui/core/Icon";


export default function MyButton(props) {

  return (
    <div>
      <Button
      type={props.type}
      value={props.value}

        variant="contained"
        color="primary"
      >
        Submit
      </Button>
    </div>
  );
}

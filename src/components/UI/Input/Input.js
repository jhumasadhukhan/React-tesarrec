import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),

      width: 100,
    },
  },
}));

export default function Input(props) {
  const classes = useStyles();

  return (
    
    <TextField className={classes.root}
    size="small"

      type={props.type}
      value={props.value}
      onChange={props.onChange}
      label={props.label}
      name={props.name}
    />
  );
}

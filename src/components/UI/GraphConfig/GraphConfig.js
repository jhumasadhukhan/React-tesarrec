import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import classes from "./GraphConfig.module.css";
import Input from "../Input/Input";
import CloseButton from "../Button/CloseButton";
import GenericButton from '../Button/GenericButton'
// import Paper from '../Paper/Paper'

export default function FormControlLabelPlacement(props) {
  return (
    <div className={classes.RadioButtons}>
      <h3>CONFIG</h3>
      <div className={classes.CloseButton}>
        <CloseButton
          type="button"
          value="Close"
          displayValue="Close"
          onClick={props.onClose}
        />
      </div>

      <FormControl component="fieldset">
        <FormLabel component="legend">Horizontal Align</FormLabel>
        <RadioGroup
          row
          aria-label="position"
          name="position"
          defaultValue="top"
          value={props.LegendHorizontal}
          onChange={props.onChange("LegendHorizontal")}
        >
          <FormControlLabel
            value="left"
            control={<Radio color="primary" />}
            label="left"
            labelPlacement="start"
          />
          <FormControlLabel
            value="center"
            control={<Radio color="primary" />}
            label="center"
            labelPlacement="start"
          />
          <FormControlLabel
            value="right"
            control={<Radio color="primary" />}
            label="right"
            labelPlacement="start"
          />
        </RadioGroup>
        <FormLabel component="legend">Vertical Align</FormLabel>
        <RadioGroup
          row
          aria-label="position"
          name="position"
          defaultValue="top"
          value={props.LegendVertical}
          onChange={props.onChange("LegendVertical")}
        >
          <FormControlLabel
            value="top"
            control={<Radio color="primary" />}
            label="top"
            labelPlacement="start"
          />
          <FormControlLabel
            value="center"
            control={<Radio color="primary" />}
            label="center"
            labelPlacement="start"
          />
          <FormControlLabel
            value="bottom"
            control={<Radio color="primary" />}
            label="bottom"
            labelPlacement="start"
          />
        </RadioGroup>
        <Input
          label="Decimal Precision"
          type="text"
          name="DecimalPrecision"
          value={props.DecimalPrecision}
          onChange={props.onChange("DecimalPrecision")}
        />
        <Input
          label="initialConditions"
          name="initialConditions"
          value={props.initialConditions}
          onChange={props.onChange("initialConditions")}
        />
      </FormControl>

      <GenericButton value="Submit" type="submit" displayValue="SUBMIT"  onClick={props.onSubmit}/>
    </div>
  );
}

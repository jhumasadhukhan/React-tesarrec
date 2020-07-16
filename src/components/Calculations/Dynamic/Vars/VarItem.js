import React from "react";
import MyMathQuill from "../../../UI/Math/MyMathQuill";
import classes from "./VarItem.module.css";
import OutlinedInput from "../../../UI/Input/OutlinedInput";
import { Paper } from "@material-ui/core";
import MinMaxSlider from "../../../UI/SliderContainer/MinMaxSlider/MinMaxSlider";
import CloseButton from "../../../UI/Button/CloseButton";
/**
 *
 *
 * @param {*} props
 */
const VarItem = (props) => {
  return (
    <li className={classes.Container} style={{ listStyleType: "none" }}>
      {props.VarType === "Independent" ? (
        <Paper
          className={classes.Dependent}
          style={{ backgroundColor: "rgb(250, 250, 230)" }}
        >
          <div className={classes.mathQuill}>
            <MyMathQuill
              latex={props.LatexForm}
              onInputChange={props.handleMathQuillInputChange}
            />
          </div>

          <div className={classes.inputs}>
            <div className={classes.input}>
              <OutlinedInput
                type={"text"}
                value={props.Unit}
                onChange={props.handleVariableInputChange}
                label={"Unit"}
                name={"Unit"}
              />
            </div>
            <div className={classes.input}>
              <OutlinedInput
                type={"text"}
                value={props.VarLow}
                onChange={props.handleVariableInputChange}
                label={"Min"}
                name={"VarLow"}
              />
            </div>
            <div className={classes.input}>
              <OutlinedInput
                type={"text"}
                value={props.VarHigh}
                onChange={props.handleVariableInputChange}
                label={"Max"}
                name={"VarHigh"}
              />
            </div>
          </div>
          <div className={classes.RemoveButton}>
            <CloseButton
              disabled={props.disabledRemoveButton}
              type="button"
              value="removeItem"
              displayValue="REMOVEIT"
              onClick={props.removeItem}
            />
          </div>
          {/*<div className={classes.input}>
            <OutlinedInput
              width={105}
              type={"text"}
              value={props.VarDescription}
              onChange={props.handleVariableInputChange}
              label={"Description"}
              name={"VarDescription"}
            />
      </div>*/}
          {props.error ? (
            <div className={classes.ErrorMsg}>
              <p>error</p>
            </div>
          ) : null}
        </Paper>
      ) : null}

      {props.VarType === "Dependent" ? (
        <Paper
          className={classes.Dependent}
          style={{ backgroundColor: "rgb(230, 250, 250)" }}
        >
          <div className={classes.mathQuill}>
            <MyMathQuill
              latex={props.LatexForm}
              onInputChange={props.handleMathQuillInputChange}
            />
          </div>

          <div className={classes.inputs}>
            <div className={classes.input}>
              <OutlinedInput
                type={"text"}
                value={props.Unit}
                onChange={props.handleVariableInputChange}
                label={"Unit"}
                name={"Unit"}
              />
            </div>
            <div className={classes.input}>
              <OutlinedInput
                type={"text"}
                value={props.VarLow}
                onChange={props.handleVariableInputChange}
                label={"Min"}
                name={"VarLow"}
              />
            </div>
            <div className={classes.input}>
              <OutlinedInput
                type={"text"}
                value={props.VarHigh}
                onChange={props.handleVariableInputChange}
                label={"Max"}
                name={"VarHigh"}
              />
            </div>
          </div>
          <div className={classes.RemoveButton}>
            <CloseButton
              disabled={props.disabledRemoveButton}
              type="button"
              value="removeItem"
              displayValue="REMOVEIT"
              onClick={props.removeItem}
            />
          </div>
          {/* <div className={classes.input}>
            <OutlinedInput
              width={105}
              type={"text"}
              value={props.VarDescription}
              onChange={props.handleVariableInputChange}
              label={"Description"}
              name={"VarDescription"}
            />
      </div>*/}
          {props.error ? (
            <div className={classes.ErrorMsg}>
              <p>error</p>
            </div>
          ) : null}
        </Paper>
      ) : null}

      {props.VarType === "Constant" ? (
        <Paper
          className={classes.Constant}
          style={{ backgroundColor: "rgb(250, 230, 250)" }}
        >
          <div className={classes.mathQuill}>
            <MyMathQuill
              latex={props.LatexForm}
              onInputChange={props.handleMathQuillInputChange}
            />
          </div>
          <div className={classes.inputs}>
            <div className={classes.input}>
              <OutlinedInput
                type={"text"}
                value={props.VarCurrent}
                onChange={props.handleVariableInputChange}
                label={"Current"}
                name={"VarCurrent"}
              />
            </div>
          </div>
          <div className={classes.RemoveButton}>
            <CloseButton
              disabled={props.disabledRemoveButton}
              type="button"
              value="removeItem"
              displayValue="REMOVEIT"
              onClick={props.removeItem}
            />
          </div>
          {props.error ? (
            <div className={classes.ErrorMsg}>
              <p>error</p>
            </div>
          ) : null}
          <div className={classes.slider}>
            <MinMaxSlider
              rootWidth={"100%"}
              inputWidth={32}
              value={props.VarCurrent}
              lowestVal={parseFloat(props.VarLow)}
              highestVal={props.VarHigh}
              handleVariableInputChange={props.handleVariableInputChange}
              SliderhandleChange={props.SliderHandleChange(
                "VarCurrent",
                props.id
              )}
            />
          </div>
        </Paper>
      ) : null}
    </li>
  );
};

export default VarItem;

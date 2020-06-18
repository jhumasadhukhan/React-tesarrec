import React, { Component } from "react";
import MyErrorMessage from "../../../components/UI/MyErrorMessage/MyErrorMessage";

import MyMathQuill from "../../../components/UI/Math/MyMathQuill";
import { evaluate } from "mathjs";
import MyButton from "../../../components/UI/Button/GenericButton";
import classes from "./SingleODE.module.css";
import GraphConfig from "../../../components/UI/GraphConfig/GraphConfig";
import SettingButton from "../../../components/UI/Button/SettingButton";
import DiffEquationGrapher from "../../../components/Calculations/Method/DiffEquation/DiffEquationGrapher";

class SingleODE extends Component {
  /**
   * Visual Component that contains the textbox for the equation and calculation outputs
   * plus some equation labels
   *
   */

  //y1=a, y2=b,y3=c
  state = {
    graphConfig: {
      show: false,
      submitted: true,
      LegendHorizontal: "left",
      LegendVertical: "top",
      DecimalPrecision: 2,
    },
    submitted: true,
    SingleDiffChangeableLatex: "e^x",
    SingleDiffChangeableText: "e^x",
    error: false,

    DyByDxLatex: "\\frac{dy}{dx}=",
  };
  //\\frac{-0.09 \\cdot a \\cdot b}{0.103+a}-\\frac{0.84 \\cdot a \\cdot c}{0.425+a}
  //\\frac{7.1 \\cdot a \\cdot b}{0.103+a}-(0.142 \\cdot b)
  //\\frac{0.6 \\cdot a \\cdot c}{0.103+a}-(0.0102 \\cdot c)

  validateExpression = (expr) => {
    try {
      evaluate(expr, { x: 1, y: 1 });
      return true;
    } catch (error) {
      return false;
    }
  };

  handleMathQuillInputChange = (nameLatex, nameText) => (mathField) => {
    this.setState({
      [nameLatex]: mathField.latex(),
      [nameText]: mathField.text(),
      submitted: false,
    });
  };

  handleMathQuillInputSubmit = (event) => {
    event.preventDefault();
    if (this.validateExpression(this.state.SingleDiffChangeableText)) {
      this.setState({ submitted: true, error: false });
    } else {
      this.setState({ submitted: false, error: true });
    }
  };

  resetForm = (event) => {
    this.setState({
      submitted: true,
      SingleDiffChangeableLatex: "e^x",
      SingleDiffChangeableText: "e^x",
    });
  };
  toggleChartShow = () => {
    let graphConfig = { ...this.state.graphConfig };
    graphConfig.show = !this.state.graphConfig.show;

    this.setState({ graphConfig: graphConfig });
  };
  onGraphConfigChange = (name) => (event, value) => {
    let graphConfig = { ...this.state.graphConfig };
    graphConfig[name] = event.target.value;

    this.setState({ graphConfig: graphConfig });
  };

  _handleKeyDown = (e) => {
    if (e.key === "Enter") {
      this.setState({ submitted: true });
    }
  };

  render() {
    return (
      <div className={classes.Container}>
        <div className={classes.Form}>
          <form onSubmit={this.handleMathQuillInputSubmit}>
            <div className={classes.Eqn}>
              <MyMathQuill
                firstBit={this.state.DyByDxLatex}
                latex={this.state.SingleDiffChangeableLatex}
                onInputChange={this.handleMathQuillInputChange(
                  "SingleDiffChangeableLatex",
                  "SingleDiffChangeableText"
                )}
                onKeyDown={this._handleKeyDown}
              />
              {this.state.error ? <MyErrorMessage /> : null}
            </div>

            <div className={classes.ButtonContainer}>
              <div className={classes.ButtonPos}>
                <SettingButton
                  disabled={!this.state.submitted}
                  type="button"
                  value="config"
                  displayValue="CONFIG"
                  onClick={this.toggleChartShow}
                />
              </div>
              <div className={classes.ButtonPos}>
                <MyButton type="submit" value="Submit" displayValue="SUBMIT" />
              </div>
              <div className={classes.ButtonPos}>
                <MyButton
                  type="reset"
                  value="Reset"
                  displayValue="RESET"
                  onClick={this.resetForm}
                />
              </div>
              <div className={classes.ButtonPos}>
                <MyButton
                  type="button"
                  value="Copy"
                  displayValue="COPY"
                  onClick={() => {navigator.clipboard.writeText(this.state.SingleDiffChangeableText)}}
                  />
              </div>
            </div>
          </form>
        </div>
        <div className={classes.Graph}>
          {this.state.submitted ? (
            <DiffEquationGrapher
              h={0.5}
              X0={-12.5}
              Y0={-12.5}
              numberOfCycles={50}
              eqn={this.state.SingleDiffChangeableText}
              LineNames={["Euler", "Midpoint", "Runge Kutta"]}
              LegendHorizontal={this.state.graphConfig.LegendHorizontal}
              LegendVertical={this.state.graphConfig.LegendVertical}
              DecimalPrecision={this.state.graphConfig.DecimalPrecision}
            />
          ) : null}
        </div>

        {this.state.graphConfig.show && this.state.submitted ? (
          <GraphConfig
            LegendHorizontal={this.state.graphConfig.LegendHorizontal}
            LegendVertical={this.state.graphConfig.LegendVertical}
            DecimalPrecision={this.state.graphConfig.DecimalPrecision}
            onClose={this.toggleChartShow}
            onChange={(val) => this.onGraphConfigChange(val)}
          />
        ) : null}
      </div>
    );
  }
}

export default SingleODE;

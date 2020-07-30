import React, { Component } from "react";

import NewDiffEquationSolver from "./NewDiffEquationSolver";
import master from "../SampleEquations/master";
import linear1 from "../SampleEquations/SingleODE/linear1.json";
import linear2 from "../SampleEquations/SingleODE/linear2.json";
import linear3 from "../SampleEquations/SingleODE/linear3.json";
import linear4 from "../SampleEquations/SingleODE/linear4.json";
import linear5 from "../SampleEquations/SingleODE/linear5.json";
import MyHeatMap from "../../../UI/MyHeatMap/MyHeatMap";
import EqnItem from "../../../UI/Eqns/EqnItem";
import classes from "./SolverAnalysis.module.css";
import ScatterChart from "../../../UI/Canvas/ScatterChart.js";
// const writeJsonFile = require("write-json-file");
import LineChart from "../../../UI/Canvas/LineChart.js";
import Model from '../SampleEquations/Model'
import { Paper } from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";

class SolverAnalysisSolver extends Component {
  state = {
    integrators: [
      "Euler",
      "Midpoint",
      "Heun",
      "Ralston",
      "K3",
      "SSP33",
      "SSP43",
      "RK4",
      "RK38",
      "RK6",
    ],
    models: [linear1, linear2, linear3, linear4, linear5],
  };

  getCalcedArr = (inputModel, method) => {
    //returns obj containing config, eqns, solutions
    let formattedModel = master(inputModel);

    let t_0 = performance.now();

    let calcedArr = NewDiffEquationSolver({
      method: method,
      h: formattedModel.h,
      numberOfCycles: formattedModel.numOfCycles - 1,
      eqns: formattedModel.eqns,
      vars: formattedModel.vars, // { K_1=0.27}
      LineNames: formattedModel.lineNames,
      initialConditions: formattedModel.initialConditions, // y1
      t0: formattedModel.t0,
    });

    let t_1 = performance.now();

    let time_difference = t_1 - t_0;

    //let returnedObj=new Model(formattedModel,method,calcedArr,time_difference)

    //console.log(returnedObj.validateExpression())

    // console.log(linear1)

    let newModel=new Model(linear1,method)
    console.log(newModel)
    let returnedObj={}

    // let returnedObj = {
    //   key: uuidv4(),
    //   meta: {
    //     name: inputModel.eqns.join() + "," + method,
    //     description: "Please add a description",
    //   },
    //   config: {
    //     initialConditions: formattedModel.initialConditions,
    //     h: formattedModel.h,
    //      t0
    //     lineNames: formattedModel.lineNames,
    //     numOfCycles: formattedModel.numOfCycles,
    //     method: method,
    //   },
    //   eqns: {
    //     parsedEqns: formattedModel.eqns,
    //     textEqns: inputModel.eqns,
    //     vars: formattedModel.vars,
    //   },
    //   solutions: {
    //     actualSolution: formattedModel.actualSolutionArr,
    //     calcedSolution: calcedArr,
    //     rmse: this.calcRMSE(calcedArr, formattedModel.actualSolutionArr),
    //     timeTaken: time_difference,
    //   },
    // };

    return returnedObj;
  };

  calcRMSE = (calcedResults, actualResults) => {
    let errorArr = [];
    for (let i = 0; i < calcedResults.length; i++) {
      let calced = calcedResults[i][0];
      let actual = actualResults[i][0];
      let error = actual - calced;
      errorArr.push(error);
    }
    var sqrt = Math.sqrt;
    var sqr = function (a) {
      return a * a;
    };
    var add = function (a, b) {
      return a + b;
    };
    var differenceFrom = function (target, a) {
      return target - a;
    };
    var target = 0;
    var differenceFromTarget = differenceFrom.bind(undefined, target);
    var sqrdDiff = errorArr.map(differenceFromTarget).map(sqr);
    var RMSE = sqrt(sqrdDiff.reduce(add, 0) / errorArr.length);

    return RMSE;
  };

  render() {
    let allMethodsLinear = [];
    this.state.models.forEach((model) => {
      this.state.integrators.forEach((method) => {
        allMethodsLinear.push(this.getCalcedArr(model, method));
      });
    });

    //discard greater than 500ns

    //console.log(allMethodsLinear);

    // returns calcedarr, rmse, time taken
    return <p>dfgdg</p>;
  }
}

export default SolverAnalysisSolver;

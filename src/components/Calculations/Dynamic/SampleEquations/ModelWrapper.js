import { v4 as uuidv4 } from "uuid";
import { parse, evaluate, simplify } from "mathjs";
import NewDiffEquationSolver from "../LinearCoupled/NewDiffEquationSolver";
import Model from "./Model";

/**
 * @param inputModel
 */
export default class ModelWrapper extends Model {
  constructor(inputModel, meta) {
    let textEqns = inputModel.eqnsObj.map((eqn) => eqn.TextEqn);
    inputModel.eqns = textEqns;
    super(inputModel, meta);
    
    this.Config = {
      show: inputModel.show,
      submitted: inputModel.submitted,
      LegendHorizontal: inputModel.LegendHorizontal,
      LegendVertical: inputModel.LegendVertical,
      DecimalPrecision: inputModel.DecimalPrecision,
      initialConditions: inputModel.initialConditions,
      lineNames: inputModel.lineNames,
      xAxis: inputModel.xAxis,
      yAxis: inputModel.yAxis,
      method: inputModel.method,
      t0: inputModel.t0,
      h: inputModel.h,
    };

    this.Eqns = inputModel.eqnsObj.map((eqn, i) => ({
      id: eqn.line + i,
      line: eqn.line,
      DByDLatex: "\\frac{d" + eqn.line + "}{dt}=",
      LatexEqn: parse(
        parse(eqn.TextEqn).toString({
          implicit: "hide",
          parenthesis: "auto",
        })
      ).toTex({
        parenthesis: "auto",
        implicit: "hide",
      }),
      TextEqn: eqn.TextEqn,
      ParsedEqn: simplify(parse(eqn.TextEqn)),
      errorMessage: null,
    }));

    // this.Vars = inputModel.vars;
  }

  set calculate(val) {
    super.calculate = val;
  }

  solveDiffEqns = (parsedEqns,Vars) => {
    let t0 = performance.now();

    // let parsedEqns = Eqns.map((eqn) => simplify(parse(eqn.TextEqn)));
    // console.log(Eqns)
    let vars = {};

    Vars.forEach((VarElement) => {
      vars[VarElement.LatexForm] = VarElement.VarCurrent;
    });
    console.log(this)

    let calcedArr = NewDiffEquationSolver({
      method: this.Config.method,
      h: this.Config.h,
      numOfCycles: 30,
      eqns: parsedEqns,
      vars: vars, // { K_1=0.27}
      LineNames: this.Config.lineNames,
      initialConditions: this.Config.initialConditions, // y1
      t0: this.Config.t0,
    });
    let t1 = performance.now();

    return calcedArr;
  };

  validateExpressions() {
    let parsedEqns = this.Eqns.map((eqn) => eqn.ParsedEqn);
    console.log(this.Config);
    console.log(
      this.validateExpressions2(parsedEqns, this.Config.lineNames, this.Vars)
    );
    return this.validateExpressions2(
      parsedEqns,
      this.Config.lineNames,
      this.Vars
    );
    //super.validateExpressions([parsedEqns, this.Config.lineNames, this.Vars]);
  }

  validateExpressions2 = (Eqns) => {
    let scope = {};
    // let parsedEqns = this.Eqns.map((eqn) => eqn.ParsedEqn);
    console.log(this);
    let textEqns = Eqns.map((eqn) => eqn.TextEqn);
    let lineNames = Eqns.map((eqn) => eqn.line);

    lineNames.forEach((lineName) => {
      scope[lineName] = 1;
    });

    scope["t"] = 1;

    this.Vars.forEach((Var) => {
      scope[Var.LatexForm] = 1;
    });

    let invalidIndex = [];
    console.log(textEqns, scope);
    for (let i = 0; i < textEqns.length; i++) {
      try {
        evaluate(textEqns[i], scope);
        console.log("valid");
      } catch (error) {
        invalidIndex.push(i);
        console.log("invalid");
      }
    }
    return invalidIndex;
  };
  returnConstructorObj(){
    Model.prototype.returnConstructorObj.call(this)
  }
  
}


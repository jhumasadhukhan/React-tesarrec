import React, { Component } from "react";
import SingleODE from "./SingleODE/SingleODE";
import LinearCoupled from "./LinearCoupled/LinearCoupled";
import ModelExplorer from "../../components/UI/FileController/ModelExplorer";
import classes from "./ModelBench.module.css";
import MyTabs from "../../components/UI/MyTabs/MyTabs";
import Skeleton from "../../components/UI/Skeleton/Skeleton";
// import MyErrorMessage from "../../components/UI/MyErrorMessage/MyErrorMessage";

import DEFAULTEQUATIONS from "../../components/Calculations/Dynamic/SampleEquations/DEFAULTEQUATIONS";
import DEFAULTVARS from "../../components/Calculations/Dynamic/SampleEquations/DEFAULTVARS";

import SolverAnalysis from "./SolverAnalysis/SolverAnalysis";

class ModelBench extends Component {
  /**
   * Visual Component that contains the textbox for the equation and calculation outputs
   * plus some equation labels
   *
   */
  state = {
    allModelId: {},
    allPublicId: {},

    selectedModelId: "",
    selectedModel: "",

    calculate: false,
    error: false,
    tabChoiceValue: 2,
    loading: false,
  };

  componentDidMount() {
    this.setState({ loading: true });
    this.getPrivateModels();
    this.getPublicModels();
  }

  generalDBRequest = (payload, url, methodType, ifNoError) => {
    fetch(url, {
      method: methodType,
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          ifNoError();
        } else {
          this.setState({ error: true });
        }
      })
      .catch((error) => {
        this.setState({ error: true });
      });
  };

  createNewFile = () => {
    let aNewModel = this.newModel();

    this.setState(
      {
        selectedModel: aNewModel,
      },
      () => {
        this.generalDBRequest(
          this.state.selectedModel,
          "https://tesarrec.firebaseio.com/eqns/" +
            this.props.userId +
            ".json?auth=" +
            this.props.token,
          "post",

          this.setState({ error: false }, () => {
            this.getPrivateModels();
          })
        );
        // const payload = this.state.selectedModel;

        // fetch(
        //   "https://tesarrec.firebaseio.com/eqns/" +
        //     this.props.userId +
        //     ".json?auth=" +
        //     this.props.token,
        //   {
        //     method: "post",
        //     headers: {
        //       Accept: "application/json, text/plain, */*",
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(payload),
        //   }
        // )
        //   .then((response) => response.json())
        //   .then((data) => {
        //     if (!data.error) {
        //       this.setState(
        //         { selectedModelId: data.name, error: false },
        //         () => {
        //           this.getPrivateModels();
        //         }
        //       );
        //     } else {
        //       this.setState({ error: true });
        //     }
        //   })
        //   .catch((error) => {
        //     this.setState({ error: true });
        //   });
      }
    );
  };

  sendToParent = (eqns, vars) => {
    let selectedModel = { ...this.state.selectedModel };
    selectedModel.Eqns = eqns;
    selectedModel.Vars = vars;
    this.setState({ selectedModel: selectedModel });
  };

  saveEquation = () => {
    const payload = this.state.selectedModel;

    if (this.state.selectedModelId !== "") {
      this.generalDBRequest(
        payload,
        "https://tesarrec.firebaseio.com/eqns/" +
          this.props.userId +
          "/" +
          this.state.selectedModelId +
          "/.json?auth=" +
          this.props.token,
        "PATCH",
        this.setState({ error: false }, () => {
          this.getPrivateModels();
        })
      );
      // fetch(
      //   "https://tesarrec.firebaseio.com/eqns/" +
      //     this.props.userId +
      //     "/" +
      //     this.state.selectedModelId +
      //     "/.json?auth=" +
      //     this.props.token,
      //   {
      //     method: "PATCH",
      //     headers: {
      //       Accept: "application/json, text/plain, */*",
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(payload),
      //   }
      // )
      //   .then((response) => response.json())
      //   .then((data) => {
      //     if (!data.error) {
      //       this.setState({ error: false }, () => {
      //         this.getPrivateModels();
      //       });
      //     } else {
      //       this.setState({ error: true });
      //     }
      //   })
      //   .catch((error) => {
      //     this.setState({ error: true });
      //   });
    } else {
      this.setState({ error: true });
    }
  };

  publishEquation = () => {
    const payload = { ...this.state.selectedModel, SavedBy: this.props.userId };

    if (this.state.selectedModelId !== "") {
      this.generalDBRequest(
        payload,
        "https://tesarrec.firebaseio.com/public" +
          ".json?auth=" +
          this.props.token,
        "POST",
        this.setState({ error: false }, () => {
          this.getPublicModels();
        })
      );
      // fetch(
      //   "https://tesarrec.firebaseio.com/public" +
      //     ".json?auth=" +
      //     this.props.token,
      //   {
      //     method: "POST",
      //     headers: {
      //       Accept: "application/json, text/plain, */*",
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(payload),
      //   }
      // )
      //   .then((response) => response.json())
      //   .then((data) => {
      //     if (!data.error) {
      //       this.setState({ error: false }, () => {
      //         this.getPublicModels();
      //       });
      //     } else {
      //       this.setState({ error: true });
      //     }
      //   })
      //   .catch((error) => {
      //     this.setState({ error: true });
      //   });
    } else {
      this.setState({ error: true });
    }
  };

  onSelectModelLink = (modelId) => {
    //sets model id and eqns
    let allModels = { ...this.state.allModelId, ...this.state.allPublicId };

    this.setState({
      calculate: false,
      selectedModel: allModels[modelId],
      selectedModelId: modelId,
      tabChoiceValue:1
    });
  };

  onEditModelName = (newModelName) => {
    const Name = {
      Name: newModelName,
      // userId:this.props.userId
    };
    // https://tesarrec.firebaseio.com/eqns/QXVRwu8vuHRTsLST6wMWOA9jt3b2/-MAeganGABPemhDxtCc_/Name

    if (this.state.selectedModelId !== "") {
      this.generalDBRequest(
        Name,
        "https://tesarrec.firebaseio.com/eqns/" +
          this.props.userId +
          "/" +
          this.state.selectedModelId +
          "/.json?auth=" +
          this.props.token,
        "PATCH",
        this.setState({ selectedModelId: "" }, () => {
          this.getPrivateModels();
          this.getPublicModels();
        })
      );
      // fetch(
      //   "https://tesarrec.firebaseio.com/eqns/" +
      //     this.props.userId +
      //     "/" +
      //     this.state.selectedModelId +
      //     "/.json?auth=" +
      //     this.props.token,
      //   {
      //     method: "PATCH",
      //     headers: {
      //       Accept: "application/json, text/plain, */*",
      //       "Content-Type": "application/json",
      //       type: "patch",
      //       dataType: "json",
      //     },

      //     body: JSON.stringify(Name),
      //   }
      // )
      //   .then((response) => response.json())
      //   .then((data) => {
      //     if (!data.error) {
      //       this.setState({ selectedModelId: "" });
      //       this.getPrivateModels();
      //       this.getPublicModels();
      //     } else {
      //       this.setState({ error: true });
      //     }
      //   })
      //   .catch((error) => {
      //     this.setState({ error: true });
      //   });
    } else {
      this.setState({ error: true });
    }
  };

  onRemoveModel = () => {
    let allModelId = { ...this.state.allModelId };
    delete allModelId[this.state.selectedModelId];
    let selectedModel = { ...this.state.selectedModel };
    selectedModel.Eqns = [];
    selectedModel.Vars = [];

    this.setState({
      selectedModelId: null,
      selectedModel: selectedModel,
      allModelId: allModelId,
    });

    this.generalDBRequest(
      null,
      "https://tesarrec.firebaseio.com/eqns/" +
        this.props.userId +
        "/" +
        this.state.selectedModelId +
        ".json?auth=" +
        this.props.token,
      "delete",
      this.setState({ error: false })
    );

    // fetch(
    //   "https://tesarrec.firebaseio.com/eqns/" +
    //     this.props.userId +
    //     "/" +
    //     this.state.selectedModelId +
    //     ".json?auth=" +
    //     this.props.token,
    //   {
    //     method: "delete",
    //     headers: {
    //       Accept: "application/json, text/plain, */*",
    //       "Content-Type": "application/json",
    //     },
    //   }
    // )
    //   .then((response) => response.json())
    //   .then((data) => {
    //     if (!data.error) {
    //       this.setState({ error: false });
    //     } else {
    //       this.setState({ error: true });
    //     }
    //   })
    //   .catch((error) => {
    //     this.setState({ error: true });
    //   });
  };

  getPublicModels = () => {
    const queryParams = "?auth=" + this.props.token; //+'&orderBy="userId"&equalTo="'+this.props.userId+'"'

    // this.generalDBRequest(
    //   null,
    //   "https://tesarrec.firebaseio.com/public.json" + queryParams,
    //   "get",
    //   this.setState({ allPublicId: data, error: false, loading: false })
    // );
    fetch("https://tesarrec.firebaseio.com/public.json" + queryParams, {
      method: "get",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          this.setState({ allPublicId: data, error: false, loading: false });
        } else {
          this.setState({ error: true });
        }
      })
      .catch((error) => {
        this.setState({ error: true });
      });
  };

  getPrivateModels = () => {
    const queryParams = "?auth=" + this.props.token; //+'&orderBy="userId"&equalTo="'+this.props.userId+'"'
    fetch(
      "https://tesarrec.firebaseio.com/eqns/" +
        this.props.userId +
        ".json" +
        queryParams,
      {
        method: "get",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          this.setState({ allModelId: data, error: false, loading: false });
        } else {
          this.setState({ error: true });
        }
      })
      .catch((error) => {
        this.setState({ error: true });
      });
  };

  copyAllEqnsText = () => {
    var allTextEqns = [];

    for (let i = 0; i < this.state.selectedModel.Eqns.length; i++) {
      let Eqn = {
        ...this.state.selectedModel.Eqns[i],
      };
      allTextEqns.push(Eqn.TextEqn);
    }
    navigator.clipboard.writeText(allTextEqns);
  };
  //        <TemplateController/>
  handleTabChange = (event, val) => {
    this.setState({ tabChoiceValue: val });
  };

  newModel() {
    return {
      Eqns: DEFAULTEQUATIONS,
      Vars: DEFAULTVARS,
      Name: "Untitled",
      Description: "Please add Description",
      ActualSolution: "",
      SolutionTechnique: "RK4",
    };
  }

  render() {
    let modelLinks = null;
    Object.keys(this.state.allModelId + this.state.allPublicId).length !== 0
      ? (modelLinks = (
          <ModelExplorer
            allModelId={this.state.allModelId}
            allPublicId={this.state.allPublicId}
            selectedModelId={this.state.selectedModelId}
            onSelectModelLink={this.onSelectModelLink}
            onRemoveModel={this.onRemoveModel}
            onEditModelName={this.onEditModelName}
            saveEquation={this.saveEquation}
            publishEquation={this.publishEquation}
            copyAllEqnsText={this.copyAllEqnsText}
            createNewFile={this.createNewFile}
          />
        ))
      : (modelLinks = null);

    const nodeRef = React.createRef(null);

    return (
      // can u inject a background-color: ranmdom lookup color if DEVMODE=TRUE

      <div className={classes.ModelBenchContainer}>
        <div ref={nodeRef} className={classes.ModelBenchItemLeft}>
          <div className={classes.ModelBenchItemLeftFileNav}>
            {this.state.loading ? <Skeleton /> : null}
            {modelLinks}
          </div>

          <div className={classes.ModelBenchItemLeftEqnNav}>
            <MyTabs
              value={this.state.tabChoiceValue}
              handleChange={this.handleTabChange}
              labels={["Single ODE", "Coupled ODE", "Solver Analysis"]}
            />
          </div>
        </div>

        <div className={classes.ModelBenchItemCenter}>
          {this.state.tabChoiceValue === 0 ? <SingleODE /> : null}
          {this.state.tabChoiceValue === 1 ? (
            <LinearCoupled
              calculate={this.state.calculate}
              modelId={this.state.selectedModelId}
              Eqns={this.state.selectedModel.Eqns}
              Vars={this.state.selectedModel.Vars}
              sendToParent={this.sendToParent}
            />
          ) : null}
          {this.state.tabChoiceValue === 2 ? <SolverAnalysis /> : null}
        </div>
        {/* {this.state.error ? <MyErrorMessage /> : null} */}
      </div>
    );
  }
}

export default ModelBench;

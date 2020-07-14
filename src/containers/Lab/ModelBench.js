import React, { Component } from "react";
import SingleODE from "./SingleODE/SingleODE";
import LinearCoupled from "./LinearCoupled/LinearCoupled";
import FileController from "../../components/Calculations/Dynamic/FileController/FileGenerator";
import classes from "./ModelBench.module.css";
import MyTabs from "../../components/UI/MyTabs/MyTabs";
import Skeleton from "../../components/UI/Skeleton/Skeleton";
import MyErrorMessage from "../../components/UI/MyErrorMessage/MyErrorMessage";
import { Paper, Tooltip, IconButton } from "@material-ui/core";
import Draggable from "react-draggable";
import RestoreIcon from "@material-ui/icons/Restore";

import DraggableWrapper from "../../components/UI/DraggableWrapper/DraggableWrapper";
import DEFAULTEQNS from "./DefaultStates/DefaultEqns";
import DEFAULTVARS from "./DefaultStates/DefaultVars";
import GridLayout from "react-grid-layout";

class ModelBench extends Component {
  /**
   * Visual Component that contains the textbox for the equation and calculation outputs
   * plus some equation labels
   *
   */
  state = {
    modelId: "",
    allModelId: {},
    Eqns: [],
    Vars: [],
    calculate: false,
    error: false,
    tabChoiceValue: 1,
    loading: false,
 
  };

  componentDidMount() {
    this.setState({ loading: true });
    this.getAllFiles();
  }

  createNewFile = () => {
    this.setState(
      {
        Eqns: DEFAULTEQNS,
        Vars: DEFAULTVARS,
      },
      () => {
        const payload = {
          Eqns: this.state.Eqns,
          Vars: this.state.Vars,
          Name: "Untitled",
          // userId:this.props.userId
        };

        fetch(
          "https://tesarrec.firebaseio.com/eqns/" +
            this.props.userId +
            ".json?auth=" +
            this.props.token,
          {
            method: "post",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            if (!data.error) {
              console.log(data);
              this.setState({ modelId: data.name, error: false }, () => {
                this.getAllFiles();
              });
            } else {
              this.setState({ error: true });
            }
          })
          .catch((error) => {
            this.setState({ error: true });
          });
      }
    );
  };

  sendToParent = (eqns, vars) => {
    this.setState({ Eqns: eqns, Vars: vars });
  };

  saveEquation = () => {
    const payload = {
      Eqns: this.state.Eqns,
      Vars: this.state.Vars,
    };

    if (this.state.modelId !== "") {
      fetch(
        "https://tesarrec.firebaseio.com/eqns/" +
          this.props.userId +
          "/" +
          this.state.modelId +
          "/.json?auth=" +
          this.props.token,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (!data.error) {
            this.setState(
              { Eqns: data.Eqns, Vars: data.Vars, error: false },
              () => {
                this.getAllFiles();
              }
            );
          } else {
            this.setState({ error: true });
          }
        })
        .catch((error) => {
          this.setState({ error: true });
        });
    } else {
      this.setState({ error: true });
    }
  };

  onExpandFileLink = (modelId) => {
    //sets model id and eqns

    this.setState({
      calculate: false,
      modelId: modelId,
      Eqns: this.state.allModelId[modelId].Eqns,
      Vars: this.state.allModelId[modelId].Vars,
    });
  };

  onEditFileLinkName = (newFileName) => {
    // curl -X PUT -d '{ "first": "Jack", "last": "Sparrow" }' \
    // 'https://[PROJECT_ID].firebaseio.com/users/jack/name.json'

    //     curl -X PATCH -d '{"last":"Jones"}' \
    //  'https://[PROJECT_ID].firebaseio.com/users/jack/name/.json'
    const Name = {
      Name: newFileName,
      // userId:this.props.userId
    };
    // https://tesarrec.firebaseio.com/eqns/QXVRwu8vuHRTsLST6wMWOA9jt3b2/-MAeganGABPemhDxtCc_/Name

    if (this.state.modelId !== "") {
      fetch(
        "https://tesarrec.firebaseio.com/eqns/" +
          this.props.userId +
          "/" +
          this.state.modelId +
          "/.json?auth=" +
          this.props.token,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            type: "patch",
            dataType: "json",
          },

          body: JSON.stringify(Name),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (!data.error) {
            // this.setState({ Eqns: data.Eqns, error: false }, () => {
            //   this.getAllFiles();
            // });
            console.log(this.state.modelId)
            this.setState({modelId:""})
            this.getAllFiles();
          } else {
            this.setState({ error: true });
          }
        })
        .catch((error) => {
          this.setState({ error: true });
        });
    } else {
      this.setState({ error: true });
    }
  };

  onRemoveFileLink = () => {
    let allModelId = { ...this.state.allModelId };
    delete allModelId[this.state.modelId];

    this.setState({
      modelId: null,
      Eqns: [],
      allModelId: allModelId,
      Vars: [],
    });

    fetch(
      "https://tesarrec.firebaseio.com/eqns/" +
        this.props.userId +
        "/" +
        this.state.modelId +
        ".json?auth=" +
        this.props.token,
      {
        method: "delete",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          this.setState({ error: false });
        } else {
          this.setState({ error: true });
        }
      })
      .catch((error) => {
        this.setState({ error: true });
      });
  };

  getAllFiles = () => {
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

    for (let i = 0; i < this.state.Eqns.length; i++) {
      let Eqn = {
        ...this.state.Eqns[i],
      };
      allTextEqns.push(Eqn.TextEqn);
    }
    navigator.clipboard.writeText(allTextEqns);
  };
  //        <TemplateController/>
  handleTabChange = (event, val) => {
    this.setState({ tabChoiceValue: val });
  };


  render() {
    let modelLinks = null;
    Object.keys(this.state.allModelId).length !== 0
      ? (modelLinks = (
          <FileController
            allModelId={this.state.allModelId}
            selectedModelId={this.state.modelId}
            onExpandFileLink={this.onExpandFileLink}
            onRemoveFileLink={this.onRemoveFileLink}
            onEditFileLinkName={this.onEditFileLinkName}
            saveEquation={this.saveEquation}
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
                  labels={["Single ODE", "Coupled ODE"]}
                />
              </div>
            </div>

          <div className={classes.ModelBenchItemCenter}>
            {this.state.tabChoiceValue === 0 ? (
              <SingleODE />
            ) : (
              <LinearCoupled
                calculate={this.state.calculate}
                modelId={this.state.modelId}
                Eqns={this.state.Eqns}
                sendToParent={this.sendToParent}
                nodeRef={nodeRef}
                eqnEditorPos={this.state.eqnEditorPos}
                graphPos={this.state.graphPos}
                configPos={this.state.configPos}
                onStop={this.onStop}
                Vars={this.state.Vars}
              />
            )}
          </div>
          {this.state.error ? <MyErrorMessage /> : null}
      </div>
    );
  }
}

export default ModelBench;

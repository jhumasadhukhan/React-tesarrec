import time

import numpy as np
from scipy.integrate import odeint


def ode_integrate(model_obj):

    num_of_cycles = int(model_obj["Config"]["numOfCycles"])

    x_0_arr = []
    constants = {}
    dep_names = []
    indep_latex = ""
    for i in range(len(model_obj["Vars"])):
        var = model_obj["Vars"][i]
        if var["VarType"] == "Independent":
            t = np.linspace(
                var["VarCurrent"],
                num_of_cycles * float(model_obj["Config"]["h"]),
                num_of_cycles,
            )
            indep_latex = var["LatexForm"]
        elif var["VarType"] == "Dependent":
            x_0_arr.append(float(var["VarCurrent"]))
            dep_names.append(var["LatexForm"])

        else:
            constants[var["LatexForm"]] = float(var["VarCurrent"])

    compiled_eqn = []
    for i in range(len(model_obj["Eqns"])):
        compiled_eqn.append(
            compile(
                model_obj["Eqns"][i]["textEqn"]
                .replace("^", "**")
                .replace("e", str(np.exp(1))),
                "<string>",
                "eval",
            )
        )

    def func(x, t):
        x_0 = {}
        for idx, val in enumerate(x):
            x_0[dep_names[idx]] = x[idx]

        returned_arr = []
        for idx in range(len(model_obj["Eqns"])):

            returned_arr.append(
                eval(compiled_eqn[idx], {**constants, **x_0, indep_latex: t})
            )

        return returned_arr

    start = time.process_time()

    x = odeint(func, x_0_arr, t)

    print(type(x),len(x),x.shape)
    print(type(t),len(t),t.shape)


    # np.hstack((x,[t]))
    print(time.process_time() - start)

    # if isinstance(x, np.ndarray):
    return np.hstack((x,t.reshape(len(t),1)))
    # else:
    #     return "didnt work"




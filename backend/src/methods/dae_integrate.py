from gekko import GEKKO
import numpy as np


def dae_integrate(model_obj):

    m = GEKKO()


    num_of_cycles = int(model_obj["Config"]["numOfCycles"])

    dep_names = []
    variables_list = []
    indep_latex = ""

    for i in range(len(model_obj["Vars"])):
        var = model_obj["Vars"][i]
        if var["VarType"] == "Independent":

            m.time = np.linspace(
                var["VarCurrent"],
                num_of_cycles * float(model_obj["Config"]["h"]),
                num_of_cycles+1,
            )
            indep_latex = var["LatexForm"]

            variable = (
                var["LatexForm"]
                + "= "
                + "m.Param(value=m.time"
                # + str(float(var["VarCurrent"]))
                + ")"
            )
        elif var["VarType"] == "Dependent":

            dep_names.append(var["LatexForm"])

            # expr=str(var["LatexForm"])+"="+str(m.Var(value=float(var["VarCurrent"])))
            variable = (
                var["LatexForm"]
                + "= "
                + "m.Var(value="
                + str(float(var["VarCurrent"]))
                + ")"
            )

        else:

            # expr=str(var["LatexForm"])+"="+str(m.Param(value=float(var["VarCurrent"])))
            variable = (
                var["LatexForm"]
                + "= "
                + "m.Param(value="
                + str(float(var["VarCurrent"]))
                + ")"
            )

        variables_list.append(variable)

    # (IMODE=1, 4, and 7) where the problem must have the same number of variables and equations and optimization is not allowed.
    # m.options.NODES = 3
    m.time = np.linspace(0, 100, 101)

    clean_eqn = []
    for i in range(len(model_obj["Eqns"])):
        new_eqn = (
            model_obj["Eqns"][i]["textEqn"]
            .replace("^", "**")
            .replace("e", str(np.exp(1)))
            .replace("/d" + indep_latex, ".dt()")
            .replace("=", "==")
        )
        for i in range(len(dep_names)):
            letter = dep_names[i]
            new_eqn = new_eqn.replace("d" + letter, letter)

        clean_eqn.append(new_eqn)


    m.options.IMODE = 7
    m.options.NODES = 3


    for i in range(len(variables_list)):
        exec(variables_list[i], globals(), locals())

    for i in range(len(clean_eqn)):
        m.Equation(eval(str(clean_eqn[i])))

    m.solve(disp=False)
    # plt.plot(x)

    # m.open_folder()
    solution_arr=[]
    solution_arr.append(m.time.tolist())
    for i in range(len(dep_names)):
        # print(dep_names[i])
        # solution_arr.append(exec(dep_names[i]+".value"))
        # print(dep_names[i]+".value")
        exec("solution_arr.append("+dep_names[i]+".value)")
        
    print(solution_arr)
    # print("######################################")
    # exec("print(S.value, E.value, I.value, R.value)")
    # print("######################################")

    return solution_arr

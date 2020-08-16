// Create a LinerCoupled Container

// Set some configs and equations in it 

// test that the state.Eqna hs exact 4 parts numbered 0 , 1, 2, 3 where each part has
// a DBLatext etc 

import React from "react" ;
import {configure, shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import LinearCoupledNew from './LinearCoupledNew'
import Model from "../../../components/Calculations/Dynamic/SampleEquations/Model";

configure({adapter:new Adapter()})

describe('<LinearCoupledNew/>', ()=>{
    it('should solve on differential eqn and presnet a chart', ()=>{

        let aNewModel = new Model()
        aNewModel.initDefault()

        let mycomp  = <LinearCoupled    modelObj={aNewModel}/>

        const wrapper = shallow(mycomp)

        expect(wrapper.find(<LineChart/>))




    })
})

import { Entypo } from "@expo/vector-icons"
import React from "react"

const AvaliationEmoji = (avaliation: {avaliation: number}) => {
    switch(avaliation.avaliation) {
        case (0): return <Entypo name="emoji-sad" size={39} color="#cc0000" /> 
        case (1): return <Entypo name="emoji-neutral" size={39} color="#ff3300" /> 
        case (2): return <Entypo name="emoji-neutral" size={39} color="#e6b800" /> 
        case (3): return <Entypo name="emoji-happy" size={39} color="#339933" /> 
        default: return <Entypo name="emoji-flirt" size={39} color="#006600" /> 
    }
}

export default AvaliationEmoji
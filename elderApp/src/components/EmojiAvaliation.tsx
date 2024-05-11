import { Entypo } from "@expo/vector-icons"
import React from "react"
import { emojiDarkGreen, emojiGreen, emojiOrange, emojiRed, emojiYellow } from "../assets/styles/colors"

const AvaliationEmoji = (avaliation: {avaliation: number}) => {
    switch(avaliation.avaliation) {
        case (0): return <Entypo name="emoji-sad" size={39} color={emojiRed} /> 
        case (1): return <Entypo name="emoji-neutral" size={39} color={emojiOrange} /> 
        case (2): return <Entypo name="emoji-neutral" size={39} color={emojiYellow} /> 
        case (3): return <Entypo name="emoji-happy" size={39} color={emojiGreen} /> 
        default: return <Entypo name="emoji-flirt" size={39} color={emojiDarkGreen} /> 
    }
}

export default AvaliationEmoji
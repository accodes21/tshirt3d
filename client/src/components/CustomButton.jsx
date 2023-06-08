import React from 'react'
import state from '../store'
import { useSnapshot } from 'valtio'
import { getContrastingColor } from '../config/helpers'

const CustomButton = ({type, title, customStyles, handleClick}) => {

    const snap = useSnapshot(state)
    const generateStyle = (type) => {
        if(type === 'filled'){
            return{
                backgroundColor : snap.color,
                color: getContrastingColor(snap.color)
            }
        }
        else if(type === 'outline'){
            return{
                borderWidth: '1px',
                borderColor: snap.color,
                color: snap.color
            }
        }
    }

  return (
    <button 
    className={`px-2 py-1.5 flex-1 rounded-lg drop-shadow-lg hover:drop-shadow-xl hover:scale-105 hover: duration-200 ${customStyles}`}
    style={generateStyle(type)}
    onClick={handleClick}
    >
        {title}
    </button>
  )
}

export default CustomButton
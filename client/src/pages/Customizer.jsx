import React, {useState, useEffect} from 'react'
import {AnimatePresence, motion} from 'framer-motion';
import { useSnapshot } from 'valtio';
import config from '../config/config'
import state from '../store';
import {download} from '../assets'
import {downloadCanvasToImage, reader} from '../config/helpers'
import { EditorTabs, DecalTypes, FilterTabs, Download } from '../config/constants';
import {fadeAnimation, slideAnimation} from '../config/motion'
import Tab from '../components/Tab'
import CustomButton from '../components/CustomButton'
import ColorPicker from '../components/ColorPicker'
import FilePicker from '../components/FilePicker'
import AIPicker from '../components/AIPicker'


const Customizer = () => {
  
  const snap = useSnapshot(state)

  const [file, setFile] = useState('')
  const [prompt, setPrompt] = useState('')
  const [generating, setGenerating] = useState(false)

  const [activeEditorTab, setActiveEditorTab] = useState()
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false
  })

  //show tab info based on active
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case 'colorpicker':
        return <ColorPicker/>
      case 'filepicker':
        return <FilePicker
          file={file}
          setFile={setFile}
          readFile={readFile}
        />
      case 'aipicker':
        return <AIPicker/>
      default:
        return null;
    }
  }

  const handleDecal = (type, res) => {
    const decalType = DecalTypes[type]

    state[decalType.stateProperty] = res

    if(!activeFilterTab[decalType.filterTab]){
      handleActiveFilterTab(decalType.filterTab)
    }
  }

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
          state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
          state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }

    // after setting state change the activeFilterTAb

    setActiveFilterTab((prevState) => {
      return{
        ...prevState,
        [tabName]: !prevState[tabName]
      }
    })
  }

  const readFile = (type) => {
    reader(file)
      .then((res) => {{
        handleDecal(type, res)
        setActiveEditorTab("")
    }})
  }


  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key='custom'
            className='absolute top-0 left-0 z-10'
            {...slideAnimation('left')}
          >
            <div className='flex items-center min-h-screen'>
              <div className='editortabs-container tabs'>
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={()=>{setActiveEditorTab(tab.name)}}
                  />
                ))}

                {generateTabContent()}
              </div>
            </div>
          </motion.div>

          <motion.div
            className='absolute z-10 top-5 right-5'
            {...fadeAnimation}
          >
            <CustomButton
              type='filled'
              title='Go Back'
              handleClick={()=> state.intro = true}
              customStyles='w-fit px-4 py-2.5 font-bold text-sm'
            />
          </motion.div>

          <motion.div
            className='filtertabs-container tabs'
            {...slideAnimation('up')}
          >
            {FilterTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    isFilterTab
                    isActiveTab={activeFilterTab[tab.name]}
                    handleClick={()=> handleActiveFilterTab(tab.name)}
                  />
                ))}

             {Download.map((tab)=>(
                <Tab
                  tab={tab}
                  key={tab.name}
                  isActiveTab={activeFilterTab[tab.name]}
                  handleClick={() => downloadCanvasToImage()}
                />
             ))} 
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Customizer
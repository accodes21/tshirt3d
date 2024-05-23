import React from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {useSnapshot} from 'valtio'
import {
    headContainerAnimation,
    headContentAnimation,
    headTextAnimation,
    slideAnimation
} from '../config/motion'

import state from '../store'
import CustomButton from '../components/CustomButton'

const Home = () => {
    const snap = useSnapshot(state)
  return (
    <AnimatePresence>
        {snap.intro && (
            <motion.section className='home' {...slideAnimation('left')}>
                <motion.header {...slideAnimation('down')}>
                    <img 
                    src="./threejs.png" 
                    alt="logo"
                    className='w-8 h-8 object-contain' 
                    />
                </motion.header>
                
                <motion.div className='home-content' {...headContainerAnimation}>
                    <motion.div {...headTextAnimation}>
                        <h1 className='head-text'>
                            LET'S <br className='xl:block hidden' /> <span>DO</span> IT
                        </h1>
                    </motion.div>
                    <motion.div
                      {...headContentAnimation}
                      className='flex flex-col gap-5'
                    >
                        <p className='max-w-md font-normal text-gray-600 text-base'>
                            Create your unique and exclusive tshirt with our
                            brand new 3D customization tool. <strong>Unleash your imagination</strong>{" "} and define your style.
                        </p>
                    </motion.div>

                    <CustomButton
                        type='filled'
                        title='Customize'
                        handleClick={()=> state.intro = false}
                        customStyles='w-fit px-4 py-2.5 font-bold text-sm'
                    />
                </motion.div>

                {/* <motion.footer className='w-full text-center drop-shadow-lg mt-8 text-xs' {...slideAnimation('up')}>
                    Copyright &copy; Aarya Chopkar
                </motion.footer> */}
            </motion.section>
        )}
    </AnimatePresence>
  )
}

export default Home
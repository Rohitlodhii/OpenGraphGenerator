"use client"
import BackgroundColorPicker from './BackgroundColorPicker'
import BackgroundPanel from './BackgroundPanel'
import DimensionSelector from './DimensionSelector'


const RightPanel = () => {
  return (
    <div className='flex flex-col gap-2 w-full h-full p-2 '>
        <DimensionSelector/>
       
        <BackgroundPanel/>
    </div>
  )
}

export default RightPanel

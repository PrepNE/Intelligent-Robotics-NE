import { Spin } from 'antd'


const PageLoader = () => {
  return (
    <div className='flex bg-white flex-col items-center justify-center place-items-center h-screen w-screen'>
        <Spin size='large' className='spin'/>
    </div>
  )
}

export default PageLoader
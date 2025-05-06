import React from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import QuikynetLogo from "../image/QuikynetLogo.svg";

function ErrorLayout({
    errorCode = "404",
    errorMessage = "Looks like the page you're searching for doesn’t exist, has been moved, or is temporarily unavailable.",
    heading = ""
}) {
    const navigate = useNavigate()
    return (

        <div className='bg bg-[#121831] h-screen w-screen font-inter'>
            <div>
                <img
                    src={QuikynetLogo}
                    alt="Logo"
                    style={{
                        position: "absolute",
                        top: 40,
                        left: 40,
                        width: "240px",
                        height: "50px",
                        zIndex: 2,
                        cursor: "pointer",
                    }}
                    onClick={() => navigate("/")}
                />
            </div>

            <div className='h-[90%] w-full'>
                <div className='relative flex justify-center items-center h-full'>

                    <h1
                        className='absolute text-[150px] sm:text-[200px] md:text-[300px] lg:text-[350px] z-10'
                        style={{
                            fill: 'rgba(242, 244, 247, 0.09)',
                            strokeWidth: '1px',
                            stroke: '#000',
                            filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))'
                        }}
                    >
                        {errorCode}
                    </h1>
                </div>

                <div className='absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white flex flex-col gap-3 px-4 sm:px-8'>

                    <h2 className='text-[24px] sm:text-[30px] md:text-[40px] lg:text-[50px]'>
                        {heading}
                    </h2>

                    <p className='text-sm sm:text-base md:text-lg'>
                        {errorMessage}
                    </p>

                    <div className="flex justify-center gap-2 mt-4">
                        <button
                            type="button"
                            className="text-white p-2 sm:p-3 flex items-center hover:cursor-pointer"
                            style={{
                                borderRadius: '5.392px',
                                border: '0.674px solid var(--button-color, #066882)',
                                background: 'var(--button, linear-gradient(90deg, #00CBFF 0%, #640D99 100%))',
                                boxShadow: '0px 0.674px 1.348px 0px rgba(16, 24, 40, 0.05)',
                            }}

                            onClick={() => navigate(-1)}
                        >
                            <BsArrowLeft className="mr-2" />
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ErrorLayout

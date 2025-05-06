import * as React from "react";

function Header({ table, setTable }) {
  const handleClick = () => {
    setTable(false)
  }
  const handleClickback = () => {
    setTable(true)
  }
  return (
    <div className="flex flex-col w-full font-semibold max-md:max-w-full">
      <div className="flex flex-col pr-8 w-full max-md:pr-5 max-md:max-w-full">
        <div className="flex flex-col w-full max-md:max-w-full">
          <div className="flex gap-4 items-start w-full max-md:max-w-full">
            <div className="flex flex-col flex-1 shrink justify-center w-full basis-0 min-w-[240px] max-md:max-w-full">
              <div className="flex flex-wrap gap-10 items-center w-full max-w-[screen] max-md:max-w-full justify-between">
                <div className="self-stretch my-auto text-3xl leading-none text-gray-900">
                  Visitors Management
                </div>
                {table ? (<button className='bg-[#035E7B] p-2 rounded-md text-white w-[120px]' onClick={handleClick}>
                  Visit QR Code
                </button>) : (
                  <button className='bg-[#035E7B] p-2 rounded-md text-white w-[120px]' onClick={handleClickback}>
                    Back
                  </button>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
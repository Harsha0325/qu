import React from 'react';
import { CardTable } from './CommunityLogTable';
import CommunityStats from './CommunityStats';
import UserCardTable from './UserCardTable';
import ActivationChart from './ActivationChart';

export function MyAgentsDashboard() {
  return (
    <div className="flex overflow-hidden flex-col items-center mt-8 ml-[250px] w-[calc(100%-250px)] bg-white max-md:px-5 max-md:py-24">
      <div className="w-full max-w-[1125px] max-md:max-w-full  ">
      <CommunityStats/>
        <div className=" mt-8  items-center">
          <ActivationChart />
        </div>
      </div>
      <div className="flex flex-col pb-4 mt-7 w-full bg-white rounded-md shadow-sm max-w-[1129px] max-md:max-w-full">
        <div className="flex flex-col px-6 pt-6 pb-2.5 min-h-[437px] max-md:px-5 max-md:mr-0 max-md:max-w-full">
          <div className="flex flex-col w-full font-semibold max-md:max-w-full">
            <div className="flex flex-wrap gap-4 w-full max-md:max-w-full">
              <div className="flex-1 shrink text-lg leading-loose text-gray-900 min-w-[240px] max-md:max-w-full">
                My Leads
              </div>
            </div>
          </div>
          <div>
            <UserCardTable  />
          </div>
        </div>
      </div>
    </div>
  );
}
// CommunityDashboard.jsx
import React from 'react';
import { CardTable } from './CommunityLogTable';
import CommunityStats from './CommunityStats';
import UserCardTable from './UserCardTable';
import ActivationChart from './ActivationChart';

export function MyAgentsDashboard({userId}) {
  return (
    <div className="flex flex-col min-h-full bg-white p-6 space-y-6">
      <div className="w-full max-w-[1125px] mx-auto">
        <CommunityStats userId={userId}/>
        
        <div className="mt-8">
          <ActivationChart userId={userId} />
        </div>
      </div>
      
      <div className="flex-1 w-full max-w-[1129px] mx-auto bg-white rounded-md shadow-sm">
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Leads</h2>
          </div>
          <div className="overflow-x-auto">
            <UserCardTable userId={userId}/>
          </div>
        </div>
      </div>
    </div>
  );
}
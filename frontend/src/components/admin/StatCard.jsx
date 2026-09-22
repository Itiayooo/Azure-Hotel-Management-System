import React from 'react';

const StatCard = ({ title, value, icon, loading }) => {
    return (
        <div className="bg-white p-5 rounded-[13px] flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
                <span className="text-base font-normal text-[#6B5A3C]">{title}</span>
                <div className="p-2.5 rounded-xl border border-[#6B5A3C]/30 text-[#6B5A3C] shrink-0">
                    {icon}
                </div>
            </div>
            <p className={`font-semibold text-[#6B5A3C] tracking-tight leading-none ${title === 'Total Revenue' ? 'text-3xl' : 'text-4xl'}`}>
                {loading ? '...' : value}
            </p>
        </div>
    );
};

export default StatCard;
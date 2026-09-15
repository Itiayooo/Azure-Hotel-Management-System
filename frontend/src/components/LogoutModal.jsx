import React from 'react';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-200">
                {/* Icon Container */}
                <div className="w-20 h-20 bg-[#F5F2EB] rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="#8C6D46"
                        className="w-8 h-8"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                        />
                    </svg>
                </div>

                {/* Text Content */}
                <h3 className="text-xl font-medium text-[#8C6D46] mb-2">
                    Already Leaving?
                </h3>
                <p className="text-xs text-gray-500 font-light leading-relaxed mb-8 px-2">
                    Thank you for staying with Grand Azure. We hope to see you again soon.
                </p>

                {/* Actions */}
                <div className="space-y-3">
                    <button
                        onClick={onConfirm}
                        className="w-full bg-[#8C6D46] hover:bg-[#785C3A] text-white py-3 rounded-full text-sm font-medium transition-colors shadow-sm"
                    >
                        Log Out
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full text-xs text-[#8C6D46] hover:underline font-medium py-1"
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
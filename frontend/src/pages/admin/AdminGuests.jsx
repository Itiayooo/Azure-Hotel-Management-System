<span
    className={`inline-block px-3 py-1 rounded-full text-[10px] font-medium ${getStatusStyle(
        guest.status
    )}`}
>
    {formatStatusLabel(guest.status)}
</span>
{
    guest.isOverdue && guest.status === 'checked-in' && (
        <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-red-100 text-red-600">
            Overdue
        </span>
    )
}
                                            </td >

    <td className="py-4 px-4">
        <div className="flex items-center justify-center gap-2">
            {nextAction && (
                <button
                    onClick={() =>
                        handleAdvanceStatus(
                            guest._id,
                            nextAction.endpoint
                        )
                    }
                    className="w-[24px] h-[24px] rounded-[4.55px] bg-[#319F43] text-white flex items-center justify-center hover:opacity-90 transition cursor-pointer"
                    title={nextAction.label}
                >
                    <FiCheck className="text-xs" />
                </button>
            )}

            {canCancel && (
                <button
                    onClick={() => handleCancel(guest._id)}
                    className="w-[24px] h-[24px] rounded-[4.55px] bg-[#FF0000] text-white flex items-center justify-center hover:opacity-90 transition cursor-pointer"
                    title="Cancel Booking"
                >
                    <FiX className="text-xs" />
                </button>
            )}

            {(guest.status === 'confirmed' || guest.status === 'checked-in') && (
                <button
                    onClick={() => setChangingRoomFor(guest)}
                    className="w-[24px] h-[24px] rounded-[4.55px] bg-[#8C6D46] text-white flex items-center justify-center hover:opacity-90 transition cursor-pointer"
                    title="Change room"
                >
                    <FiRepeat className="text-xs" />
                </button>
            )}

            {!nextAction && !canCancel && (
                <span className="text-gray-300 text-[10px]">
                    —
                </span>
            )}
        </div>
    </td>
                                        </tr >
                                    );
                                })
                            )}
                        </tbody >
                    </table >
                </div >

    { totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-4 border-t border-gray-50 text-xs text-gray-500">
            <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-30 disabled:hover:bg-transparent"
            >
                <FiChevronLeft className="text-xs" />
            </button>

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-medium ${currentPage === page ? 'bg-[#8C6D46] text-white' : 'hover:bg-gray-100'
                        }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-30 disabled:hover:bg-transparent"
            >
                <FiChevronRight className="text-xs" />
            </button>
        </div>
    )}
            </div >

    { changingRoomFor && (
        <ChangeRoomModal
            booking={changingRoomFor}
            onClose={() => setChangingRoomFor(null)}
            onChanged={(updated) =>
                setGuests((prev) => prev.map((g) => (g._id === updated._id ? { ...g, physicalRoom: updated.physicalRoom } : g)))
            }
        />
    )}
        </div >
    );
};

export default AdminGuests;
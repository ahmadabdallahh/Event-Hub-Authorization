// INFO: Loading Component

const Loading = () => {
    return (
        <>
            <div className="mx-auto my-12 flex w-full max-w-2xl flex-col items-center justify-center rounded-xl border border-[#3d3d3d] bg-[#2d2d2d] p-16 text-center shadow-xl">
                {/* Animated Spinner matching EventHub Amber Theme */}
                <div className="relative mb-4 flex items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#3d3d3d] border-t-[#fbd38d]" />
                </div>

                {/* Loading Text */}
                <p className="text-base font-semibold text-gray-200 animate-pulse">
                    Loading...
                </p>
                <p className="mt-1 text-xs text-gray-400">
                    Fetching data, please wait
                </p>
            </div>
        </>
    )
}

export default Loading

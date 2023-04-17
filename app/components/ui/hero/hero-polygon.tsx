export const HeroPolygon = () => {

    return (
        <>
            {/* Hero */}
            <div className="relative overflow-hidden before:absolute before:top-0 before:left-1/2 before:bg-no-repeat before:bg-top before:bg-cover before:w-full before:h-full before:-z-[1] before:transform before:-translate-x-1/2">
                <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
                    {/* Announcement Banner */}
                    <div className="flex justify-center">
                        <a
                            className="inline-flex items-center gap-x-2 bg-white border border-gray-200 text-sm text-gray-800 p-1 pl-3 rounded-full transition hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600 dark:text-gray-200"
                            href="#"
                        >
                            PRO release - Join to waitlist
                            <span className="py-2 px-3 inline-flex justify-center items-center gap-x-2 rounded-full bg-gray-200 font-semibold text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                                <svg
                                    className="w-2.5 h-2.5"
                                    width={16}
                                    height={16}
                                    viewBox="0 0 16 16"
                                    fill="none"
                                >
                                    <path
                                        d="M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </span>
                        </a>
                    </div>
                    {/* End Announcement Banner */}
                    {/* Title */}
                    <div className="mt-5 max-w-2xl text-center mx-auto">
                        <h1 className="block font-bold text-gray-800 text-4xl md:text-5xl lg:text-6xl dark:text-gray-200">
                            Let's Build
                            <span className="bg-clip-text bg-gradient-to-tl from-blue-600 to-violet-600 text-transparent">
                                Together
                            </span>
                        </h1>
                    </div>
                    {/* End Title */}
                    <div className="mt-5 max-w-3xl text-center mx-auto">
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Preline UI is an open-source set of prebuilt UI components,
                            ready-to-use examples and Figma design system based on the
                            utility-first Tailwind CSS framework.
                        </p>
                    </div>
                    {/* Buttons */}
                    <div className="mt-8 grid gap-3 w-full sm:inline-flex sm:justify-center">
                        <a
                            className="inline-flex justify-center items-center gap-x-3 text-center bg-gradient-to-tl from-blue-600 to-violet-600 hover:from-violet-600 hover:to-blue-600 border border-transparent text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white py-3 px-4 dark:focus:ring-offset-gray-800"
                            href="#"
                        >
                            Get started
                            <svg
                                className="w-3 h-3"
                                width={16}
                                height={16}
                                viewBox="0 0 16 16"
                                fill="none"
                            >
                                <path
                                    d="M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                />
                            </svg>
                        </a>
                        <a
                            className="relative group inline-flex justify-center items-center gap-x-3.5 text-center bg-white border hover:border-gray-300 shadow-sm font-mono text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition p-2 pl-4 dark:bg-slate-900 dark:border-gray-800 dark:hover:border-gray-600 dark:shadow-slate-700/[.7] dark:text-white dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800"
                            href="javascript:;"
                        >
                            $ npm i preline
                            <span className="flex justify-center items-center bg-gray-200 rounded-md w-7 h-7 dark:bg-gray-700 dark:text-gray-400">
                                <svg
                                    className="w-3.5 h-3.5 group-hover:rotate-6 transition"
                                    width={16}
                                    height={16}
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                                    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
                                </svg>
                            </span>
                        </a>
                    </div>
                    {/* End Buttons */}
                    <div className="mt-5 flex justify-center items-center gap-x-1 sm:gap-x-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Package Manager:
                        </span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                            npm
                        </span>
                        <svg
                            className="h-5 w-5 text-gray-300 dark:text-gray-600"
                            width={16}
                            height={16}
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path d="M6 13L10 3" stroke="currentColor" strokeLinecap="round" />
                        </svg>
                        <a
                            className="inline-flex items-center gap-x-1.5 text-sm text-blue-600 decoration-2 hover:underline font-medium"
                            href="#"
                        >
                            Installation Guide
                            <svg
                                className="w-2.5 h-2.5"
                                width={16}
                                height={16}
                                viewBox="0 0 16 16"
                                fill="none"
                            >
                                <path
                                    d="M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
            {/* End Hero */}
        </>

    );
}
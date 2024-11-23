import React from 'react';
import Link from 'next/link';

const LandingPage = () => {
    return (
        <div
            className="h-screen w-full flex flex-col gap-14 relative bg-gradient-to-t from-blue-500 to-purple-700 md:[clip-path:polygon(0_0,_100%_0,_100%_70%,_0_100%)]"
        >
            <div className="header flex justify-center">
                <header className="w-full md:w-[80%] h-14 flex justify-between text-white mt-20 items-center mx-5">
                    <Link href="/">
                        <div className="text-3xl font-bold">Aspira</div>
                    </Link>
                    <div>
                        <ul className="flex flex-row justify-center gap-10 place-items-center">
                            <Link href="/dashboard">
                                <li className="cursor-pointer hover:text-gray-300">DASHBOARD</li>
                            </Link>
                        </ul>
                    </div>
                </header>
            </div>

            <div className="w-full flex justify-center items-center">
                <div className="main grid place-items-center grid-cols-1 md:grid-cols-3 w-[90%] md:w-[80%] mt-14">
                    <div className="text-center md:text-left">
                        <h5 className="text-4xl md:text-5xl font-extrabold text-white">
                            Unlock Your Full Potential
                        </h5>
                        <p className="mt-4 text-lg text-white">
                            Personalized growth with AI-guided mentorship based on your favorite role models.
                        </p>
                        <div className="mt-5">
                            <Link href="/enter">
                                <button className="bg-transparent rounded-xl border-white border-2 w-32 h-10 text-white text-sm hover:bg-white hover:text-black mx-3">
                                    GET STARTED {'>'}
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="text-white text-xl md:text-2xl space-y-3">
                        <ul className="list-disc pl-4">
                            <li>Choose a Role Model</li>
                            <li>Real-Time Feedback on Skills</li>
                            <li>Daily Progress Summaries</li>
                        </ul>
                    </div>

                    <div className="flex justify-center md:justify-end mt-6 md:mt-0">
                        <img
                            src="https://www.omi.me/cdn/shop/files/213w213_84x.png"
                            alt="OMI AI"
                            className="w-[120px] md:w-[150px] rounded-lg"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
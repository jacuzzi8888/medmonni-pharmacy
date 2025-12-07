import React from 'react';
import { SOCIAL_LINKS } from '../../data/socialLinks';

const SocialFABs: React.FC = () => {
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            {/* Instagram FAB */}
            <a
                className="group"
                href="https://instagram.com/medomnipharmacy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow on Instagram"
            >
                <div className="bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white p-3 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300">
                    <svg
                        aria-hidden="true"
                        className="w-7 h-7"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap top-1/2 -translate-y-1/2">
                        Follow on Instagram
                    </span>
                </div>
            </a>

            {/* Snapchat FAB */}
            <a
                className="group"
                href="https://snapchat.com/add/medomnipharmacy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Add on Snapchat"
            >
                <div className="bg-[#FFFC00] text-black p-3 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300">
                    <svg
                        aria-hidden="true"
                        className="w-7 h-7"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301a.394.394 0 0 1 .464.049c.125.12.179.3.146.472-.024.126-.282 1.107-1.771 1.107-.202 0-.398-.021-.571-.054-.132-.025-.251-.043-.355-.043-.211 0-.345.056-.424.161-.092.11-.101.239-.094.298.016.165.082.303.295.532l.058.061c.586.64 1.235 1.358 1.235 2.347 0 1.56-2.083 3.45-6.592 3.45-4.511 0-6.594-1.89-6.594-3.45 0-.979.64-1.696 1.226-2.337l.068-.072c.214-.229.28-.366.296-.532.007-.059-.002-.188-.094-.298-.079-.105-.213-.161-.424-.161-.104 0-.223.018-.355.043-.173.033-.369.054-.571.054-1.489 0-1.747-.981-1.771-1.107-.033-.172.021-.352.146-.472a.395.395 0 0 1 .464-.049c.374.181.733.285 1.033.301.198 0 .326-.045.401-.09a6.62 6.62 0 0 1-.03-.51l-.003-.06c-.104-1.628-.23-3.654.299-4.847 1.583-3.545 4.94-3.821 5.93-3.821h.393z" />
                    </svg>
                    <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap top-1/2 -translate-y-1/2">
                        Add on Snapchat
                    </span>
                </div>
            </a>

            {/* WhatsApp FAB */}
            <a
                className="group"
                href="https://wa.me/2347052350000"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
            >
                <div className="bg-[#25D366] text-white p-3 rounded-full flex items-center justify-center shadow-lg hover:bg-[#128C7E] hover:scale-110 transition-all duration-300">
                    <svg
                        aria-hidden="true"
                        className="w-7 h-7"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.31 20.55C8.76 21.36 10.37 21.82 12.04 21.82C17.5 21.82 21.95 17.37 21.95 11.91C21.95 6.45 17.5 2 12.04 2M12.04 3.67C16.56 3.67 20.28 7.39 20.28 11.91C20.28 16.43 16.56 20.15 12.04 20.15C10.56 20.15 9.14 19.74 7.91 19L7.31 18.66L4.2 19.56L5.12 16.55L4.85 15.93C4.1 14.63 3.79 13.25 3.79 11.91C3.79 7.39 7.52 3.67 12.04 3.67"></path>
                    </svg>
                    <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap top-1/2 -translate-y-1/2">
                        Chat with Pharmacist
                    </span>
                </div>
            </a>
        </div>
    );
};

export default SocialFABs;

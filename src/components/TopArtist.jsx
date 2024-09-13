import React from 'react';
import { usePlayer } from '../Context/Context';
import Loader from './Loader';

function TopArtist() {
    const { TopArtists } = usePlayer();

    return (
        <>
            {TopArtists.length > 0 ? (
                <section 
                    className='grid grid-cols-2 gap-4 mb-10 md:grid-cols-2 md:gap-8 lg:grid-cols-5 lg:grid-rows-2'>
                    {TopArtists.map((artist, index) => (
                        <div key={index} className='relative flex flex-col items-center'>
                            {/* Artist Image with Play Button Overlay */}
                            <div className='relative group cursor-pointer'>
                                <img 
                                    src={artist.image[2].link} 
                                    alt={artist.name} 
                                    className='w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-auto rounded-full object-cover'
                                />
                                {/* Play Button Overlay */}
                                <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 rounded-full'>
                                    <button className='text-white text-2xl'>▶</button>
                                </div>
                            </div>
                            {/* Artist Name */}
                            <span className='mt-2 text-sm font-semibold text-center'>{artist.name}</span>
                        </div>
                    ))}
                </section>
            ) : (
                <Loader />
            )}
        </>
    );
}

export default TopArtist;

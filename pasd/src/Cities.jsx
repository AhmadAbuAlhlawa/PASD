import React, { useEffect } from 'react';
import './css/Cities.css';

const Cities = () => {
    const [cities, setCities] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    // Fetch cities data from API
    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:5000/get-cities')
            .then(response => response.json())
            .then(json => {
                setLoading(false);
                setCities(json);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    return (
        <div className='p-4'>
            <h2>Cities</h2>
            {loading ? <h2 className='mt-3'>Loading cities...</h2>
            :
            cities.length > 0 ?
            <div className='cities_row'>
                {cities.map(city => (
                    <a href={`/map/${city._id}`} key={city._id} className='city' 
                    style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${city.map_pic})` }}>
                        <h3>{city.city_name}</h3>
                        <div className='blur'>Click to view map</div>
                    </a>
                ))}
            </div>
            :
            <h2 className='text-danger'>No cities found</h2>
            }
        </div>
    );
};

export default Cities;

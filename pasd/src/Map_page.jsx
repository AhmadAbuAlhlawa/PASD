import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import MapComponent from './components/MapComponent';

const Map_page = () => {

    const [buildings, setBuildings] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [city, setCity] = React.useState(null);
    const [cityLoading, setCityLoading] = React.useState(false);
    const city_id = useParams().city_id;

    useEffect(() => {
        setCityLoading(true);
        // get city data from API
        fetch(`http://localhost:5000/city_frontend/${city_id}`)
       .then(response => response.json())
       .then(cityData => {
         setCityLoading(false);
         console.log(cityData);
         setCity(cityData);
        })
        .catch(error => {
            console.error(error);
            setCityLoading(false);
            setCity(null);
        });
    }, [city_id])
    useEffect(() => {
        setLoading(true);
        // Fetch map data for the selected city from API
        fetch(`http://localhost:5000/buildings/${city_id}`)
        .then(response => response.json())
        .then(mapData => {
            console.log(mapData);
            setBuildings(mapData); // Update buildings state with map data
            setLoading(false);
        })
        .catch(error => {
            console.error(error);
            setLoading(false);
            setBuildings([]); 
        });
    }, [city_id])

    return (
    <div>
        {
            cityLoading ?
            <h2 className='p-3'>Loading city data...</h2>
            :
            city ? 
            <>
                {loading ? 
                    <h2 className='p-3'>Loading...</h2>    
                    :
                    buildings.length > 0 ?
                        <MapComponent buildings={buildings} page={"cities"}  />
                    :
                    <h2 className='p-3'>No buildings found for this city</h2> 
                }
            </>
            :
            <h2>City not found</h2>
        }
    </div>
  )
}

export default Map_page
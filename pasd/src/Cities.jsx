import React, { useEffect } from 'react';
import Select from 'react-select';
import './css/Cities.css';

const Cities = () => {
    const [cities, setCities] = React.useState([]);
    const [selectedCity, setSelectedCity] = React.useState(null);
    const [buildings, setBuildings] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    
    const cityId = new URLSearchParams(window.location.search).get('city_id');
    // make cityId selectedCity if it's on cities
    useEffect(() => {
        if (cityId) {
            const selectedCity = cities.find(city => city.value === cityId);
            setSelectedCity(selectedCity);
        }
    }, [cities, cityId]);

    // Fetch cities data from API
    useEffect(() => {
        fetch('http://localhost:5000/get-cities')
            .then(response => response.json())
            .then(json => {
                const formattedCities = json.map(city => ({
                    value: city._id,
                    label: city.city_name
                }));
                setCities(formattedCities);
            })
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        if (selectedCity) {
            setLoading(true);
            // Fetch map data for the selected city from API
            fetch(`http://localhost:5000/buildings/${selectedCity.value}`)
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
        }
    }, [selectedCity])  // Only re-run effect if selectedCity changes)
    // Handle city selection
    const handleCityChange = selectedOption => {
        setSelectedCity(selectedOption);
        console.log("Selected City:", selectedOption);
    };

    return (
        <div className='cities_maps'>
            <div className='input'>
                <h4>Select a City</h4>
                <Select
                    options={cities} 
                    value={selectedCity} 
                    onChange={handleCityChange} 
                    placeholder="Choose a city..." 
                    isClearable
                />
            </div>
            <div className='city'>
                {selectedCity == null ? 
                <h2>Choose a city to display map...</h2>
                :
                buildings.length > 0 ?
                loading ? <h2>Loading...</h2> :
                buildings.map(building => (
                    <div key={building._id} className='building'>
                        <h3>{building.building_name}</h3>
                        <div>
                            <p>{building.address_id?.coordinates[0]}</p>
                            <p>{building.address_id?.coordinates[1]}</p>
                        </div>
                    </div>
                ))
                :
                <h2>No buildings found for this city.</h2>
                }
            </div>
        </div>
    );
};

export default Cities;
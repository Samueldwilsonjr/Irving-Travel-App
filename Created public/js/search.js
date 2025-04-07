document.addEventListener('DOMContentLoaded', function() {
    // Initialize search results if on the booking page
    if (window.location.pathname === '/booking') {
        // Parse query parameters
        const queryParams = new URLSearchParams(window.location.search);
        const searchType = queryParams.get('type');
        
        // Handle different search types
        if (searchType === 'flight') {
            handleFlightSearchResults(queryParams);
        } else if (searchType === 'hotel') {
            handleHotelSearchResults(queryParams);
        } else if (searchType === 'package') {
            handlePackageSearchResults(queryParams);
        }
        
        // Populate search form with query parameters
        populateSearchForm(queryParams);
    }
});

/**
 * Handle displaying flight search results
 * @param {URLSearchParams} queryParams - URL query parameters
 */
async function handleFlightSearchResults(queryParams) {
    try {
        const origin = queryParams.get('origin');
        const destination = queryParams.get('destination');
        const departDate = queryParams.get('depart');
        const returnDate = queryParams.get('return');
        
        document.getElementById('search-summary').innerHTML = `
            <h3>Flight Search Results</h3>
            <p>Showing flights from ${origin} to ${destination}<br>
            Departure: ${formatDate(departDate)} | Return: ${formatDate(returnDate)}</p>
        `;
        
        // Show loading indicator
        document.getElementById('search-results').innerHTML = `
            <div class="text-center my-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Searching for the best flights...</p>
            </div>
        `;
        
        // Fetch destination ID based on destination name (for demo purposes)
        const destinationsResponse = await fetch('/api/destinations');
        const destinations = await destinationsResponse.json();
        const destinationObj = destinations.find(d => 
            d.name.toLowerCase().includes(destination.toLowerCase()) || 
            d.location.toLowerCase().includes(destination.toLowerCase())
        );
        
        if (!destinationObj) {
            throw new Error('Destination not found');
        }
        
        // Fetch flights for the destination
        const response = await fetch(`/api/flights/${destinationObj.id}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch flights');
        }
        
        const flights = await response.json();
        
        if (flights.length === 0) {
            document.getElementById('search-results').innerHTML = `
                <div class="alert alert-info" role="alert">
                    No flights found for this route. Please try different dates or destinations.
                </div>
            `;
            return;
        }
        
        // Display flights
        displayFlightResults(flights, origin);
        
    } catch (error) {
        console.error('Error fetching flights:', error);
        document.getElementById('search-results').innerHTML = `
            <div class="alert alert-danger" role="alert">
                Failed to load flight results. ${error.message}
            </div>
        `;
    }
}

/**
 * Display flight search results
 * @param {Array} flights - Array of flight objects
 * @param {string} userOrigin - User's selected origin
 */
function displayFlightResults(flights, userOrigin) {
    const resultsContainer = document.getElementById('search-results');
    
    let html = '<div class="flight-results">';
    
    flights.forEach(flight => {
        if (flight.origin.toLowerCase().includes(userOrigin.toLowerCase())) {
            html += `
                <div class="card mb-3 flight-card">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-md-3">
                                <div class="airline">
                                    <h5>${flight.airline}</h5>
                                    <p class="text-muted small">Flight ID: ${flight.id}</p>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="flight-times text-center">
                                    <h5>${flight.departureTime}</h5>
                                    <p>${flight.origin}</p>
                                </div>
                            </div>
                            <div class="col-md-1 text-center">
                                <i class="fas fa-arrow-right text-muted"></i>
                                <p class="small text-muted">${flight.duration}</p>
                                <p class="small text-muted">${flight.stops === 0 ? 'Direct' : flight.stops + ' stop'}</p>
                            </div>
                            <div class="col-md-3">
                                <div class="flight-times text-center">
                                    <h5>${flight.arrivalTime}</h5>
                                    <p>${flight.destination}</p>
                                </div>
                            </div>
                            <div class="col-md-2 text-end">
                                <div class="flight-price">
                                    <h5 class="text-primary">$${flight.price}</h5>
                                    <p class="text-muted small">${flight.class}</p>
                                    <button class="btn btn-primary btn-sm mt-2" onclick="selectFlight(${flight.id})">Select</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    });
    
    html += '</div>';
    resultsContainer.innerHTML = html;
}

/**
 * Handle displaying hotel search results
 * @param {URLSearchParams} queryParams - URL query parameters
 */
async function handleHotelSearchResults(queryParams) {
    try {
        const destination = queryParams.get('destination');
        const checkIn = queryParams.get('checkIn');
        const checkOut = queryParams.get('checkOut');
        const rooms = queryParams.get('rooms');
        const adults = queryParams.get('adults');
        const children = queryParams.get('children');
        
        document.getElementById('search-summary').innerHTML = `
            <h3>Hotel Search Results</h3>
            <p>Showing hotels in ${destination}<br>
            Check-in: ${formatDate(checkIn)} | Check-out: ${formatDate(checkOut)}<br>
            ${rooms} room(s), ${adults} adult(s), ${children} child(ren)</p>
        `;
        
        // Show loading indicator
        document.getElementById('search-results').innerHTML = `
            <div class="text-center my-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Searching for the best hotels...</p>
            </div>
        `;
        
        // Fetch destination ID based on destination name (for demo purposes)
        const destinationsResponse = await fetch('/api/destinations');
        const destinations = await destinationsResponse.json();
        const destinationObj = destinations.find(d => 
            d.name.toLowerCase().includes(destination.toLowerCase()) || 
            d.location.toLowerCase().includes(destination.toLowerCase())
        );
        
        if (!destinationObj) {
            throw new Error('Destination not found');
        }
        
        // Fetch hotels for the destination
        const response = await fetch(`/api/hotels/${destinationObj.id}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch hotels');
        }
        
        const hotels = await response.json();
        
        if (hotels.length === 0) {
            document.getElementById('search-results').innerHTML = `
                <div class="alert alert-info" role="alert">
                    No hotels found for this destination. Please try a different destination.
                </div>
            `;
            return;
        }
        
        // Display hotels
        displayHotelResults(hotels, checkIn, checkOut);
        
    } catch (error) {
        console.error('Error fetching hotels:', error);
        document.getElementById('search-results').innerHTML = `
            <div class="alert alert-danger" role="alert">
                Failed to load hotel results. ${error.message}
            </div>
        `;
    }
}

/**
 * Display hotel search results
 * @param {Array} hotels - Array of hotel objects
 * @param {string} checkIn - Check-in date
 * @param {string} checkOut - Check-out date
 */
function displayHotelResults(hotels, checkIn, checkOut) {
    const resultsContainer = document.getElementById('search-results');
    
    let html = '<div class="hotel-results row">';
    
    hotels.forEach(hotel => {
        html += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 hotel-card">
                    <img src="${hotel.image}" class="card-img-top" alt="${hotel.name}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${hotel.name}</h5>
                        <p class="card-text small"><i class="fas fa-map-marker-alt text-primary me-1"></i>${hotel.location}</p>
                        <div class="hotel-rating mb-2">
                            ${getRatingStars(hotel.rating)}
                            <span class="ms-1">${hotel.rating}</span>
                        </div>
                        <p class="card-text small">${truncateText(hotel.description, 100)}</p>
                        <div class="hotel-features mb-2">
                            ${getHotelFeatures(hotel.features)}
                        </div>
                    </div>
                    <div class="card-footer d-flex justify-content-between align-items-center">
                        <div class="hotel-price">
                            <span class="text-primary fw-bold">$${hotel.price}</span>
                            <span class="text-muted small">/ night</span>
                        </div>
                        <button class="btn btn-primary btn-sm" onclick="selectHotel(${hotel.id}, '${checkIn}', '${checkOut}')">Select</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    resultsContainer.innerHTML = html;
}

/**
 * Handle displaying package search results
 * @param {URLSearchParams} queryParams - URL query parameters
 */
async function handlePackageSearchResults(queryParams) {
    try {
        const destination = queryParams.get('destination');
        const departDate = queryParams.get('depart');
        const returnDate = queryParams.get('return');
        const packageType = queryParams.get('packageType');
        const travelers = queryParams.get('travelers');
        
        document.getElementById('search-summary').innerHTML = `
            <h3>Package Search Results</h3>
            <p>Showing ${packageType} packages in ${destination}<br>
            Departure: ${formatDate(departDate)} | Return: ${formatDate(returnDate)}<br>
            Travelers: ${travelers}</p>
        `;
        
        // Show loading indicator
        document.getElementById('search-results').innerHTML = `
            <div class="text-center my-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Searching for the best packages...</p>
            </div>
        `;
        
        // Fetch destinations to find matching destination
        const destinationsResponse = await fetch('/api/destinations');
        const destinations = await destinationsResponse.json();
        
        // Try to find exact or partial match for the destination
        const destinationObj = destinations.find(d => 
            d.name.toLowerCase().includes(destination.toLowerCase()) || 
            d.location.toLowerCase().includes(destination.toLowerCase())
        );
        
        if (!destinationObj) {
            document.getElementById('search-results').innerHTML = `
                <div class="alert alert-info" role="alert">
                    No packages found for this destination. Please try a different destination.
                </div>
            `;
            return;
        }
        
        // For packages, we'll combine destination, hotel, and activity information
        const [hotelsResponse, activitiesResponse] = await Promise.all([
            fetch(`/api/hotels/${destinationObj.id}`),
            fetch(`/api/activities/${destinationObj.id}`)
        ]);
        
        const hotels = await hotelsResponse.json();
        const activities = await activitiesResponse.json();
        
        // Create package combinations
        const packages = createPackageCombinations(destinationObj, hotels, activities, packageType);
        
        if (packages.length === 0) {
            document.getElementById('search-results').innerHTML = `
                <div class="alert alert-info" role="alert">
                    No packages available for this destination and package type. Please try different options.
                </div>
            `;
            return;
        }
        
        // Display packages
        displayPackageResults(packages, departDate, returnDate);
        
    } catch (error) {
        console.error('Error creating packages:', error);
        document.getElementById('search-results').innerHTML = `
            <div class="alert alert-danger" role="alert">
                Failed to load package results. ${error.message}
            </div>
        `;
    }
}

/**
 * Create package combinations from destinations, hotels, and activities
 * @param {Object} destination - Destination object
 * @param {Array} hotels - Array of hotel objects
 * @param {Array} activities - Array of activity objects
 * @param {string} packageType - Type of package
 * @returns {Array} - Array of package objects
 */
function createPackageCombinations(destination, hotels, activities, packageType) {
    const packages = [];
    
    // Filter hotels and activities based on package type if needed
    let filteredHotels = hotels;
    let filteredActivities = activities;
    
    if (packageType === 'all-inclusive') {
        // For all-inclusive, prioritize hotels with more features
        filteredHotels = hotels.filter(h => h.features.length >= 4);
    }
    
    // Create different package combinations
    for (const hotel of filteredHotels) {
        // Select 2 random activities for each package
        const packageActivities = getRandomItems(filteredActivities, 2);
        
        // Calculate package base price (hotel + flight estimate + activities)
        const flightEstimate = destination.price * 0.6; // Rough flight cost estimate
        const activitiesPrice = packageActivities.reduce((sum, act) => sum + act.price, 0);
        const nights = 5; // Default package duration
        const basePrice = (hotel.price * nights) + flightEstimate + activitiesPrice;
        
        // Apply package type discount
        let finalPrice = basePrice;
        let discount = 0;
        
        if (packageType === 'all-inclusive') {
            discount = 0.2; // 20% discount for all-inclusive
        } else if (packageType === 'flight-hotel') {
            discount = 0.15; // 15% discount for flight+hotel
        } else if (packageType === 'cruise') {
            discount = 0.1; // 10% discount for cruise packages
        } else if (packageType === 'tour') {
            discount = 0.12; // 12% discount for guided tours
        }
        
        finalPrice = Math.round(basePrice * (1 - discount));
        
        packages.push({
            id: packages.length + 1,
            name: `${destination.name} ${getPackageTypeName(packageType)}`,
            destination: destination,
            hotel: hotel,
            activities: packageActivities,
            nights: nights,
            originalPrice: Math.round(basePrice),
            price: finalPrice,
            discount: discount * 100,
            packageType: packageType
        });
    }
    
    return packages;
}

/**
 * Display package search results
 * @param {Array} packages - Array of package objects
 * @param {string} departDate - Departure date
 * @param {string} returnDate - Return date
 */
function displayPackageResults(packages, departDate, returnDate) {
    const resultsContainer = document.getElementById('search-results');
    
    let html = '<div class="package-results">';
    
    packages.forEach(pkg => {
        html += `
            <div class="card mb-4 package-card">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${pkg.destination.image}" class="img-fluid h-100 rounded-start" alt="${pkg.destination.name}" style="object-fit: cover;">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start">
                                <h4 class="card-title">${pkg.name}</h4>
                                <span class="badge bg-danger">${pkg.discount}% OFF</span>
                            </div>
                            <p class="card-text mb-1"><i class="fas fa-map-marker-alt text-primary me-1"></i>${pkg.destination.location}</p>
                            <div class="package-rating mb-2">
                                ${getRatingStars(pkg.hotel.rating)}
                                <span class="ms-1">${pkg.hotel.rating}</span>
                            </div>
                            <h5 class="mb-3">Package Includes:</h5>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <div class="package-item mb-2">
                                        <i class="fas fa-plane-departure text-primary me-2"></i>
                                        <strong>Flight:</strong> Round trip to ${pkg.destination.name}
                                    </div>
                                    <div class="package-item mb-2">
                                        <i class="fas fa-hotel text-primary me-2"></i>
                                        <strong>Stay:</strong> ${pkg.nights} nights at ${pkg.hotel.name}
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="package-item mb-2">
                                        <i class="fas fa-utensils text-primary me-2"></i>
                                        <strong>Meals:</strong> ${pkg.packageType === 'all-inclusive' ? 'All meals included' : 'Breakfast included'}
                                    </div>
                                    <div class="package-item">
                                        <i class="fas fa-hiking text-primary me-2"></i>
                                        <strong>Activities:</strong> ${pkg.activities.map(a => a.name).join(', ')}
                                    </div>
                                </div>
                            </div>
                            <div class="row align-items-center mt-3">
                                <div class="col-md-6">
                                    <p class="card-text"><small class="text-muted">*Price is per person based on double occupancy</small></p>
                                </div>
                                <div class="col-md-6 text-md-end">
                                    <div class="package-price">
                                        <span class="text-muted text-decoration-line-through me-2">$${pkg.originalPrice}</span>
                                        <span class="text-primary fs-4 fw-bold">$${pkg.price}</span>
                                        <span class="text-muted">/ person</span>
                                    </div>
                                    <button class="btn btn-primary mt-2" onclick="selectPackage(${pkg.id}, '${departDate}', '${returnDate}')">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    resultsContainer.innerHTML = html;
}

/**
 * Populate search form with query parameters
 * @param {URLSearchParams} queryParams - URL query parameters
 */
function populateSearchForm(queryParams) {
    const searchType = queryParams.get('type');
    
    // Populate the booking form based on search type
    if (searchType === 'flight') {
        document.getElementById('booking-type').value = 'flight';
        if (document.getElementById('flight-origin')) {
            document.getElementById('flight-origin').value = queryParams.get('origin') || '';
        }
        if (document.getElementById('flight-destination')) {
            document.getElementById('flight-destination').value = queryParams.get('destination') || '';
        }
        if (document.getElementById('flight-depart')) {
            document.getElementById('flight-depart').value = queryParams.get('depart') || '';
        }
        if (document.getElementById('flight-return')) {
            document.getElementById('flight-return').value = queryParams.get('return') || '';
        }
    } else if (searchType === 'hotel') {
        document.getElementById('booking-type').value = 'hotel';
        if (document.getElementById('hotel-destination')) {
            document.getElementById('hotel-destination').value = queryParams.get('destination') || '';
        }
        if (document.getElementById('hotel-check-in')) {
            document.getElementById('hotel-check-in').value = queryParams.get('checkIn') || '';
        }
        if (document.getElementById('hotel-check-out')) {
            document.getElementById('hotel-check-out').value = queryParams.get('checkOut') || '';
        }
    } else if (searchType === 'package') {
        document.getElementById('booking-type').value = 'package';
        if (document.getElementById('package-destination')) {
            document.getElementById('package-destination').value = queryParams.get('destination') || '';
        }
        if (document.getElementById('package-depart')) {
            document.getElementById('package-depart').value = queryParams.get('depart') || '';
        }
        if (document.getElementById('package-return')) {
            document.getElementById('package-return').value = queryParams.get('return') || '';
        }
    }
}

/* Helper Functions */

/**
 * Get random items from an array
 * @param {Array} array - Input array
 * @param {number} count - Number of items to select
 * @returns {Array} - Array of selected items
 */
function getRandomItems(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

/**
 * Format date string to be more readable
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

/**
 * Get HTML for hotel features badges
 * @param {Array} features - Array of feature strings
 * @returns {string} - HTML string of feature badges
 */
function getHotelFeatures(features) {
    if (!features || features.length === 0) return '';
    
    return features.slice(0, 3).map(feature => 
        `<span class="badge bg-light text-dark me-1 mb-1">${feature}</span>`
    ).join('');
}

/**
 * Get HTML for rating stars
 * @param {number} rating - Rating value (0-5)
 * @returns {string} - HTML string of star icons
 */
function getRatingStars(rating) {
    if (!rating) return '';
    
    let html = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        html += '<i class="fas fa-star text-warning"></i>';
    }
    
    // Add half star if needed
    if (halfStar) {
        html += '<i class="fas fa-star-half-alt text-warning"></i>';
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        html += '<i class="far fa-star text-warning"></i>';
    }
    
    return html;
}

/**
 * Truncate text to a maximum length with ellipsis
 * @param {string} text - Input text
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} - Truncated text
 */
function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Get readable package type name
 * @param {string} type - Package type code
 * @returns {string} - Human-readable package type
 */
function getPackageTypeName(type) {
    switch (type) {
        case 'all-inclusive':
            return 'All-Inclusive Resort';
        case 'flight-hotel':
            return 'Flight + Hotel';
        case 'cruise':
            return 'Cruise Package';
        case 'tour':
            return 'Guided Tour';
        default:
            return 'Package';
    }
}

/**
 * Select a flight for booking
 * @param {number} flightId - ID of the selected flight
 */
function selectFlight(flightId) {
    // In a real application, this would store the selection and move to the next booking step
    alert(`Flight ${flightId} selected! Proceed to passenger details.`);
    document.getElementById('booking-form-container').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Select a hotel for booking
 * @param {number} hotelId - ID of the selected hotel
 * @param {string} checkIn - Check-in date
 * @param {string} checkOut - Check-out date
 */
function selectHotel(hotelId, checkIn, checkOut) {
    // In a real application, this would store the selection and move to the next booking step
    alert(`Hotel ${hotelId} selected! Proceed to guest details.`);
    document.getElementById('booking-form-container').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Select a package for booking
 * @param {number} packageId - ID of the selected package
 * @param {string} departDate - Departure date
 * @param {string} returnDate - Return date
 */
function selectPackage(packageId, departDate, returnDate) {
    // In a real application, this would store the selection and move to the next booking step
    alert(`Package ${packageId} selected! Proceed to traveler details.`);
    document.getElementById('booking-form-container').scrollIntoView({ behavior: 'smooth' });
}

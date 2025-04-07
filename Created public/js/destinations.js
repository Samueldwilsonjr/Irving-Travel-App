document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the destinations page
    if (window.location.pathname === '/destinations') {
        // Load all destinations
        loadDestinations();
        
        // Initialize filter functionality
        initializeFilters();
    }
    
    // Check if we're on the destination details page
    if (window.location.pathname.startsWith('/destination/')) {
        // Extract destination ID from URL
        const destinationId = window.location.pathname.split('/').pop();
        
        // Load destination details
        loadDestinationDetails(destinationId);
    }
});

/**
 * Load all destinations from the API
 */
async function loadDestinations() {
    try {
        // Show loading state
        document.getElementById('destinations-container').innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading destinations...</p>
            </div>
        `;
        
        // Fetch destinations from API
        const response = await fetch('/api/destinations');
        
        if (!response.ok) {
            throw new Error('Failed to fetch destinations');
        }
        
        const destinations = await response.json();
        
        // Display destinations
        displayDestinations(destinations);
        
        // Store destinations in session storage for filtering
        sessionStorage.setItem('allDestinations', JSON.stringify(destinations));
        
    } catch (error) {
        console.error('Error loading destinations:', error);
        document.getElementById('destinations-container').innerHTML = `
            <div class="alert alert-danger" role="alert">
                Failed to load destinations. ${error.message}
            </div>
        `;
    }
}

/**
 * Display destinations in the UI
 * @param {Array} destinations - Array of destination objects
 */
function displayDestinations(destinations) {
    const container = document.getElementById('destinations-container');
    
    if (!destinations || destinations.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info" role="alert">
                No destinations found matching your criteria.
            </div>
        `;
        return;
    }
    
    let html = '<div class="row g-4">';
    
    destinations.forEach(destination => {
        html += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card destination-card h-100 shadow border-0">
                    <div class="position-relative">
                        <img src="${destination.image}" classdocument.addEventListener('DOMContentLoaded', function() {
    // Load all destinations data
    fetchAllDestinations();
    
    // Initialize filter functionality
    initializeFilters();
});

/**
 * Fetch all destinations from the API
 */
async function fetchAllDestinations() {
    try {
        // Show loading indicator
        document.getElementById('destinations-container').innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading destinations...</span>
                </div>
                <p class="mt-2">Loading amazing destinations...</p>
            </div>
        `;
        
        const response = await fetch('/api/destinations');
        
        if (!response.ok) {
            throw new Error('Failed to fetch destinations');
        }
        
        const destinations = await response.json();
        
        if (destinations.length === 0) {
            document.getElementById('destinations-container').innerHTML = `
                <div class="alert alert-info" role="alert">
                    No destinations available at the moment. Please check back later.
                </div>
            `;
            return;
        }
        
        // Display all destinations
        displayDestinations(destinations);
        
        // Initialize filter options based on destination data
        populateFilterOptions(destinations);
    } catch (error) {
        console.error('Error fetching destinations:', error);
        document.getElementById('destinations-container').innerHTML = `
            <div class="alert alert-danger" role="alert">
                Error loading destinations. Please try again later.
            </div>
        `;
    }
}

/**
 * Display destinations in the UI
 * @param {Array} destinations - Array of destination objects
 */
function displayDestinations(destinations) {
    const container = document.getElementById('destinations-container');
    
    let html = '<div class="row">';
    
    destinations.forEach(destination => {
        html += `
            <div class="col-md-6 col-lg-4 mb-4" data-continent="${destination.continent}" data-category="${destination.category}" data-temperature="${destination.temperature}">
                <div class="destination-card h-100">
                    <div class="card border-0 shadow h-100">
                        <div class="position-relative">
                            <img src="${destination.image}" class="card-img-top" alt="${destination.name}" style="height: 220px; object-fit: cover;">
                            <div class="position-absolute top-0 end-0 m-2">
                                ${destination.featured ? '<span class="badge bg-primary">Featured</span>' : ''}
                            </div>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h5 class="card-title mb-0">${destination.name}</h5>
                                <div class="destination-rating">
                                    <i class="fas fa-star text-warning"></i> ${destination.rating}
                                </div>
                            </div>
                            <p class="card-text small mb-3"><i class="fas fa-map-marker-alt text-primary me-1"></i>${destination.location}</p>
                            <p class="card-text flex-grow-1">${truncateText(destination.description, 120)}</p>
                            <div class="destination-features mb-3">
                                <div class="row g-2">
                                    <div class="col-6">
                                        <span class="badge bg-light text-dark">
                                            <i class="fas fa-mountain text-primary me-1"></i> ${destination.category}
                                        </span>
                                    </div>
                                    <div class="col-6">
                                        <span class="badge bg-light text-dark">
                                            <i class="fas fa-temperature-high text-primary me-1"></i> ${destination.temperature}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mt-auto">
                                <div class="price-display">
                                    <span class="text-primary fw-bold">$${destination.price}</span>
                                    <span class="text-muted small">/ person</span>
                                </div>
                                <a href="/destination/${destination.id}" class="btn btn-primary btn-sm">View Details</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

/**
 * Initialize destination filters
 */
function initializeFilters() {
    // Add event listeners to filter dropdowns
    const filterContinentSelect = document.getElementById('filter-continent');
    const filterCategorySelect = document.getElementById('filter-category');
    const filterTemperatureSelect = document.getElementById('filter-temperature');
    const sortBySelect = document.getElementById('sort-by');
    
    // Add event listeners to filter elements if they exist
    if (filterContinentSelect) {
        filterContinentSelect.addEventListener('change', applyFilters);
    }
    
    if (filterCategorySelect) {
        filterCategorySelect.addEventListener('change', applyFilters);
    }
    
    if (filterTemperatureSelect) {
        filterTemperatureSelect.addEventListener('change', applyFilters);
    }
    
    if (sortBySelect) {
        sortBySelect.addEventListener('change', applyFilters);
    }
    
    // Add event listener to reset filters button
    const resetFiltersBtn = document.getElementById('reset-filters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
}

/**
 * Populate filter options based on available destination data
 * @param {Array} destinations - Array of destination objects
 */
function populateFilterOptions(destinations) {
    // Extract unique values for each filter
    const continents = [...new Set(destinations.map(d => d.continent))];
    const categories = [...new Set(destinations.map(d => d.category))];
    const temperatures = [...new Set(destinations.map(d => d.temperature))];
    
    // Populate continent filter
    const continentSelect = document.getElementById('filter-continent');
    if (continentSelect) {
        let continentOptions = '<option value="all">All Continents</option>';
        continents.forEach(continent => {
            continentOptions += `<option value="${continent}">${continent}</option>`;
        });
        continentSelect.innerHTML = continentOptions;
    }
    
    // Populate category filter
    const categorySelect = document.getElementById('filter-category');
    if (categorySelect) {
        let categoryOptions = '<option value="all">All Categories</option>';
        categories.forEach(category => {
            categoryOptions += `<option value="${category}">${category}</option>`;
        });
        categorySelect.innerHTML = categoryOptions;
    }
    
    // Populate temperature filter
    const temperatureSelect = document.getElementById('filter-temperature');
    if (temperatureSelect) {
        let temperatureOptions = '<option value="all">All Climates</option>';
        temperatures.forEach(temperature => {
            temperatureOptions += `<option value="${temperature}">${temperature}</option>`;
        });
        temperatureSelect.innerHTML = temperatureOptions;
    }
}

/**
 * Apply selected filters to destinations
 */
function applyFilters() {
    const continentFilter = document.getElementById('filter-continent').value;
    const categoryFilter = document.getElementById('filter-category').value;
    const temperatureFilter = document.getElementById('filter-temperature').value;
    const sortBy = document.getElementById('sort-by').value;
    
    // Get all destination cards
    const destinationCards = document.querySelectorAll('#destinations-container .col-md-6');
    
    // Track if any destinations match the filters
    let visibleDestinations = 0;
    
    // Filter destinations
    destinationCards.forEach(card => {
        const continent = card.getAttribute('data-continent');
        const category = card.getAttribute('data-category');
        const temperature = card.getAttribute('data-temperature');
        
        // Check if destination matches all selected filters
        const matchesContinent = continentFilter === 'all' || continent === continentFilter;
        const matchesCategory = categoryFilter === 'all' || category === categoryFilter;
        const matchesTemperature = temperatureFilter === 'all' || temperature === temperatureFilter;
        
        // Show or hide based on filter matches
        if (matchesContinent && matchesCategory && matchesTemperature) {
            card.style.display = 'block';
            visibleDestinations++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Sort visible destinations
    if (sortBy !== 'default' && visibleDestinations > 0) {
        sortDestinations(sortBy);
    }
    
    // Show message if no destinations match the filters
    const noResultsMessage = document.getElementById('no-results-message');
    if (noResultsMessage) {
        if (visibleDestinations === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }
    }
}

/**
 * Sort destinations based on selected criteria
 * @param {string} sortBy - Sort criteria
 */
function sortDestinations(sortBy) {
    const container = document.getElementById('destinations-container');
    const destinationCards = Array.from(container.querySelectorAll('.col-md-6[style="display: block"]'));
    
    // Only sort visible cards
    destinationCards.sort((a, b) => {
        if (sortBy === 'price-low') {
            const priceA = parseFloat(a.querySelector('.price-display .fw-bold').textContent.replace('$', ''));
            const priceB = parseFloat(b.querySelector('.price-display .fw-bold').textContent.replace('$', ''));
            return priceA - priceB;
        } else if (sortBy === 'price-high') {
            const priceA = parseFloat(a.querySelector('.price-display .fw-bold').textContent.replace('$', ''));
            const priceB = parseFloat(b.querySelector('.price-display .fw-bold').textContent.replace('$', ''));
            return priceB - priceA;
        } else if (sortBy === 'rating') {
            const ratingA = parseFloat(a.querySelector('.destination-rating').textContent.trim());
            const ratingB = parseFloat(b.querySelector('.destination-rating').textContent.trim());
            return ratingB - ratingA;
        }
        return 0;
    });
    
    // Reappend sorted cards to container
    destinationCards.forEach(card => {
        container.appendChild(card);
    });
}

/**
 * Reset all filters to default values
 */
function resetFilters() {
    document.getElementById('filter-continent').value = 'all';
    document.getElementById('filter-category').value = 'all';
    document.getElementById('filter-temperature').value = 'all';
    document.getElementById('sort-by').value = 'default';
    
    // Show all destination cards
    const destinationCards = document.querySelectorAll('#destinations-container .col-md-6');
    destinationCards.forEach(card => {
        card.style.display = 'block';
    });
    
    // Hide no results message
    const noResultsMessage = document.getElementById('no-results-message');
    if (noResultsMessage) {
        noResultsMessage.style.display = 'none';
    }
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

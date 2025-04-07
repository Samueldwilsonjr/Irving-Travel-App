document.addEventListener('DOMContentLoaded', function() {
    // Load featured destinations
    fetchFeaturedDestinations();
    
    // Initialize datepickers for search forms with default dates
    initializeSearchForms();
    
    // Initialize contact form submission
    initializeContactForm();
});

/**
 * Fetch featured destinations from the API
 */
async function fetchFeaturedDestinations() {
    try {
        const response = await fetch('/api/destinations');
        
        if (!response.ok) {
            throw new Error('Failed to fetch destinations');
        }
        
        const destinations = await response.json();
        
        // Filter featured destinations and display them
        const featuredDestinations = destinations.filter(dest => dest.featured);
        displayFeaturedDestinations(featuredDestinations);
    } catch (error) {
        console.error('Error fetching destinations:', error);
        document.getElementById('featured-destinations-container').innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-danger" role="alert">
                    Unable to load destinations. Please try again later.
                </div>
            </div>
        `;
    }
}

/**
 * Display featured destinations in the UI
 * @param {Array} destinations - Array of destination objects
 */
function displayFeaturedDestinations(destinations) {
    const container = document.getElementById('featured-destinations-container');
    
    if (!destinations || destinations.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info" role="alert">
                    No featured destinations available at the moment.
                </div>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    destinations.forEach(destination => {
        html += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="destination-card">
                    <div class="card border-0 shadow h-100">
                        <img src="${destination.image}" class="card-img" alt="${destination.name}">
                        <div class="card-img-overlay text-white">
                            <h4 class="card-title">${destination.name}</h4>
                            <div class="destination-rating">
                                <i class="fas fa-star text-warning"></i> ${destination.rating}
                            </div>
                            <p class="card-text mb-1">${destination.location}</p>
                            <p class="mb-2">
                                <span class="destination-price">From $${destination.price}</span> / person
                            </p>
                            <a href="/destination/${destination.id}" class="btn btn-primary btn-sm">Explore</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * Initialize search forms with date pickers and default values
 */
function initializeSearchForms() {
    // Set default dates for search forms (today and today + 7 days)
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };
    
    // Set default dates for flight search
    document.getElementById('depart-date').value = formatDate(today);
    document.getElementById('return-date').value = formatDate(nextWeek);
    
    // Set default dates for hotel search
    document.getElementById('check-in').value = formatDate(today);
    document.getElementById('check-out').value = formatDate(nextWeek);
    
    // Set default dates for package search
    document.getElementById('package-depart').value = formatDate(today);
    document.getElementById('package-return').value = formatDate(nextWeek);
    
    // Add event listeners to search forms
    document.getElementById('flight-search-form').addEventListener('submit', handleFlightSearch);
    document.getElementById('hotel-search-form').addEventListener('submit', handleHotelSearch);
    document.getElementById('package-search-form').addEventListener('submit', handlePackageSearch);
}

/**
 * Handle flight search form submission
 * @param {Event} e - Submit event
 */
function handleFlightSearch(e) {
    e.preventDefault();
    
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const departDate = document.getElementById('depart-date').value;
    const returnDate = document.getElementById('return-date').value;
    const travelers = document.getElementById('travelers').value;
    const travelClass = document.getElementById('class').value;
    
    // Redirect to booking page with search parameters
    window.location.href = `/booking?type=flight&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&depart=${departDate}&return=${returnDate}&travelers=${travelers}&class=${travelClass}`;
}

/**
 * Handle hotel search form submission
 * @param {Event} e - Submit event
 */
function handleHotelSearch(e) {
    e.preventDefault();
    
    const destination = document.getElementById('hotel-destination').value;
    const checkIn = document.getElementById('check-in').value;
    const checkOut = document.getElementById('check-out').value;
    const rooms = document.getElementById('rooms').value;
    const adults = document.getElementById('adults').value;
    const children = document.getElementById('children').value;
    
    // Redirect to booking page with search parameters
    window.location.href = `/booking?type=hotel&destination=${encodeURIComponent(destination)}&checkIn=${checkIn}&checkOut=${checkOut}&rooms=${rooms}&adults=${adults}&children=${children}`;
}

/**
 * Handle package search form submission
 * @param {Event} e - Submit event
 */
function handlePackageSearch(e) {
    e.preventDefault();
    
    const destination = document.getElementById('package-destination').value;
    const departDate = document.getElementById('package-depart').value;
    const returnDate = document.getElementById('package-return').value;
    const packageType = document.getElementById('package-type').value;
    const travelers = document.getElementById('package-travelers').value;
    
    // Redirect to booking page with search parameters
    window.location.href = `/booking?type=package&destination=${encodeURIComponent(destination)}&depart=${departDate}&return=${returnDate}&packageType=${packageType}&travelers=${travelers}`;
}

/**
 * Initialize contact form submission
 */
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate form submission
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Display success message (in a real app, this would send data to server)
            alert(`Thank you, ${name}! Your message has been received. We'll get back to you soon.`);
            contactForm.reset();
        });
    }
}

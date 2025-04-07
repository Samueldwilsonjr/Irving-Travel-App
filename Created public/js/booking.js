document.addEventListener('DOMContentLoaded', function() {
    // Initialize booking form functionality
    initializeBookingForm();
    
    // Handle form submission
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmission);
    }
});

/**
 * Initialize booking form with event listeners and default values
 */
function initializeBookingForm() {
    // Get form elements
    const bookingTypeSelect = document.getElementById('booking-type');
    const flightSection = document.getElementById('flight-section');
    const hotelSection = document.getElementById('hotel-section');
    const packageSection = document.getElementById('package-section');
    
    // Set today's date as the minimum date for all date inputs
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];
    
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.min = today;
        if (input.id.includes('depart') || input.id.includes('check-in')) {
            input.value = input.value || today;
        } else if (input.id.includes('return') || input.id.includes('check-out')) {
            input.value = input.value || nextWeekStr;
        }
    });
    
    // Handle booking type change
    if (bookingTypeSelect) {
        bookingTypeSelect.addEventListener('change', function() {
            // Hide all sections first
            if (flightSection) flightSection.style.display = 'none';
            if (hotelSection) hotelSection.style.display = 'none';
            if (packageSection) packageSection.style.display = 'none';
            
            // Show selected section
            const selectedType = this.value;
            if (selectedType === 'flight' && flightSection) {
                flightSection.style.display = 'block';
            } else if (selectedType === 'hotel' && hotelSection) {
                hotelSection.style.display = 'block';
            } else if (selectedType === 'package' && packageSection) {
                packageSection.style.display = 'block';
            }
        });
        
        // Trigger change event to show the initial selected section
        bookingTypeSelect.dispatchEvent(new Event('change'));
    }
    
    // Add event listeners for date validation
    const departDateInput = document.getElementById('flight-depart');
    const returnDateInput = document.getElementById('flight-return');
    const checkInInput = document.getElementById('hotel-check-in');
    const checkOutInput = document.getElementById('hotel-check-out');
    const packageDepartInput = document.getElementById('package-depart');
    const packageReturnInput = document.getElementById('package-return');
    
    // Validate flight dates
    if (departDateInput && returnDateInput) {
        departDateInput.addEventListener('change', function() {
            returnDateInput.min = this.value;
            if (returnDateInput.value < this.value) {
                returnDateInput.value = this.value;
            }
        });
    }
    
    // Validate hotel dates
    if (checkInInput && checkOutInput) {
        checkInInput.addEventListener('change', function() {
            checkOutInput.min = this.value;
            if (checkOutInput.value < this.value) {
                checkOutInput.value = this.value;
            }
        });
    }
    
    // Validate package dates
    if (packageDepartInput && packageReturnInput) {
        packageDepartInput.addEventListener('change', function() {
            packageReturnInput.min = this.value;
            if (packageReturnInput.value < this.value) {
                packageReturnInput.value = this.value;
            }
        });
    }
}

/**
 * Handle booking form submission
 * @param {Event} e - Submit event
 */
async function handleBookingSubmission(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const bookingData = {
        bookingType: formData.get('booking-type'),
        travelerInfo: {
            firstName: formData.get('first-name'),
            lastName: formData.get('last-name'),
            email: formData.get('email'),
            phone: formData.get('phone')
        },
        paymentInfo: {
            cardName: formData.get('card-name'),
            cardNumber: formData.get('card-number'),
            expiryDate: formData.get('expiry-date'),
            cvv: formData.get('cvv')
        }
    };
    
    // Add booking type specific data
    if (bookingData.bookingType === 'flight') {
        bookingData.flightInfo = {
            origin: formData.get('flight-origin'),
            destination: formData.get('flight-destination'),
            departDate: formData.get('flight-depart'),
            returnDate: formData.get('flight-return'),
            passengers: formData.get('flight-passengers'),
            flightClass: formData.get('flight-class')
        };
    } else if (bookingData.bookingType === 'hotel') {
        bookingData.hotelInfo = {
            destination: formData.get('hotel-destination'),
            checkIn: formData.get('hotel-check-in'),
            checkOut: formData.get('hotel-check-out'),
            rooms: formData.get('hotel-rooms'),
            guests: formData.get('hotel-guests')
        };
    } else if (bookingData.bookingType === 'package') {
        bookingData.packageInfo = {
            destination: formData.get('package-destination'),
            departDate: formData.get('package-depart'),
            returnDate: formData.get('package-return'),
            travelers: formData.get('package-travelers'),
            packageType: formData.get('package-type')
        };
    }
    
    try {
        // Show loading state
        document.getElementById('booking-submit-btn').disabled = true;
        document.getElementById('booking-submit-btn').innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
        
        // Submit booking to server
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Booking failed');
        }
        
        // Show success message
        showBookingConfirmation(result);
        
    } catch (error) {
        console.error('Booking error:', error);
        alert(`Booking failed: ${error.message}`);
        
        // Reset button state
        document.getElementById('booking-submit-btn').disabled = false;
        document.getElementById('booking-submit-btn').innerHTML = 'Complete Booking';
    }
}

/**
 * Display booking confirmation message
 * @param {Object} bookingResult - Booking result from server
 */
function showBookingConfirmation(bookingResult) {
    // Create a booking reference number
    const bookingReference = `TE${bookingResult.id}${Date.now().toString().substring(7)}`;
    
    // Get booking form container
    const formContainer = document.getElementById('booking-form-container');
    
    // Create confirmation content
    const confirmationHTML = `
        <div class="booking-confirmation text-center py-5">
            <div class="mb-4">
                <i class="fas fa-check-circle text-success fa-5x"></i>
            </div>
            <h2>Booking Confirmed!</h2>
            <p class="lead">Thank you for booking with TravelEase.</p>
            <div class="confirmation-details card shadow my-4">
                <div class="card-body">
                    <h4 class="mb-3">Booking Details</h4>
                    <p><strong>Booking Reference:</strong> ${bookingReference}</p>
                    <p><strong>Booking Type:</strong> ${capitalizeFirstLetter(bookingResult.bookingType)}</p>
                    <p><strong>Traveler:</strong> ${bookingResult.travelerInfo.firstName} ${bookingResult.travelerInfo.lastName}</p>
                    <p><strong>Email:</strong> ${bookingResult.travelerInfo.email}</p>
                    <p><strong>Date:</strong> ${new Date(bookingResult.bookingDate).toLocaleDateString()}</p>
                </div>
            </div>
            <p>A confirmation email has been sent to ${bookingResult.travelerInfo.email}</p>
            <div class="mt-4">
                <a href="/" class="btn btn-primary me-2">Return to Home</a>
                <a href="/destinations" class="btn btn-outline-primary">Browse More Destinations</a>
            </div>
        </div>
    `;
    
    // Replace form with confirmation
    formContainer.innerHTML = confirmationHTML;
    
    // Scroll to top of confirmation
    formContainer.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Capitalize the first letter of a string
 * @param {string} string - Input string
 * @returns {string} - String with first letter capitalized
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

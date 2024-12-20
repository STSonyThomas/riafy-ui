class BookingPlugin {
    constructor() {
        this.container = document.getElementById('booking-plugin');
        this.apiBaseUrl = 'https://riafy-backend.onrender.com/api';
        this.availableSlots = [];
        this.createUI();
        this.init();
    }
    
    createUI() {
        // Create main container
        const bookingForm = document.createElement('div');
        bookingForm.className = 'booking-form';
        
        // Add title
        const title = document.createElement('h2');
        title.textContent = 'Make a Booking';
        bookingForm.appendChild(title);

        // Add helper text
        const helperText = document.createElement('div');
        helperText.className = 'helper-text';
        helperText.textContent = 'Choose a date to see available slots';
        bookingForm.appendChild(helperText);
        this.helperText = helperText;
        
        // Create actual form element
        const form = document.createElement('form');
        form.onsubmit = (e) => this.handleSubmit(e);
        
        // Create form groups
        const fields = [
            { id: 'name', type: 'text', label: 'Name', message: 'Please enter your name' },
            { id: 'phone', type: 'tel', label: 'Phone Number', message: 'Please enter a valid phone number' },
            { id: 'date', type: 'date', label: 'Date', message: 'Please select a date' },
            { id: 'time-slot', type: 'select', label: 'Time Slot', message: 'Please select a time slot' }
        ];
        
        fields.forEach(field => {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';
            
            const label = document.createElement('label');
            label.htmlFor = field.id;
            label.textContent = field.label;
            label.className = 'required-field';
            formGroup.appendChild(label);
            
            if (field.type === 'select') {
                const select = document.createElement('select');
                select.id = field.id;
                select.required = true;
                select.innerHTML = '<option value="">Select a time slot</option>';
                this.timeSlotSelect = select;
                formGroup.appendChild(select);
            } else {
                const input = document.createElement('input');
                input.type = field.type;
                input.id = field.id;
                input.required = true;
                formGroup.appendChild(input);
                
                if (field.id === 'name') this.nameInput = input;
                if (field.id === 'phone') this.phoneInput = input;
                if (field.id === 'date') this.dateInput = input;
            }

            // Add validation message
            const validationMessage = document.createElement('div');
            validationMessage.className = 'validation-message';
            validationMessage.textContent = field.message;
            formGroup.appendChild(validationMessage);
            
            form.appendChild(formGroup);
        });
        
        // Create submit button
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.id = 'submit-booking';
        submitButton.textContent = 'Book Now';
        this.submitButton = submitButton;
        form.appendChild(submitButton);

        // Add form to the booking form container
        bookingForm.appendChild(form);
        
        // Create available slots section
        const availableSlotsSection = document.createElement('div');
        availableSlotsSection.className = 'available-slots';
        
        const slotsTitle = document.createElement('h2');
        slotsTitle.textContent = 'Available Slots';
        availableSlotsSection.appendChild(slotsTitle);
        
        const slotsDisplay = document.createElement('div');
        slotsDisplay.id = 'slots-display';
        this.slotsDisplay = slotsDisplay;
        availableSlotsSection.appendChild(slotsDisplay);
        
        // Create message div for notifications
        const messageDiv = document.createElement('div');
        messageDiv.id = 'message';
        messageDiv.className = 'message';
        this.messageDiv = messageDiv;
        
        // Add everything to the container
        this.container.appendChild(bookingForm);
        this.container.appendChild(availableSlotsSection);
        this.container.appendChild(messageDiv);
    }
    
    init() {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        this.dateInput.min = today;
        
        // Event listeners
        this.dateInput.addEventListener('change', () => this.fetchAvailableSlots());
        
        // Input validation
        this.phoneInput.addEventListener('input', () => this.validatePhone());
    }
    
    async fetchAvailableSlots() {
        try {
            const date = this.dateInput.value;
            if (!date) {
                this.helperText.style.display = 'block';
                return;
            }
            this.helperText.style.display = 'none';

            const response = await fetch(`${this.apiBaseUrl}/available_slots?date=${date}`);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to fetch available slots');
            }

            const data = await response.json();
            this.availableSlots = data.available_slots;
            this.updateTimeSlots();
            this.displaySlots();
        } catch (error) {
            this.showMessage(error.message || 'Error fetching available slots', 'error');
        }
    }
    
    updateTimeSlots() {
        this.timeSlotSelect.innerHTML = '<option value="">Select a time slot</option>';
        
        this.availableSlots.forEach(slot => {
            const option = document.createElement('option');
            option.value = slot;
            option.textContent = slot;
            this.timeSlotSelect.appendChild(option);
        });
    }
    
    displaySlots() {
        this.slotsDisplay.innerHTML = '';
        
        this.availableSlots.forEach(slot => {
            const slotElement = document.createElement('div');
            slotElement.className = 'slot';
            slotElement.textContent = slot;
            this.slotsDisplay.appendChild(slotElement);
        });
    }
    
    validatePhone() {
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        const isValid = phoneRegex.test(this.phoneInput.value);
        this.phoneInput.setCustomValidity(isValid ? '' : 'Please enter a valid phone number');
        
        const formGroup = this.phoneInput.closest('.form-group');
        if (!isValid && this.phoneInput.value) {
            formGroup.classList.add('invalid');
        } else {
            formGroup.classList.remove('invalid');
        }
    }
    
    validateInputs() {
        let isValid = true;
        const fields = [
            { element: this.nameInput, group: this.nameInput.closest('.form-group') },
            { element: this.phoneInput, group: this.phoneInput.closest('.form-group') },
            { element: this.dateInput, group: this.dateInput.closest('.form-group') },
            { element: this.timeSlotSelect, group: this.timeSlotSelect.closest('.form-group') }
        ];

        fields.forEach(({ element, group }) => {
            if (!element.value.trim()) {
                group.classList.add('invalid');
                // Remove existing shake animation if any
                group.classList.remove('shake');
                // Trigger reflow
                void group.offsetWidth;
                // Add shake animation
                group.classList.add('shake');
                isValid = false;
            } else {
                group.classList.remove('invalid');
                group.classList.remove('shake');
            }
        });

        return isValid;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateInputs()) {
            this.showMessage('Please fill in all required fields', 'error');
            return;
        }
        
        const bookingData = {
            name: this.nameInput.value,
            phone_number: this.phoneInput.value,
            date: this.dateInput.value,
            time_slot: this.timeSlotSelect.value
        };
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/book_appointment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Booking failed');
            }

            this.showMessage('Booking successful!', 'success');
            this.resetForm();
            await this.fetchAvailableSlots(); // Refresh available slots
        } catch (error) {
            this.showMessage(error.message || 'Error submitting booking', 'error');
        }
    }
    
    showMessage(message, type) {
        // Remove existing message if present
        if (this.messageDiv.classList.length > 1) {
            this.messageDiv.remove();
            this.messageDiv = document.createElement('div');
            this.messageDiv.id = 'message';
            this.container.appendChild(this.messageDiv);
        }

        this.messageDiv.textContent = message;
        this.messageDiv.className = `message ${type}`;
        
        // Remove the message after 5 seconds with animation
        setTimeout(() => {
            this.messageDiv.classList.add('fade-out');
            setTimeout(() => {
                this.messageDiv.textContent = '';
                this.messageDiv.className = 'message';
            }, 300); // Wait for fade-out animation to complete
        }, 5000);
    }
    
    resetForm() {
        this.nameInput.value = '';
        this.phoneInput.value = '';
        this.timeSlotSelect.value = '';
    }
}

// Initialize the plugin
function initBookingPlugin() {
    new BookingPlugin();
}

// Auto-initialize if the container exists
if (document.getElementById('booking-plugin')) {
    document.addEventListener('DOMContentLoaded', initBookingPlugin);
}

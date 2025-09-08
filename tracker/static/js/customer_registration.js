document.addEventListener('DOMContentLoaded', function() {
    // Auto-format phone number
    const phoneInput = document.querySelector('input[name="phone"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 9) value = value.substring(0, 9);
            e.target.value = value;
        });
    }

    // Dynamic service type loading
    const serviceTypeRadios = document.querySelectorAll('input[name="service_type"]');
    const serviceDetails = document.getElementById('service-details');
    
    if (serviceTypeRadios.length && serviceDetails) {
        serviceTypeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.checked) {
                    const serviceType = this.value;
                    fetch(`/service-form/${serviceType}/`)
                        .then(response => response.text())
                        .then(html => {
                            serviceDetails.innerHTML = html;
                            // Re-initialize any dynamic elements if needed
                        })
                        .catch(error => console.error('Error loading service form:', error));
                }
            });
        });
    }

    // Form validation
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.remove('is-invalid');
                }
            });

            if (!isValid) {
                e.preventDefault();
                // Scroll to first invalid field
                const firstInvalid = form.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }

    // Auto-save form data
    function saveFormData() {
        if (!form) return;
        
        const formData = new FormData(form);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        localStorage.setItem('customerRegistrationData', JSON.stringify(formObject));
    }

    // Load saved form data
    function loadFormData() {
        const savedData = localStorage.getItem('customerRegistrationData');
        if (!savedData) return;
        
        try {
            const formData = JSON.parse(savedData);
            Object.keys(formData).forEach(key => {
                const element = form.querySelector(`[name="${key}"]`);
                if (element) {
                    if (element.type === 'checkbox' || element.type === 'radio') {
                        element.checked = formData[key] === 'true' || formData[key] === element.value;
                    } else {
                        element.value = formData[key];
                    }
                }
            });
        } catch (e) {
            console.error('Error loading form data:', e);
            localStorage.removeItem('customerRegistrationData');
        }
    }

    // Set up auto-save
    if (form) {
        // Load saved data on page load
        loadFormData();
        
        // Save on input change
        form.addEventListener('input', saveFormData);
        
        // Clear saved data on successful form submission
        form.addEventListener('submit', function() {
            localStorage.removeItem('customerRegistrationData');
        });
    }

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

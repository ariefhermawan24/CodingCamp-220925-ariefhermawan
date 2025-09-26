document.addEventListener('DOMContentLoaded', () => {
    setupWelcomeModal(); // <-- NEW
    setupInputListeners();
    setupNameFieldRestriction();
});

function setupWelcomeModal() {
    const mainContent = document.getElementById('main-content');
    const modal = document.getElementById('welcome-modal');
    const modalContent = document.getElementById('modal-content-wrapper');

    const input = document.getElementById('modal-username-input');
    const submitBtn = document.getElementById('modal-submit-button');
    const guestBtn = document.getElementById('modal-guest-button');
    const errorMsg = document.getElementById('modal-error-message');
    const usernameDisplay = document.getElementById('username');
    
    modal.classList.remove('hidden');
    modalContent.classList.remove('-translate-y-full'); // Ensure proper positioning
    mainContent.classList.add('opacity-0'); // Hide main content

    // Helper function to process the name and close the modal
    const processName = (name) => {
        let finalName = name.trim();
        if (finalName === "") {
            finalName = "Guest";
        } else {
            // Capitalize first letter
            finalName = finalName.charAt(0).toUpperCase() + finalName.slice(1);
        }

        usernameDisplay.textContent = finalName;

        // SHOW MAIN CONTENT
        mainContent.classList.remove('opacity-0');

        // Hide modal with transition
        modal.style.opacity = 0;

        setTimeout(() => {
            modal.classList.add('hidden');
            
            // Scroll to home section after closing
            const homeSection = document.getElementById('home');
            if (homeSection) {
                homeSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }, 500);
    };

    // 1. Submit Button Listener
    submitBtn.addEventListener('click', () => {
        const nameValue = input.value.trim();
        if (nameValue === "") {
            errorMsg.textContent = "Name cannot be empty.";
            errorMsg.classList.remove('hidden');
        } else {
            errorMsg.classList.add('hidden');
            processName(nameValue);
        }
    });

    // 2. Keep as Guest Button Listener
    guestBtn.addEventListener('click', () => {
        processName("Guest");
    });

    // 3. Prevent submission via Enter key on the modal input
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            submitBtn.click();
        }
    });
}
/**
 * Helper function to toggle error states (CSS class and message display)
 */
function toggleError(fieldId, errorElementId, message) {
    const inputField = document.getElementById(fieldId);
    const errorElement = document.getElementById(errorElementId);

    if (message) {
        // Show error state
        inputField.classList.add('border-red-500');
        inputField.classList.remove('border-gray-700');
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    } else {
        // Hide error state (reset to valid state)
        inputField.classList.remove('border-red-500');
        inputField.classList.add('border-gray-700');
        errorElement.classList.add('hidden');
        errorElement.textContent = '';
    }
}


/**
 * Sets up a keypress listener on the name field to prevent numeric input.
 */
function setupNameFieldRestriction() {
    const nameField = document.getElementById('name');

    nameField.addEventListener('keypress', (event) => {
        const charCode = (event.which) ? event.which : event.keyCode;

        // Block numbers (charCode 48-57)
        if (charCode >= 48 && charCode <= 57) {
            event.preventDefault();
            // Show error "cannot contain numbers" automatically
            toggleError('name', 'error-name', 'Name cannot contain numbers.');
        }
    });
}

/**
 * Sets up event listeners on form fields to clear errors automatically on input.
 */
function setupInputListeners() {
    const fields = [{
            fieldId: 'name',
            errorId: 'error-name'
        },
        {
            fieldId: 'email',
            errorId: 'error-email'
        },
        {
            fieldId: 'message',
            errorId: 'error-message'
        }
    ];

    fields.forEach(item => {
        const inputField = document.getElementById(item.fieldId);

        inputField.addEventListener('input', () => {
            const fieldId = item.fieldId;
            const errorId = item.errorId;
            const currentValue = inputField.value; 

            // Only process if field is currently in an error state
            if (!inputField.classList.contains('border-red-500')) {
                return;
            }

            if (fieldId === 'name') {
                const containsNumber = /\d/.test(currentValue);

                if (!containsNumber && currentValue.trim() !== "") {
                    toggleError(fieldId, errorId, null);
                } else if (containsNumber) {
                    toggleError(fieldId, errorId, 'Name cannot contain numbers.');
                }

            } else if (fieldId === 'email') {
                if (isValidEmail(currentValue.trim())) {
                    toggleError(fieldId, errorId, null);
                }
            } else {
                if (currentValue.trim() !== "") {
                    toggleError(fieldId, errorId, null);
                }
            }
        });
    });
}

/**
 * Handles validation (on button click) and displays submitted values.
 */
function validateForm() {
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let message = document.getElementById("message").value.trim();
    const resultsDiv = document.getElementById("form-results");

    let isFormValid = true;

    // 2. Clear previous errors before re-validation
    toggleError('name', 'error-name', null);
    toggleError('email', 'error-email', null);
    toggleError('message', 'error-message', null);

    // 3. Validation Logic (Strict check on button press)

    // Validate Name (Required & No Numbers check)
    if (name === "") {
        toggleError('name', 'error-name', 'Name is required.');
        isFormValid = false;
    } else if (/\d/.test(name)) {
        toggleError('name', 'error-name', 'Name cannot contain numbers.');
        isFormValid = false;
    }

    // Validate Email (Required & Regex check)
    if (email === "") {
        toggleError('email', 'error-email', 'Email is required.');
        isFormValid = false;
    } else if (!isValidEmail(email)) {
        toggleError('email', 'error-email', 'Please enter a valid email address.');
        isFormValid = false;
    }

    // Validate Message (Required check)
    if (message === "") {
        toggleError('message', 'error-message', 'Message content is required.');
        isFormValid = false;
    }

    // 4. Submission Handling
    if (!isFormValid) {
        resultsDiv.classList.add('hidden');
        return;
    }

    // 5. If valid, proceed to display submitted values on the HTML
    const content = `
        <p class="mb-2 text-gray-300"><span class="font-semibold text-white">Name:</span> ${name}</p>
        <p class="mb-2 text-gray-300"><span class="font-semibold text-white">Email:</span> ${email}</p>
        <div class="mt-4 p-3 bg-gray-600 rounded">
            <p class="font-semibold text-white mb-1">Message:</p>
            <p class="text-gray-200 whitespace-pre-wrap">${message}</p>
        </div>
        <p class="mt-4 text-sm text-green-300">Thank you, ${name}, for reaching out! We will contact you soon.</p>
    `;

    // Inject the HTML content and show results
    resultsDiv.innerHTML = `<h3 class="text-xl font-bold text-green-400 mb-4 border-b border-gray-600 pb-2">Your Message Summary:</h3>` + content;
    resultsDiv.classList.remove('hidden');

    // Optional: Reset the form
    document.getElementById('contact-form').reset();
}

/**
 * Basic email validation check.
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
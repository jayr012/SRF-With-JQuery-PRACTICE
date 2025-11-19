$(document).ready(function() {

    // --- HELPER FUNCTIONS ---
    function setError(input, message) {
        input.addClass('error shake').removeClass('success');
        showError(input, message);
        setTimeout(() => input.removeClass('shake'), 200);
    }

    function setSuccess(input) {
        input.addClass('success').removeClass('error shake');
        removeError(input);
    }

    function showError(input, message) {
        let errorSpan = input.next('.error-msg');
        if (errorSpan.length === 0) {
            input.after(`<span class="error-msg">${message}</span>`);
        } else {
            errorSpan.text(message);
        }
    }

    function removeError(input) {
        input.next('.error-msg').remove();
    }

    // --- LETTER-ONLY FIELDS ---
    const letterFields = [
        {id: '#firstName', name: 'First Name', pattern: /^[A-Za-zÀ-ÖØ-öø-ÿ'-]+$/},
        {id: '#lastName', name: 'Last Name', pattern: /^[A-Za-z]+$/},
        {id: '#middleInitial', name: 'Middle Initial', pattern: /^[A-Za-z]+$/}
    ];

    letterFields.forEach(field => {
        $(field.id).on('input', function() {
            const val = $(this).val().trim();
            val && field.pattern.test(val) ? setSuccess($(this)) : removeError($(this));
        }).on('blur', function() {
            const val = $(this).val().trim();
            if (!val) setError($(this), `Enter your ${field.name} is required`);
            else if (!field.pattern.test(val)) {
                const msg = field.id === '#firstName'
                    ? `${field.name} must contain letters, hyphens, or apostrophes only`
                    : `${field.name} must contain letters only`;
                setError($(this), msg);
            } else setSuccess($(this));
        });
    });

    // --- NUMBER-ONLY FIELDS ---
    const numberFields = [
        {id: '#contactNumber', name: 'Contact Number', pattern: /^\d+$/}
    ];

    numberFields.forEach(field => {
        $(field.id).on('input', function() {
            const val = $(this).val().trim();
            val && field.pattern.test(val) ? setSuccess($(this)) : removeError($(this));
        }).on('blur', function() {
            const val = $(this).val().trim();
            if (!val) setError($(this), `Enter your ${field.name} is required`);
            else if (!field.pattern.test(val)) setError($(this), `${field.name} must contain numbers only`);
            else setSuccess($(this));
        });
    });

// --- CONTACT NUMBER VALIDATION --- 
$("#contactNumber").on("input", function() {
    let value = this.value.replace(/[^0-9]/g, ""); // Remove non-digits
    
    // Limit the number of digits to 11
    this.value = value.slice(0, 11);

    // Check if the first two digits are "09", if not, show the error message
    if (value && !value.startsWith("09")) {
        setError($(this), "Contact Number should start with 09-000-000-000");
    } else {
        removeError($(this)); // Remove error if the number starts with "09"
    }
}).on("blur", function() {
    const val = $(this).val().trim();
    
    // If the contact number is empty, show an error
    if (!val) {
        setError($(this), "Enter your Contact Number is required");
    }
    // If the number does not start with "09", show the specific error
    else if (!val.startsWith("09")) {
        setError($(this), "Contact Number should start with 09-000-000-000");
    }
    // If the number contains anything other than digits, show the error
    else if (!/^\d{11}$/.test(val)) {
        setError($(this), "Contact Number must contain numbers only");
    } else {
        setSuccess($(this)); // If it's valid, mark it as success
    }
});


    // --- STUDENT ID VALIDATION (22–25 only) ---
    $("#studentID").on("input", function () {
        let value = this.value.replace(/[^0-9]/g, ""); // remove non-digits

        // Auto-insert hyphen after first 2 digits if typing
        if (value.length > 2) {
            value = value.substring(0, 2) + "-" + value.substring(2, 7);
        }

        // Limit total length to YY-00000
        this.value = value.slice(0, 8);

        // Optional: live year validation without blocking deletion
        const year = value.substring(0, 2);
        if (year && !["22", "23", "24", "25"].includes(year)) {
            setError($(this), "Year must be 22–25 only");
        } else {
            removeError($(this));
        }
    }).on("blur", function () {
        const val = $(this).val().trim();
        if (!val) {
            setError($(this), "Enter your Student ID is required");
        } else if (!/^(22|23|24|25)-\d{5}$/.test(val)) {
            setError($(this), "Student ID must follow YY-00000 (allowed: 22–25 only)");
        } else setSuccess($(this));
    });

    // --- SELECT FIELDS ---
    const selectFields = [
        {id: '#course', name: 'Course'},
        {id: '#yearLevel', name: 'Year Level'},
        {id: '#gender', name: 'Gender'}
    ];

    selectFields.forEach(field => {
        $(field.id).on('blur change', function() {
            const val = $(this).val();
            val ? setSuccess($(this)) : setError($(this), `Enter your ${field.name} is required`);
        });
    });

    // --- DATE FIELD ---
    $('#dob').on('input', function() {
        $(this).val().trim() ? setSuccess($(this)) : removeError($(this));
    }).on('blur', function() {
        $(this).val().trim() ? setSuccess($(this)) : setError($(this), 'Enter your Date of Birth is required');
    });

    // --- TERMS CHECKBOX ---
    $('#terms').on('change', function() {
        this.checked ? setSuccess($(this)) : setError($(this), 'You must accept the terms');
    });

    // --- FORM SUBMISSION ---
    $('form').on('submit', function(e) {
        e.preventDefault();

        letterFields.forEach(f => $(f.id).trigger('blur'));
        numberFields.forEach(f => $(f.id).trigger('blur'));
        selectFields.forEach(f => $(f.id).trigger('blur'));
        $('#dob').trigger('blur');
        $('#terms').trigger('change');
        $('#studentID').trigger('blur');

        if ($('.form-group .error').length > 0 || !$('#terms').is(':checked')) {
            alert('Please fix all errors before submitting.');
            return;
        }

        $('#successMessage')
            .html('<i class="fas fa-check-circle"></i> Registration submitted successfully! You will receive a confirmation email shortly.')
            .addClass('show');

        $(this)[0].reset();
        $('input, select').removeClass('success');
    });

});

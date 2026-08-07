/**
 * signup.js — Multi-Step Animated Stepper + Django Integration
 */

document.addEventListener('DOMContentLoaded', () => {

    let currentStep = 1;
    const totalSteps = 5;

    const stepperTitle = document.getElementById('stepperTitle');
    const stepperDesc = document.getElementById('stepperDesc');
    const stepperProgressLine = document.getElementById('stepperProgressLine');

    const steps = document.querySelectorAll('#signupStepper .stepper-step');
    const stepPanes = document.querySelectorAll('.step-pane');

    const btnPrevStep = document.getElementById('btnPrevStep');
    const btnNextStep = document.getElementById('btnNextStep');
    const btnSubmit = document.getElementById('btnSignupSubmit');

    const signupForm = document.getElementById('signupForm');

    const stepMeta = {

        1: {
            title: 'Create your account',
            desc: 'Step 1: Account Information'
        },

        2: {
            title: 'Configure your workspace',
            desc: 'Step 2: Workspace & Domain Setup'
        },

        3: {
            title: 'Connect AI providers',
            desc: 'Step 3: Primary Provider Selection'
        },

        4: {
            title: 'Customize preferences',
            desc: 'Step 4: LLM Parameters & Alerts'
        },

        5: {
            title: 'Complete setup',
            desc: 'Step 5: Finish & Launch Studio'
        }

    };



    /* ===========================
       STEP NAVIGATION
    =========================== */

    function goToStep(targetStep) {

        if (targetStep < 1 || targetStep > totalSteps)
            return;

        currentStep = targetStep;

        stepperTitle.textContent = stepMeta[currentStep].title;
        stepperDesc.textContent = stepMeta[currentStep].desc;

        stepperProgressLine.style.width =
            `${(currentStep - 1) * 25}%`;

        steps.forEach((stepEl, index) => {

            const number = index + 1;

            if (number < currentStep) {

                stepEl.className = 'stepper-step completed';
                stepEl.innerHTML =
                    `<i class="bi bi-check-lg"></i>`;

            }

            else if (number === currentStep) {

                stepEl.className = 'stepper-step active';

            }

            else {

                stepEl.className = 'stepper-step';

            }

        });


        stepPanes.forEach((pane, index) => {

            if (index + 1 === currentStep) {

                pane.classList.remove('d-none');
                pane.classList.add('active');

            }

            else {

                pane.classList.add('d-none');
                pane.classList.remove('active');

            }

        });


        if (currentStep === 1)
            btnPrevStep.classList.add('d-none');

        else
            btnPrevStep.classList.remove('d-none');


        if (currentStep === totalSteps) {

            btnNextStep.classList.add('d-none');
            btnSubmit.classList.remove('d-none');

            updateSummary();

        }

        else {

            btnNextStep.classList.remove('d-none');
            btnSubmit.classList.add('d-none');

        }

    }



    /* ===========================
       VALIDATION
    =========================== */

    function validateCurrentStep() {

        if (currentStep === 1) {

            const fullName =
                document.getElementById("fullName");

            const email =
                document.getElementById("signupEmail");

            const password =
                document.getElementById("signupPassword");

            let valid = true;

            if (!fullName.value.trim()) {

                fullName.classList.add("is-invalid");
                valid = false;

            }

            else {

                fullName.classList.remove("is-invalid");

            }


            if (
                !email.value.trim() ||
                !email.value.includes("@")
            ) {

                email.classList.add("is-invalid");
                valid = false;

            }

            else {

                email.classList.remove("is-invalid");

            }


            if (password.value.length < 8) {

                password.classList.add("is-invalid");
                valid = false;

            }

            else {

                password.classList.remove("is-invalid");

            }


            return valid;

        }


        if (currentStep === 2) {

            const workspace =
                document.getElementById("workspaceName");

            if (!workspace.value.trim()) {

                workspace.classList.add("is-invalid");
                return false;

            }

            workspace.classList.remove("is-invalid");

        }

        return true;

    }



    /* ===========================
       NEXT BUTTON
    =========================== */

    btnNextStep.addEventListener("click", () => {

        if (validateCurrentStep()) {

            goToStep(currentStep + 1);

        }

    });



    /* ===========================
       PREVIOUS BUTTON
    =========================== */

    btnPrevStep.addEventListener("click", () => {

        goToStep(currentStep - 1);

    });
    steps.forEach(step => {

        step.addEventListener("click", () => {

            const target =
                parseInt(step.dataset.step);

            if (
                target < currentStep ||
                validateCurrentStep()
            ) {

                goToStep(target);

            }

        });

    });
        /* ===========================
       WORKSPACE SLUG
    =========================== */

    const workspaceInput =
        document.getElementById("workspaceName");

    const workspaceSlug =
        document.getElementById("workspaceSlug");

    if (workspaceInput && workspaceSlug) {

        workspaceInput.addEventListener("input", () => {

            const slug = workspaceInput.value
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");

            workspaceSlug.value =
                slug || "my-workspace";

        });

    }



    /* ===========================
       AI PROVIDER SELECTOR
    =========================== */

    const providerOptions =
        document.querySelectorAll(".provider-option");

    providerOptions.forEach(option => {

        option.addEventListener("click", () => {

            providerOptions.forEach(item => {

                item.classList.remove("active");

                const icon = item.querySelector("i");

                if (icon) {

                    icon.className =
                        "bi bi-circle text-secondary-body fs-5";

                }

            });

            option.classList.add("active");

            const icon =
                option.querySelector("i");

            if (icon) {

                icon.className =
                    "bi bi-check-circle-fill text-cyan fs-5";

            }

        });

    });



    /* ===========================
       TEMPERATURE SLIDER
    =========================== */

    const tempSlider =
        document.getElementById("prefTempRange");

    const tempLabel =
        document.getElementById("prefTempLabel");

    if (tempSlider && tempLabel) {

        const updateTemperature = () => {

            tempLabel.textContent =
                Number(tempSlider.value).toFixed(2);

        };

        updateTemperature();

        tempSlider.addEventListener(
            "input",
            updateTemperature
        );

    }



    /* ===========================
       SUMMARY
    =========================== */

    function updateSummary() {

        document.getElementById("sumName").textContent =
            document.getElementById("fullName").value ||
            "Alex Vance";

        document.getElementById("sumWorkspace").textContent =
            document.getElementById("workspaceName").value ||
            "My Workspace";

        const activeProvider =
            document.querySelector(
                ".provider-option.active .fw-bold"
            );

        document.getElementById("sumProvider").textContent =
            activeProvider
                ? activeProvider.textContent
                : "ChatGPT-4o";

    }



    /* ===========================
       SIGNUP SUBMIT
    =========================== */

    signupForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();

            const terms =
                document.getElementById("termsCheck");

            if (!terms.checked) {

                terms.classList.add("is-invalid");

                alert(
                    "Please accept Terms & Conditions."
                );

                return;

            }

            terms.classList.remove("is-invalid");

            btnSubmit.disabled = true;

            btnSubmit.innerHTML =
                `<i class="bi bi-arrow-repeat spin-icon me-2"></i> Creating Account...`;



            const fullName =
                document.getElementById("fullName")
                .value
                .trim();

            const email =
                document.getElementById("signupEmail")
                .value
                .trim();

            const password =
                document.getElementById("signupPassword")
                .value;

            const username = fullName
                .toLowerCase()
                .replace(/\s+/g, "_");
                            try {

                const response = await fetch(
                    `${API_BASE_URL}/accounts/register/`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({

                            username: username,

                            email: email,

                            password: password

                        })

                    }
                );

                const data = await response.json();

                if (response.ok) {

                    if (typeof window.showToast === "function") {

                        window.showToast(
                            "Account created successfully!",
                            "success",
                            "Success"
                        );

                    } else {

                        alert("Account created successfully!");

                    }

                    btnSubmit.innerHTML =
                        `<i class="bi bi-check-circle me-2"></i> Account Created`;

                    setTimeout(() => {

                        window.location.href = "login.html";

                    }, 1200);

                }

                else {

                    console.error(data);

                    let message = "Registration Failed";

                    if (data.username) {

                        message = data.username.join("\n");

                    }

                    else if (data.email) {

                        message = data.email.join("\n");

                    }

                    else if (data.password) {

                        message = data.password.join("\n");

                    }

                    else if (data.detail) {

                        message = data.detail;

                    }

                    if (typeof window.showToast === "function") {

                        window.showToast(
                            message,
                            "error",
                            "Registration Failed"
                        );

                    } else {

                        alert(message);

                    }

                    btnSubmit.disabled = false;

                    btnSubmit.innerHTML =
                        `Create Workspace & Launch`;

                }

            }

            catch (error) {

                console.error(error);

                if (typeof window.showToast === "function") {

                    window.showToast(
                        "Unable to connect to the server.",
                        "error",
                        "Server Error"
                    );

                } else {

                    alert("Server Error");

                }

                btnSubmit.disabled = false;

                btnSubmit.innerHTML =
                    `Create Workspace & Launch`;

            }

        }

    );



    /* ===========================
       INITIALIZE
    =========================== */
document.querySelectorAll(".reveal-item").forEach(item => {
    item.classList.add("revealed");
});

goToStep(1);

});
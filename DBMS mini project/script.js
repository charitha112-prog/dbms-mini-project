/* ============================================================
   CAMPUS KNOWLEDGE REPOSITORY
   UNIFIED FRONTEND SCRIPT
   ============================================================

   This file handles:
   - Login UI
   - Student / TPO role selection
   - Password visibility
   - Sidebar
   - Navigation
   - Logout
   - Search + filters
   - Contribution forms
   - Modals
   - Ratings
   - File selection
   - TPO placement management UI
   - Profile UI

   IMPORTANT:
   No fake database records are created here.

   Flask + MySQL API integration will be added later.
   ============================================================ */


/* ============================================================
   01. GLOBAL HELPERS
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    initializeLoginPage();
    initializeAppNavigation();
    initializeSidebar();
    initializeLogout();
    initializeDashboard();
    initializeInterviewPage();
    initializeHackathonPage();
    initializeClubPage();
    initializeResourcesPage();
    initializePlacementPage();
    initializeTpoPage();
    initializeProfilePage();

});


/* ============================================================
   UTILITY FUNCTIONS
   ============================================================ */

function getElement(id) {
    return document.getElementById(id);
}


function showElement(element) {
    if (!element) return;

    element.style.display = "";
}


function hideElement(element) {
    if (!element) return;

    element.style.display = "none";
}


function addClass(element, className) {
    if (element) {
        element.classList.add(className);
    }
}


function removeClass(element, className) {
    if (element) {
        element.classList.remove(className);
    }
}


function toggleClass(element, className) {
    if (element) {
        element.classList.toggle(className);
    }
}


function scrollToElement(element) {

    if (!element) return;

    element.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


function getInitial(name) {

    if (!name || !name.trim()) {
        return "—";
    }

    return name.trim().charAt(0).toUpperCase();

}


function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    const div = document.createElement("div");

    div.textContent = String(value);

    return div.innerHTML;

}


function normalizeText(value) {

    return String(value || "")
        .trim()
        .toLowerCase();

}


/* ============================================================
   02. LOGIN PAGE
   ============================================================ */

function initializeLoginPage() {

    const roleScreen = getElement("roleScreen");

    if (!roleScreen) {
        return;
    }


    const studentRoleButton =
        getElement("studentRoleButton");

    const tpoRoleButton =
        getElement("tpoRoleButton");

    const studentLoginScreen =
        getElement("studentLoginScreen");

    const tpoLoginScreen =
        getElement("tpoLoginScreen");


    /* --------------------------------------------
       STUDENT ROLE
    -------------------------------------------- */

    if (studentRoleButton) {

        studentRoleButton.addEventListener("click", () => {

            hideLoginScreen(roleScreen);

            showLoginScreen(studentLoginScreen);

        });

    }


    /* --------------------------------------------
       TPO ROLE
    -------------------------------------------- */

    if (tpoRoleButton) {

        tpoRoleButton.addEventListener("click", () => {

            hideLoginScreen(roleScreen);

            showLoginScreen(tpoLoginScreen);

        });

    }


    /* --------------------------------------------
       BACK BUTTONS
    -------------------------------------------- */

    document
        .querySelectorAll(".back-button")
        .forEach(button => {

            button.addEventListener("click", () => {

                hideLoginScreen(studentLoginScreen);

                hideLoginScreen(tpoLoginScreen);

                showLoginScreen(roleScreen);

                clearLoginErrors();

            });

        });


    initializePasswordToggle(
        "studentPassword",
        "studentPasswordToggle"
    );


    initializePasswordToggle(
        "tpoPassword",
        "tpoPasswordToggle"
    );


    initializeStudentLogin();

    initializeTpoLogin();

}


function showLoginScreen(screen) {

    if (!screen) return;

    screen.style.display = "block";

}


function hideLoginScreen(screen) {

    if (!screen) return;

    screen.style.display = "none";

}


/* ============================================================
   PASSWORD TOGGLE
   ============================================================ */

function initializePasswordToggle(inputId, buttonId) {

    const input = getElement(inputId);
    const button = getElement(buttonId);

    if (!input || !button) {
        return;
    }


    button.addEventListener("click", () => {

        const isPassword =
            input.type === "password";

        input.type =
            isPassword ? "text" : "password";

        button.setAttribute(
            "aria-label",
            isPassword
                ? "Hide password"
                : "Show password"
        );

    });

}


/* ============================================================
   STUDENT LOGIN
   ============================================================ */

function initializeStudentLogin() {

    const form =
        getElement("studentLoginForm");

    if (!form) {
        return;
    }


    form.addEventListener("submit", event => {

        event.preventDefault();

        clearLoginErrors();


        const username =
            getElement("studentUsername")?.value.trim();

        const email =
            getElement("studentEmail")?.value.trim();

        const password =
            getElement("studentPassword")?.value;


        /*
         * FRONTEND VALIDATION ONLY
         *
         * Actual authentication will later happen
         * through Flask + MySQL.
         */

        if (!username || !email || !password) {

            showLoginError(
                "Please enter your name, email and password."
            );

            return;
        }


        if (!isValidEmail(email)) {

            showLoginError(
                "Please enter a valid email address."
            );

            return;
        }


        /*
         * Temporary frontend success state.
         *
         * This does NOT authenticate against a database.
         * Flask authentication will replace this section.
         */

        showLoginSuccess("student");

    });

}


/* ============================================================
   TPO LOGIN
   ============================================================ */

function initializeTpoLogin() {

    const form =
        getElement("tpoLoginForm");

    if (!form) {
        return;
    }


    form.addEventListener("submit", event => {

        event.preventDefault();

        clearLoginErrors();


        const username =
            getElement("tpoUsername")?.value.trim();

        const password =
            getElement("tpoPassword")?.value;

        const verificationId =
            getElement("tpoVerificationId")?.value.trim();


        if (!username || !password || !verificationId) {

            showLoginError(
                "Please enter your username, password and verification ID."
            );

            return;
        }


        /*
         * IMPORTANT:
         *
         * Verification ID must eventually be checked
         * against the ADMIN_TPO table through Flask.
         *
         * It is NOT hardcoded here.
         */

        showLoginSuccess("tpo");

    });

}


/* ============================================================
   LOGIN VALIDATION
   ============================================================ */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}


function showLoginError(message) {

    const errorModal =
        getElement("loginErrorModal");

    const errorText =
        errorModal?.querySelector(
            "[data-login-error-message]"
        );


    if (errorText) {

        errorText.textContent = message;

    }


    if (errorModal) {

        addClass(errorModal, "active");

    }

    else {

        const errorContainer =
            document.querySelector(".login-error");

        if (errorContainer) {

            errorContainer.textContent = message;

            errorContainer.style.display = "block";

        }

    }

}


function clearLoginErrors() {

    const errorModal =
        getElement("loginErrorModal");

    if (errorModal) {

        removeClass(errorModal, "active");

    }


    document
        .querySelectorAll(".login-error")
        .forEach(error => {

            error.style.display = "none";

        });

}


/* ============================================================
   LOGIN SUCCESS
   ============================================================ */

function showLoginSuccess(role) {

    const statusLayer =
        getElement("loginStatusLayer");

    const successModal =
        getElement("loginSuccessModal");


    if (statusLayer) {

        addClass(statusLayer, "active");

    }


    if (successModal) {

        addClass(successModal, "active");

    }


    const continueButton =
        getElement("continueAfterLoginButton");


    if (continueButton) {

        continueButton.onclick = () => {

            if (role === "tpo") {

                window.location.href =
                    "tpo.html";

            }

            else {

                window.location.href =
                    "dashboard.html";

            }

        };

    }


    /*
     * Store only the frontend role for now.
     *
     * Flask will later create the actual session.
     */

    try {

        sessionStorage.setItem(
            "ckr_user_role",
            role
        );

    }

    catch (error) {

        console.warn(
            "Session storage unavailable."
        );

    }

}


/* ============================================================
   LOGIN ERROR MODAL
   ============================================================ */

document.addEventListener("click", event => {

    if (
        event.target &&
        event.target.id === "tryAgainButton"
    ) {

        const statusLayer =
            getElement("loginStatusLayer");

        const errorModal =
            getElement("loginErrorModal");

        if (statusLayer) {
            removeClass(statusLayer, "active");
        }

        if (errorModal) {
            removeClass(errorModal, "active");
        }

    }

});


/* ============================================================
   03. APPLICATION NAVIGATION
   ============================================================ */

function initializeAppNavigation() {

    /*
     * Sidebar links are regular HTML links.
     *
     * We only add visual behavior here.
     */

    document
        .querySelectorAll(".sidebar-link[href]")
        .forEach(link => {

            link.addEventListener("click", () => {

                closeSidebar();

            });

        });


    /*
     * Profile button
     */

    const profileButton =
        getElement("profileButton");

    if (profileButton) {

        profileButton.addEventListener("click", () => {

            window.location.href =
                "profile.html";

        });

    }

}


/* ============================================================
   04. SIDEBAR
   ============================================================ */

function initializeSidebar() {

    const sidebar =
        getElement("studentSidebar") ||
        getElement("tpoSidebar");

    const toggle =
        getElement("sidebarToggle");

    if (!sidebar || !toggle) {
        return;
    }


    toggle.addEventListener("click", () => {

        toggleClass(
            sidebar,
            "open"
        );

    });


    /*
     * Close sidebar when clicking outside
     * on smaller screens.
     */

    document.addEventListener("click", event => {

        if (window.innerWidth > 700) {
            return;
        }


        if (
            sidebar.classList.contains("open") &&
            !sidebar.contains(event.target) &&
            !toggle.contains(event.target)
        ) {

            closeSidebar();

        }

    });

}


function closeSidebar() {

    const sidebar =
        getElement("studentSidebar") ||
        getElement("tpoSidebar");

    if (!sidebar) {
        return;
    }

    removeClass(
        sidebar,
        "open"
    );

}


/* ============================================================
   05. LOGOUT
   ============================================================ */

function initializeLogout() {

    const logoutButton =
        getElement("logoutButton");

    const logoutModal =
        getElement("logoutModal");

    const closeButton =
        getElement("logoutModalClose");

    const cancelButton =
        getElement("cancelLogout");

    const confirmButton =
        getElement("confirmLogout");


    if (logoutButton && logoutModal) {

        logoutButton.addEventListener(
            "click",
            () => {

                addClass(
                    logoutModal,
                    "active"
                );

            }
        );

    }


    if (closeButton && logoutModal) {

        closeButton.addEventListener(
            "click",
            () => {

                removeClass(
                    logoutModal,
                    "active"
                );

            }
        );

    }


    if (cancelButton && logoutModal) {

        cancelButton.addEventListener(
            "click",
            () => {

                removeClass(
                    logoutModal,
                    "active"
                );

            }
        );

    }


    if (confirmButton) {

        confirmButton.addEventListener(
            "click",
            () => {

                try {

                    sessionStorage.removeItem(
                        "ckr_user_role"
                    );

                }

                catch (error) {

                    console.warn(
                        "Session storage unavailable."
                    );

                }


                /*
                 * Flask session logout will later
                 * be called here.
                 */

                window.location.href =
                    "index.html";

            }
        );

    }


    if (logoutModal) {

        logoutModal.addEventListener(
            "click",
            event => {

                if (
                    event.target === logoutModal
                ) {

                    removeClass(
                        logoutModal,
                        "active"
                    );

                }

            }
        );

    }

}


/* ============================================================
   06. DASHBOARD
   ============================================================ */

function initializeDashboard() {

    const dashboard =
        getElement("dashboardStudentName");

    if (!dashboard) {
        return;
    }


    /*
     * Until Flask provides the actual student,
     * keep the interface neutral.
     */

    dashboard.textContent =
        "Welcome back";


    const knowledgePoints =
        getElement("knowledgePoints");

    const progress =
        getElement("knowledgeProgress");

    const progressValue =
        getElement("knowledgeProgressValue");


    if (knowledgePoints) {

        knowledgePoints.textContent =
            "0";

    }


    if (progress) {

        progress.style.width =
            "0%";

    }


    if (progressValue) {

        progressValue.textContent =
            "0 / 100";

    }


    /*
     * Explore cards
     */

    document
        .querySelectorAll("[data-page]")
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    const page =
                        card.dataset.page;

                    if (page) {

                        window.location.href =
                            page;

                    }

                }
            );

        });

}


/* ============================================================
   07. INTERVIEW PAGE
   ============================================================ */

function initializeInterviewPage() {

    const page =
        getElement("interviewCardGrid");

    if (!page) {
        return;
    }


    const search =
        getElement("interviewSearch");

    const companyFilter =
        getElement("interviewCompanyFilter");

    const roleFilter =
        getElement("interviewRoleFilter");

    const yearFilter =
        getElement("interviewYearFilter");

    const typeFilter =
        getElement("interviewTypeFilter");

    const clearButton =
        getElement("clearInterviewFilters");

    const addButton =
        getElement("interviewAddButton");

    const emptyShareButton =
        getElement("emptyInterviewShareButton");

    const shareSection =
        getElement("shareInterviewSection");


    /*
     * Search
     */

    if (search) {

        search.addEventListener(
            "input",
            filterInterviewCards
        );

    }


    [
        companyFilter,
        roleFilter,
        yearFilter,
        typeFilter
    ].forEach(filter => {

        if (filter) {

            filter.addEventListener(
                "change",
                filterInterviewCards
            );

        }

    });


    /*
     * Clear
     */

    if (clearButton) {

        clearButton.addEventListener(
            "click",
            () => {

                if (search) {
                    search.value = "";
                }

                if (companyFilter) {
                    companyFilter.value = "";
                }

                if (roleFilter) {
                    roleFilter.value = "";
                }

                if (yearFilter) {
                    yearFilter.value = "";
                }

                if (typeFilter) {
                    typeFilter.value = "";
                }

                filterInterviewCards();

            }
        );

    }


    /*
     * Add button
     */

    if (addButton) {

        addButton.addEventListener(
            "click",
            () => {

                scrollToElement(
                    shareSection
                );

            }
        );

    }


    if (emptyShareButton) {

        emptyShareButton.addEventListener(
            "click",
            () => {

                scrollToElement(
                    shareSection
                );

            }
        );

    }


    /*
     * Interview form
     */

    const form =
        getElement("interviewForm");

    if (form) {

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                /*
                 * Flask API integration will be added later.
                 */

                showFormStatus(
                    form,
                    "Your interview experience is ready to be submitted."
                );

            }
        );

    }


    initializeInterviewDetailsModal();

}


function filterInterviewCards() {

    /*
     * Actual cards will be populated by Flask/MySQL.
     *
     * This function intentionally does not generate
     * fake interview records.
     */

    const grid =
        getElement("interviewCardGrid");

    const emptyState =
        getElement("interviewEmptyState");

    if (!grid) {
        return;
    }


    const cards =
        Array.from(
            grid.querySelectorAll(
                ".content-card, .interview-card"
            )
        );


    if (cards.length === 0) {

        if (emptyState) {
            emptyState.style.display = "";
        }

        return;

    }


    const search =
        normalizeText(
            getElement("interviewSearch")?.value
        );

    const company =
        normalizeText(
            getElement("interviewCompanyFilter")?.value
        );

    const role =
        normalizeText(
            getElement("interviewRoleFilter")?.value
        );

    const year =
        normalizeText(
            getElement("interviewYearFilter")?.value
        );

    const type =
        normalizeText(
            getElement("interviewTypeFilter")?.value
        );


    let visibleCount = 0;


    cards.forEach(card => {

        const text =
            normalizeText(
                card.textContent
            );

        const matchesSearch =
            !search ||
            text.includes(search);

        const matchesCompany =
            !company ||
            text.includes(company);

        const matchesRole =
            !role ||
            text.includes(role);

        const matchesYear =
            !year ||
            text.includes(year);

        const matchesType =
            !type ||
            text.includes(type);


        const visible =
            matchesSearch &&
            matchesCompany &&
            matchesRole &&
            matchesYear &&
            matchesType;


        card.style.display =
            visible ? "" : "none";


        if (visible) {
            visibleCount++;
        }

    });


    if (emptyState) {

        emptyState.style.display =
            visibleCount === 0
                ? ""
                : "none";

    }

}


/* ============================================================
   INTERVIEW DETAILS MODAL
   ============================================================ */

function initializeInterviewDetailsModal() {

    const modal =
        getElement("interviewDetailsModal");

    if (!modal) {
        return;
    }


    const closeTop =
        getElement("closeInterviewDetails");

    const closeBottom =
        getElement("closeInterviewDetailsBottom");


    [closeTop, closeBottom].forEach(button => {

        if (button) {

            button.addEventListener(
                "click",
                () => {

                    removeClass(
                        modal,
                        "active"
                    );

                }
            );

        }

    });


    modal.addEventListener(
        "click",
        event => {

            if (event.target === modal) {

                removeClass(
                    modal,
                    "active"
                );

            }

        }
    );

}


/* ============================================================
   08. HACKATHON PAGE
   ============================================================ */

function initializeHackathonPage() {

    const grid =
        getElement("hackathonCardGrid");

    if (!grid) {
        return;
    }


    const search =
        getElement("hackathonSearch");

    const filters = [
        "hackathonNameFilter",
        "hackathonRoleFilter",
        "hackathonSemesterFilter",
        "hackathonParticipationFilter",
        "hackathonTechnologyFilter",
        "hackathonYearFilter"
    ];


    if (search) {

        search.addEventListener(
            "input",
            filterHackathons
        );

    }


    filters.forEach(id => {

        const filter = getElement(id);

        if (filter) {

            filter.addEventListener(
                "change",
                filterHackathons
            );

        }

    });


    const clearButton =
        getElement("clearHackathonFilters");


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            () => {

                if (search) {
                    search.value = "";
                }

                filters.forEach(id => {

                    const filter =
                        getElement(id);

                    if (filter) {
                        filter.value = "";
                    }

                });

                filterHackathons();

            }
        );

    }


    /*
     * Add button
     */

    const addButton =
        getElement("hackathonAddButton");

    const emptyShare =
        getElement("emptyHackathonShareButton");

    const shareSection =
        getElement("shareHackathonSection");


    [addButton, emptyShare].forEach(button => {

        if (button) {

            button.addEventListener(
                "click",
                () => {

                    scrollToElement(
                        shareSection
                    );

                }
            );

        }

    });


    /*
     * Participation type
     */

    const participation =
        getElement("hackathonParticipation");

    const teamSizeField =
        getElement("teamSizeField");

    const teamSize =
        getElement("hackathonTeamSize");


    if (participation) {

        participation.addEventListener(
            "change",
            () => {

                const isGroup =
                    participation.value === "Group";


                if (teamSizeField) {

                    teamSizeField.style.display =
                        isGroup ? "" : "none";

                }


                if (teamSize) {

                    teamSize.disabled =
                        !isGroup;

                    if (!isGroup) {
                        teamSize.value = "";
                    }

                }

            }
        );

    }


    /*
     * Form
     */

    const form =
        getElement("hackathonForm");

    if (form) {

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                showFormStatus(
                    form,
                    "Your hackathon experience is ready to be submitted."
                );

            }
        );

    }


    initializeHackathonDetailsModal();

}


function filterHackathons() {

    const grid =
        getElement("hackathonCardGrid");

    const emptyState =
        getElement("hackathonEmptyState");

    if (!grid) {
        return;
    }


    const cards =
        Array.from(
            grid.querySelectorAll(
                ".content-card, .hackathon-card"
            )
        );


    if (cards.length === 0) {

        if (emptyState) {
            emptyState.style.display = "";
        }

        return;

    }


    const search =
        normalizeText(
            getElement("hackathonSearch")?.value
        );


    const filters = [
        "hackathonNameFilter",
        "hackathonRoleFilter",
        "hackathonSemesterFilter",
        "hackathonParticipationFilter",
        "hackathonTechnologyFilter",
        "hackathonYearFilter"
    ];


    let visibleCount = 0;


    cards.forEach(card => {

        const text =
            normalizeText(
                card.textContent
            );


        const matchesSearch =
            !search ||
            text.includes(search);


        const matchesFilters =
            filters.every(id => {

                const value =
                    normalizeText(
                        getElement(id)?.value
                    );

                return !value ||
                    text.includes(value);

            });


        const visible =
            matchesSearch &&
            matchesFilters;


        card.style.display =
            visible ? "" : "none";


        if (visible) {
            visibleCount++;
        }

    });


    if (emptyState) {

        emptyState.style.display =
            visibleCount === 0
                ? ""
                : "none";

    }

}


function initializeHackathonDetailsModal() {

    const modal =
        getElement("hackathonDetailsModal");

    if (!modal) {
        return;
    }


    const closeTop =
        getElement("closeHackathonDetails");

    const closeBottom =
        getElement("closeHackathonDetailsBottom");


    [closeTop, closeBottom].forEach(button => {

        if (button) {

            button.addEventListener(
                "click",
                () => {

                    removeClass(
                        modal,
                        "active"
                    );

                }
            );

        }

    });


    modal.addEventListener(
        "click",
        event => {

            if (event.target === modal) {

                removeClass(
                    modal,
                    "active"
                );

            }

        }
    );

}


/* ============================================================
   09. CLUB PAGE
   ============================================================ */

function initializeClubPage() {

    const grid =
        getElement("clubCardGrid");

    if (!grid) {
        return;
    }


    initializeClubReviewModal();

    initializeClubReviewForm();

}


/* ============================================================
   CLUB REVIEW MODAL
   ============================================================ */

function initializeClubReviewModal() {

    const modal =
        getElement("clubReviewsModal");

    const close =
        getElement("closeClubReviews");

    const writeButton =
        getElement("clubWriteReviewButton");


    if (!modal) {
        return;
    }


    if (close) {

        close.addEventListener(
            "click",
            () => {

                removeClass(
                    modal,
                    "active"
                );

            }
        );

    }


    modal.addEventListener(
        "click",
        event => {

            if (event.target === modal) {

                removeClass(
                    modal,
                    "active"
                );

            }

        }
    );


    if (writeButton) {

        writeButton.addEventListener(
            "click",
            () => {

                removeClass(
                    modal,
                    "active"
                );

                openClubReviewForm();

            }
        );

    }

}


/* ============================================================
   CLUB REVIEW FORM
   ============================================================ */

function initializeClubReviewForm() {

    const modal =
        getElement("clubReviewFormModal");

    const close =
        getElement("closeClubReviewForm");

    const cancel =
        getElement("cancelClubReview");

    const form =
        getElement("clubReviewForm");


    if (!modal) {
        return;
    }


    [close, cancel].forEach(button => {

        if (button) {

            button.addEventListener(
                "click",
                () => {

                    removeClass(
                        modal,
                        "active"
                    );

                }
            );

        }

    });


    initializeClubRatingSelector();


    if (form) {

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const rating =
                    getElement("clubRating")?.value;

                const text =
                    getElement("clubReviewText")?.value.trim();


                if (!rating) {

                    showFormStatus(
                        form,
                        "Please select a rating."
                    );

                    return;

                }


                if (!text) {

                    showFormStatus(
                        form,
                        "Please enter your review."
                    );

                    return;

                }


                showFormStatus(
                    form,
                    "Your club review is ready to be submitted."
                );

            }
        );

    }

}


function openClubReviewForm() {

    const modal =
        getElement("clubReviewFormModal");

    if (modal) {

        addClass(
            modal,
            "active"
        );

    }

}


/* ============================================================
   CLUB RATING
   ============================================================ */

function initializeClubRatingSelector() {

    const selector =
        getElement("clubRatingSelector");

    const hiddenRating =
        getElement("clubRating");


    if (!selector) {
        return;
    }


    const stars =
        selector.querySelectorAll(
            ".rating-star"
        );


    stars.forEach(star => {

        star.addEventListener(
            "click",
            () => {

                const value =
                    star.dataset.rating ||
                    star.getAttribute("data-rating");


                if (hiddenRating) {

                    hiddenRating.value =
                        value || "";

                }


                stars.forEach(item => {

                    const itemValue =
                        Number(
                            item.dataset.rating
                        );


                    item.classList.toggle(
                        "active",
                        itemValue <= Number(value)
                    );

                });

            }
        );

    });

}


/* ============================================================
   10. RESOURCES PAGE
   ============================================================ */

function initializeResourcesPage() {

    const grid =
        getElement("resourceCardGrid");

    if (!grid) {
        return;
    }


    const search =
        getElement("resourceSearch");

    const subjectFilter =
        getElement("resourceSubjectFilter");

    const semesterFilter =
        getElement("resourceSemesterFilter");

    const clearButton =
        getElement("clearResourceFilters");


    if (search) {

        search.addEventListener(
            "input",
            filterResources
        );

    }


    [subjectFilter, semesterFilter]
        .forEach(filter => {

            if (filter) {

                filter.addEventListener(
                    "change",
                    filterResources
                );

            }

        });


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            () => {

                if (search) {
                    search.value = "";
                }

                if (subjectFilter) {
                    subjectFilter.value = "";
                }

                if (semesterFilter) {
                    semesterFilter.value = "";
                }

                filterResources();

            }
        );

    }


    /*
     * Upload buttons
     */

    const topButton =
        getElement("resourceUploadTopButton");

    const emptyButton =
        getElement("emptyResourceUploadButton");

    const uploadSection =
        getElement("uploadResourceSection");


    [topButton, emptyButton]
        .forEach(button => {

            if (button) {

                button.addEventListener(
                    "click",
                    () => {

                        scrollToElement(
                            uploadSection
                        );

                    }
                );

            }

        });


    initializeResourceFileUpload();

    initializeResourceForm();

    initializeResourceDetailsModal();

}


function filterResources() {

    const grid =
        getElement("resourceCardGrid");

    const emptyState =
        getElement("resourceEmptyState");

    if (!grid) {
        return;
    }


    const cards =
        Array.from(
            grid.querySelectorAll(
                ".content-card, .resource-card"
            )
        );


    if (cards.length === 0) {

        if (emptyState) {
            emptyState.style.display = "";
        }

        return;

    }


    const search =
        normalizeText(
            getElement("resourceSearch")?.value
        );


    const subject =
        normalizeText(
            getElement("resourceSubjectFilter")?.value
        );


    const semester =
        normalizeText(
            getElement("resourceSemesterFilter")?.value
        );


    let visibleCount = 0;


    cards.forEach(card => {

        const text =
            normalizeText(
                card.textContent
            );


        const visible =
            (!search || text.includes(search)) &&
            (!subject || text.includes(subject)) &&
            (!semester || text.includes(semester));


        card.style.display =
            visible ? "" : "none";


        if (visible) {
            visibleCount++;
        }

    });


    if (emptyState) {

        emptyState.style.display =
            visibleCount === 0
                ? ""
                : "none";

    }

}


/* ============================================================
   RESOURCE FILE UPLOAD
   ============================================================ */

function initializeResourceFileUpload() {

    const fileInput =
        getElement("resourceFile");

    const dropArea =
        getElement("resourceFileDropArea");

    const fileName =
        getElement("selectedResourceFileName");


    if (!fileInput) {
        return;
    }


    fileInput.addEventListener(
        "change",
        () => {

            updateSelectedResourceFile(
                fileInput,
                fileName
            );

        }
    );


    if (dropArea) {

        dropArea.addEventListener(
            "click",
            () => {

                fileInput.click();

            }
        );


        dropArea.addEventListener(
            "dragover",
            event => {

                event.preventDefault();

                addClass(
                    dropArea,
                    "drag-active"
                );

            }
        );


        dropArea.addEventListener(
            "dragleave",
            () => {

                removeClass(
                    dropArea,
                    "drag-active"
                );

            }
        );


        dropArea.addEventListener(
            "drop",
            event => {

                event.preventDefault();

                removeClass(
                    dropArea,
                    "drag-active"
                );


                const files =
                    event.dataTransfer.files;


                if (files.length > 0) {

                    /*
                     * Assigning FileList directly is not
                     * supported consistently, so we only
                     * show the selected file here.
                     *
                     * Actual upload will be handled by Flask.
                     */

                    if (fileName) {

                        fileName.textContent =
                            files[0].name;

                    }

                }

            }
        );

    }

}


function updateSelectedResourceFile(
    fileInput,
    fileNameElement
) {

    if (!fileInput || !fileNameElement) {
        return;
    }


    if (
        fileInput.files &&
        fileInput.files.length > 0
    ) {

        fileNameElement.textContent =
            fileInput.files[0].name;

    }

    else {

        fileNameElement.textContent =
            "";

    }

}


/* ============================================================
   RESOURCE FORM
   ============================================================ */

function initializeResourceForm() {

    const form =
        getElement("resourceForm");

    if (!form) {
        return;
    }


    const link =
        getElement("resourceLink");

    const file =
        getElement("resourceFile");


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const title =
                getElement("resourceTitle")?.value.trim();

            const subject =
                getElement("resourceSubject")?.value.trim();

            const description =
                getElement("resourceDescription")?.value.trim();


            if (!title) {

                showFormStatus(
                    form,
                    "Please enter a resource title."
                );

                return;

            }


            if (!subject) {

                showFormStatus(
                    form,
                    "Please enter the subject."
                );

                return;

            }


            if (!description) {

                showFormStatus(
                    form,
                    "Please enter a description."
                );

                return;

            }


            const hasLink =
                Boolean(
                    link?.value.trim()
                );


            const hasFile =
                Boolean(
                    file?.files?.length
                );


            if (!hasLink && !hasFile) {

                showFormStatus(
                    form,
                    "Please provide either a resource link or a file."
                );

                return;

            }


            showFormStatus(
                form,
                "Your resource is ready to be uploaded."
            );

        }
    );

}


/* ============================================================
   RESOURCE DETAILS MODAL
   ============================================================ */

function initializeResourceDetailsModal() {

    const modal =
        getElement("resourceDetailsModal");

    if (!modal) {
        return;
    }


    const close =
        getElement("closeResourceDetails");


    if (close) {

        close.addEventListener(
            "click",
            () => {

                removeClass(
                    modal,
                    "active"
                );

            }
        );

    }


    modal.addEventListener(
        "click",
        event => {

            if (event.target === modal) {

                removeClass(
                    modal,
                    "active"
                );

            }

        }
    );

}


/* ============================================================
   11. PLACEMENT PAGE
   ============================================================ */

function initializePlacementPage() {

    const grid =
        getElement("placementCardGrid");

    if (!grid) {
        return;
    }


    const search =
        getElement("placementSearch");

    const companyFilter =
        getElement("placementCompanyFilter");

    const roleFilter =
        getElement("placementRoleFilter");

    const clearButton =
        getElement("clearPlacementFilters");


    if (search) {

        search.addEventListener(
            "input",
            filterPlacements
        );

    }


    [companyFilter, roleFilter]
        .forEach(filter => {

            if (filter) {

                filter.addEventListener(
                    "change",
                    filterPlacements
                );

            }

        });


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            () => {

                if (search) {
                    search.value = "";
                }

                if (companyFilter) {
                    companyFilter.value = "";
                }

                if (roleFilter) {
                    roleFilter.value = "";
                }

                filterPlacements();

            }
        );

    }


    initializePlacementDetailsModal();

}


function filterPlacements() {

    const grid =
        getElement("placementCardGrid");

    const emptyState =
        getElement("placementEmptyState");

    if (!grid) {
        return;
    }


    const cards =
        Array.from(
            grid.querySelectorAll(
                ".placement-card, .content-card"
            )
        );


    if (cards.length === 0) {

        if (emptyState) {
            emptyState.style.display = "";
        }

        return;

    }


    const search =
        normalizeText(
            getElement("placementSearch")?.value
        );


    const company =
        normalizeText(
            getElement("placementCompanyFilter")?.value
        );


    const role =
        normalizeText(
            getElement("placementRoleFilter")?.value
        );


    let visibleCount = 0;


    cards.forEach(card => {

        const text =
            normalizeText(
                card.textContent
            );


        const visible =
            (!search || text.includes(search)) &&
            (!company || text.includes(company)) &&
            (!role || text.includes(role));


        card.style.display =
            visible ? "" : "none";


        if (visible) {
            visibleCount++;
        }

    });


    if (emptyState) {

        emptyState.style.display =
            visibleCount === 0
                ? ""
                : "none";

    }

}


/* ============================================================
   PLACEMENT DETAILS MODAL
   ============================================================ */

function initializePlacementDetailsModal() {

    const modal =
        getElement("placementDetailsModal");

    if (!modal) {
        return;
    }


    const close =
        getElement("closePlacementDetails");

    const closeBottom =
        getElement("closePlacementDetailsBottom");


    [close, closeBottom].forEach(button => {

        if (button) {

            button.addEventListener(
                "click",
                () => {

                    removeClass(
                        modal,
                        "active"
                    );

                }
            );

        }

    });


    modal.addEventListener(
        "click",
        event => {

            if (event.target === modal) {

                removeClass(
                    modal,
                    "active"
                );

            }

        }
    );

}


/* ============================================================
   12. TPO PAGE
   ============================================================ */

function initializeTpoPage() {

    const tpoPage =
        getElement("tpoPlacementForm");

    if (!tpoPage) {
        return;
    }


    initializeTpoAddForm();

    initializeTpoEditModal();

    initializeTpoSearch();

    initializeTpoSectionButtons();

}


/* ============================================================
   TPO ADD FORM
   ============================================================ */

function initializeTpoAddForm() {

    const form =
        getElement("tpoPlacementForm");

    const clearButton =
        getElement("cancelTpoPlacement");


    if (!form) {
        return;
    }


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            () => {

                form.reset();

                clearFormStatus(form);

            }
        );

    }


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const company =
                getElement("tpoCompanyName")?.value.trim();

            const role =
                getElement("tpoRole")?.value.trim();

            const packageValue =
                getElement("tpoPackage")?.value.trim();

            const deadline =
                getElement("tpoApplicationDeadline")?.value;

            const eligibility =
                getElement("tpoEligibility")?.value.trim();

            const selection =
                getElement("tpoSelectionProcess")?.value.trim();


            if (
                !company ||
                !role ||
                !packageValue ||
                !deadline ||
                !eligibility ||
                !selection
            ) {

                showFormStatus(
                    form,
                    "Please complete all required fields."
                );

                return;

            }


            /*
             * Actual INSERT will later go to Flask.
             */

            showFormStatus(
                form,
                "Placement information is ready to be published."
            );

        }
    );

}


/* ============================================================
   TPO SECTION BUTTONS
   ============================================================ */

function initializeTpoSectionButtons() {

    const addButton =
        getElement("tpoAddPlacementButton");

    const viewButton =
        getElement("tpoViewPlacementButton");

    const emptyAddButton =
        getElement("emptyTpoAddButton");

    const addSection =
        getElement("tpoAddPlacementSection");

    const viewSection =
        getElement("tpoViewPlacementSection");


    [addButton, emptyAddButton]
        .forEach(button => {

            if (button) {

                button.addEventListener(
                    "click",
                    () => {

                        scrollToElement(
                            addSection
                        );

                    }
                );

            }

        });


    if (viewButton) {

        viewButton.addEventListener(
            "click",
            () => {

                scrollToElement(
                    viewSection
                );

            }
        );

    }

}


/* ============================================================
   TPO SEARCH
   ============================================================ */

function initializeTpoSearch() {

    const search =
        getElement("tpoPlacementSearch");

    if (!search) {
        return;
    }


    search.addEventListener(
        "input",
        () => {

            const grid =
                getElement("tpoPlacementCardGrid");

            const emptyState =
                getElement("tpoPlacementEmptyState");


            if (!grid) {
                return;
            }


            const cards =
                Array.from(
                    grid.querySelectorAll(
                        ".tpo-placement-card, .content-card"
                    )
                );


            if (cards.length === 0) {

                if (emptyState) {
                    emptyState.style.display = "";
                }

                return;

            }


            const value =
                normalizeText(
                    search.value
                );


            let visibleCount = 0;


            cards.forEach(card => {

                const text =
                    normalizeText(
                        card.textContent
                    );


                const visible =
                    !value ||
                    text.includes(value);


                card.style.display =
                    visible ? "" : "none";


                if (visible) {
                    visibleCount++;
                }

            });


            if (emptyState) {

                emptyState.style.display =
                    visibleCount === 0
                        ? ""
                        : "none";

            }

        }
    );

}


/* ============================================================
   TPO EDIT MODAL
   ============================================================ */

function initializeTpoEditModal() {

    const modal =
        getElement("tpoEditModal");

    if (!modal) {
        return;
    }


    const close =
        getElement("closeTpoEditModal");

    const cancel =
        getElement("cancelTpoEdit");

    const form =
        getElement("tpoEditPlacementForm");


    [close, cancel].forEach(button => {

        if (button) {

            button.addEventListener(
                "click",
                () => {

                    removeClass(
                        modal,
                        "active"
                    );

                }
            );

        }

    });


    modal.addEventListener(
        "click",
        event => {

            if (event.target === modal) {

                removeClass(
                    modal,
                    "active"
                );

            }

        }
    );


    if (form) {

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                /*
                 * Actual UPDATE will later go through Flask.
                 */

                showFormStatus(
                    form,
                    "Changes are ready to be saved."
                );

            }
        );

    }

}


/* ============================================================
   OPEN TPO EDIT MODAL
   ============================================================ */

function openTpoEditModal(record = {}) {

    const modal =
        getElement("tpoEditModal");

    if (!modal) {
        return;
    }


    setValue(
        "tpoEditPlacementId",
        record.placement_id
    );

    setValue(
        "tpoEditCompanyName",
        record.company_name
    );

    setValue(
        "tpoEditRole",
        record.role
    );

    setValue(
        "tpoEditPackage",
        record.package
    );

    setValue(
        "tpoEditApplicationDeadline",
        record.application_deadline
    );

    setValue(
        "tpoEditEligibility",
        record.eligibility
    );

    setValue(
        "tpoEditSelectionProcess",
        record.selection_process
    );

    setValue(
        "tpoEditDetails",
        record.details
    );


    addClass(
        modal,
        "active"
    );

}


function setValue(id, value) {

    const element =
        getElement(id);

    if (!element) {
        return;
    }


    element.value =
        value === null ||
        value === undefined
            ? ""
            : value;

}


/* ============================================================
   13. PROFILE PAGE
   ============================================================ */

function initializeProfilePage() {

    const form =
        getElement("profileForm");

    if (!form) {
        return;
    }


    initializeProfilePasswordToggle();


    /*
     * Until Flask loads the student,
     * keep contribution values at zero.
     */

    setText(
        "profileKnowledgePoints",
        "0"
    );

    setText(
        "profileInterviewCount",
        "0"
    );

    setText(
        "profileHackathonCount",
        "0"
    );

    setText(
        "profileClubReviewCount",
        "0"
    );

    setText(
        "profileResourceCount",
        "0"
    );


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            /*
             * Actual UPDATE will later use Flask.
             */

            showFormStatus(
                form,
                "Your profile changes are ready to be saved."
            );

        }
    );

}


/* ============================================================
   PROFILE PASSWORD
   ============================================================ */

function initializeProfilePasswordToggle() {

    initializePasswordToggle(
        "profilePassword",
        "profilePasswordToggle"
    );

}


/* ============================================================
   PROFILE DATA LOADER
   ============================================================

   This function is intentionally separate so that later
   Flask integration can simply call:

       loadProfileData(data);

   ============================================================ */

function loadProfileData(data) {

    if (!data) {
        return;
    }


    setValue(
        "profileFirstName",
        data.first_name
    );

    setValue(
        "profileMiddleName",
        data.middle_name
    );

    setValue(
        "profileLastName",
        data.last_name
    );

    setValue(
        "profileEmail",
        data.email
    );

    setValue(
        "profileBatch",
        data.batch
    );

    setValue(
        "profileSemester",
        data.semester
    );


    if (data.department_id !== undefined) {

        setValue(
            "profileDepartment",
            data.department_id
        );

    }


    const fullName = [
        data.first_name,
        data.middle_name,
        data.last_name
    ]
        .filter(Boolean)
        .join(" ")
        .trim();


    if (fullName) {

        setText(
            "profileDisplayName",
            fullName
        );


        setText(
            "topbarProfileInitial",
            getInitial(fullName)
        );


        setText(
            "profileAvatarInitial",
            getInitial(fullName)
        );

    }


    if (data.email) {

        setText(
            "profileDisplayEmail",
            data.email
        );

    }


    setText(
        "profileKnowledgePoints",
        data.knowledge_points ?? 0
    );


    setText(
        "profileInterviewCount",
        data.interview_count ?? 0
    );


    setText(
        "profileHackathonCount",
        data.hackathon_count ?? 0
    );


    setText(
        "profileClubReviewCount",
        data.club_review_count ?? 0
    );


    setText(
        "profileResourceCount",
        data.resource_count ?? 0
    );

}


/* ============================================================
   14. GENERIC FORM STATUS
   ============================================================ */

function showFormStatus(form, message) {

    if (!form) {
        return;
    }


    const status =
        form.querySelector(
            ".form-status"
        );


    if (status) {

        status.textContent =
            message;

        status.style.display =
            "block";

    }

}


function clearFormStatus(form) {

    if (!form) {
        return;
    }


    const status =
        form.querySelector(
            ".form-status"
        );


    if (status) {

        status.textContent =
            "";

    }

}


/* ============================================================
   15. GENERIC TEXT HELPERS
   ============================================================ */

function setText(id, value) {

    const element =
        getElement(id);

    if (!element) {
        return;
    }


    element.textContent =
        value === null ||
        value === undefined ||
        value === ""
            ? "—"
            : String(value);

}


/* ============================================================
   16. DATABASE-READY RENDER FUNCTIONS
   ============================================================

   These functions do NOT contain sample records.

   Flask can later pass real database results to them.

   Example:

       renderInterviewExperiences(data);

   ============================================================ */


/* ============================================================
   INTERVIEW RENDERER
   ============================================================ */

function renderInterviewExperiences(records) {

    const grid =
        getElement("interviewCardGrid");

    const emptyState =
        getElement("interviewEmptyState");


    if (!grid) {
        return;
    }


    grid.innerHTML = "";


    if (!Array.isArray(records) ||
        records.length === 0) {

        if (emptyState) {
            emptyState.style.display = "";
        }

        return;

    }


    if (emptyState) {
        emptyState.style.display = "none";
    }


    records.forEach(record => {

        const card =
            document.createElement("article");

        card.className =
            "content-card interview-card";


        card.dataset.company =
            record.company || "";

        card.dataset.role =
            record.role || "";

        card.dataset.year =
            record.year || "";

        card.dataset.type =
            record.experience_type || "";


        card.innerHTML = `

            <div class="placement-card-header">

                <div>

                    <h3>
                        ${escapeHTML(record.company)}
                    </h3>

                    <p class="placement-card-role">
                        ${escapeHTML(record.role)}
                    </p>

                </div>

            </div>


            <div class="placement-card-meta">

                <div class="placement-meta-item">

                    <span>
                        Year
                    </span>

                    <strong>
                        ${escapeHTML(record.year)}
                    </strong>

                </div>


                <div class="placement-meta-item">

                    <span>
                        Opportunity
                    </span>

                    <strong>
                        ${escapeHTML(record.opportunity_source)}
                    </strong>

                </div>

            </div>


            <div class="placement-card-footer">

                <button
                    type="button"
                    class="card-action-button"
                    data-interview-id="${escapeHTML(record.interview_id)}">

                    View Experience

                </button>

            </div>
        `;


        grid.appendChild(card);

    });


    filterInterviewCards();

}


/* ============================================================
   HACKATHON RENDERER
   ============================================================ */

function renderHackathonExperiences(records) {

    const grid =
        getElement("hackathonCardGrid");

    const emptyState =
        getElement("hackathonEmptyState");


    if (!grid) {
        return;
    }


    grid.innerHTML = "";


    if (!Array.isArray(records) ||
        records.length === 0) {

        if (emptyState) {
            emptyState.style.display = "";
        }

        return;

    }


    if (emptyState) {
        emptyState.style.display = "none";
    }


    records.forEach(record => {

        const card =
            document.createElement("article");

        card.className =
            "content-card hackathon-card";


        card.innerHTML = `

            <div class="placement-card-header">

                <div>

                    <h3>
                        ${escapeHTML(record.name)}
                    </h3>

                    <p class="placement-card-role">
                        ${escapeHTML(record.role)}
                    </p>

                </div>

            </div>


            <div class="placement-card-meta">

                <div class="placement-meta-item">

                    <span>
                        Semester
                    </span>

                    <strong>
                        ${escapeHTML(record.semester)}
                    </strong>

                </div>


                <div class="placement-meta-item">

                    <span>
                        Year
                    </span>

                    <strong>
                        ${escapeHTML(record.year)}
                    </strong>

                </div>

            </div>


            <div class="placement-card-footer">

                <button
                    type="button"
                    class="card-action-button">

                    View Experience

                </button>

            </div>
        `;


        grid.appendChild(card);

    });


    filterHackathons();

}


/* ============================================================
   CLUB RENDERER
   ============================================================ */

function renderClubs(records) {

    const grid =
        getElement("clubCardGrid");

    const emptyState =
        getElement("clubEmptyState");


    if (!grid) {
        return;
    }


    grid.innerHTML = "";


    if (!Array.isArray(records) ||
        records.length === 0) {

        if (emptyState) {
            emptyState.style.display = "";
        }

        return;

    }


    if (emptyState) {
        emptyState.style.display = "none";
    }


    records.forEach(record => {

        const card =
            document.createElement("article");

        card.className =
            "content-card club-card";


        card.innerHTML = `

            <div class="placement-card-header">

                <div>

                    <h3>
                        ${escapeHTML(record.club_name)}
                    </h3>

                    <p class="placement-card-role">
                        ${escapeHTML(record.category || "")}
                    </p>

                </div>

                <strong>
                    ${escapeHTML(record.average_rating ?? "—")}
                </strong>

            </div>


            <p>
                ${escapeHTML(
                    record.review_count ?? 0
                )}
                reviews
            </p>


            <div class="placement-card-footer">

                <button
                    type="button"
                    class="card-action-button">

                    Read Reviews

                </button>

            </div>
        `;


        grid.appendChild(card);

    });

}


/* ============================================================
   RESOURCE RENDERER
   ============================================================ */

function renderResources(records) {

    const grid =
        getElement("resourceCardGrid");

    const emptyState =
        getElement("resourceEmptyState");


    if (!grid) {
        return;
    }


    grid.innerHTML = "";


    if (!Array.isArray(records) ||
        records.length === 0) {

        if (emptyState) {
            emptyState.style.display = "";
        }

        return;

    }


    if (emptyState) {
        emptyState.style.display = "none";
    }


    records.forEach(record => {

        const card =
            document.createElement("article");

        card.className =
            "content-card resource-card";


        card.innerHTML = `

            <div class="placement-card-header">

                <div>

                    <h3>
                        ${escapeHTML(record.title)}
                    </h3>

                    <p class="placement-card-role">
                        ${escapeHTML(record.subject)}
                    </p>

                </div>

            </div>


            <p>
                ${escapeHTML(record.description)}
            </p>


            <div class="placement-card-meta">

                <div class="placement-meta-item">

                    <span>
                        Semester
                    </span>

                    <strong>
                        ${escapeHTML(record.semester || "—")}
                    </strong>

                </div>


                <div class="placement-meta-item">

                    <span>
                        Uploaded
                    </span>

                    <strong>
                        ${escapeHTML(record.upload_date || "—")}
                    </strong>

                </div>

            </div>


            <div class="placement-card-footer">

                <button
                    type="button"
                    class="card-action-button">

                    View Resource

                </button>

            </div>
        `;


        grid.appendChild(card);

    });


    filterResources();

}


/* ============================================================
   PLACEMENT RENDERER
   ============================================================ */

function renderPlacements(records) {

    const grid =
        getElement("placementCardGrid");

    const emptyState =
        getElement("placementEmptyState");


    if (!grid) {
        return;
    }


    grid.innerHTML = "";


    if (!Array.isArray(records) ||
        records.length === 0) {

        if (emptyState) {
            emptyState.style.display = "";
        }

        return;

    }


    if (emptyState) {
        emptyState.style.display = "none";
    }


    records.forEach(record => {

        const card =
            document.createElement("article");

        card.className =
            "placement-card";


        card.dataset.company =
            record.company_name || "";

        card.dataset.role =
            record.role || "";


        card.innerHTML = `

            <div class="placement-card-header">

                <div>

                    <h3>
                        ${escapeHTML(record.company_name)}
                    </h3>

                    <p class="placement-card-role">
                        ${escapeHTML(record.role)}
                    </p>

                </div>

            </div>


            <div class="placement-card-meta">

                <div class="placement-meta-item">

                    <span>
                        Package
                    </span>

                    <strong>
                        ${escapeHTML(record.package)}
                    </strong>

                </div>


                <div class="placement-meta-item">

                    <span>
                        Deadline
                    </span>

                    <strong>
                        ${escapeHTML(record.application_deadline)}
                    </strong>

                </div>

            </div>


            <div class="placement-card-footer">

                <button
                    type="button"
                    class="card-action-button"
                    data-placement-id="${escapeHTML(record.placement_id)}">

                    View Details

                </button>

            </div>

        `;


        grid.appendChild(card);

    });


    filterPlacements();

}


/* ============================================================
   TPO PLACEMENT RENDERER
   ============================================================ */

function renderTpoPlacements(records) {

    const grid =
        getElement("tpoPlacementCardGrid");

    const emptyState =
        getElement("tpoPlacementEmptyState");


    if (!grid) {
        return;
    }


    grid.innerHTML = "";


    if (!Array.isArray(records) ||
        records.length === 0) {

        if (emptyState) {
            emptyState.style.display = "";
        }

        return;

    }


    if (emptyState) {
        emptyState.style.display = "none";
    }


    records.forEach(record => {

        const card =
            document.createElement("article");

        card.className =
            "tpo-placement-card";


        card.innerHTML = `

            <div class="tpo-placement-card-header">

                <div>

                    <h3>
                        ${escapeHTML(record.company_name)}
                    </h3>

                    <p class="tpo-placement-card-role">
                        ${escapeHTML(record.role)}
                    </p>

                </div>

            </div>


            <div class="placement-card-meta">

                <div class="placement-meta-item">

                    <span>
                        Package
                    </span>

                    <strong>
                        ${escapeHTML(record.package)}
                    </strong>

                </div>


                <div class="placement-meta-item">

                    <span>
                        Deadline
                    </span>

                    <strong>
                        ${escapeHTML(record.application_deadline)}
                    </strong>

                </div>

            </div>


            <div class="tpo-card-footer">

                <button
                    type="button"
                    class="card-action-button"
                    data-edit-placement="${escapeHTML(record.placement_id)}">

                    Edit

                </button>

            </div>

        `;


        grid.appendChild(card);

    });


    /*
     * Attach edit buttons.
     */

    grid
        .querySelectorAll(
            "[data-edit-placement]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    /*
                     * Later we will retrieve the complete
                     * record from the database/API.
                     */

                    const id =
                        button.dataset.editPlacement;


                    openTpoEditModal({
                        placement_id: id
                    });

                }
            );

        });

}


/* ============================================================
   17. ESCAPE KEY — CLOSE MODALS
   ============================================================ */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }


        document
            .querySelectorAll(
                ".modal-overlay.active"
            )
            .forEach(modal => {

                removeClass(
                    modal,
                    "active"
                );

            });


        const loginLayer =
            getElement("loginStatusLayer");

        if (loginLayer) {

            removeClass(
                loginLayer,
                "active"
            );

        }

    }
);


/* ============================================================
   18. MODAL OPEN HELPERS
   ============================================================ */

function openModal(id) {

    const modal =
        getElement(id);

    if (!modal) {
        return;
    }


    addClass(
        modal,
        "active"
    );

}


function closeModal(id) {

    const modal =
        getElement(id);

    if (!modal) {
        return;
    }


    removeClass(
        modal,
        "active"
    );

}


/* ============================================================
   19. FUTURE FLASK / API INTEGRATION
   ============================================================

   These functions are deliberately kept separate.

   Later, when Flask is ready, the flow will become:

   Flask route
       ↓
   fetch()
       ↓
   JSON response
       ↓
   render function above

   Example:

       fetch("/api/placements")
           .then(response => response.json())
           .then(data => renderPlacements(data));

   ============================================================ */


/* ============================================================
   20. OPTIONAL API HELPER
   ============================================================ */

async function apiRequest(
    url,
    options = {}
) {

    const response =
        await fetch(
            url,
            {
                credentials: "include",
                ...options
            }
        );


    let data = null;


    try {

        data =
            await response.json();

    }

    catch (error) {

        data = null;

    }


    if (!response.ok) {

        const message =
            data?.message ||
            "Something went wrong.";

        throw new Error(message);

    }


    return data;

}


/* ============================================================
   END OF SCRIPT
   ============================================================ */
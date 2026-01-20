const storageKey = "theme"
const html = document.documentElement
const switchButton = document.querySelector("#switch")

const setTheme = (isLight) => {
    html.classList.toggle("light", isLight)
    if (switchButton) {
        switchButton.setAttribute("aria-pressed", String(isLight))
    }
    try {
        localStorage.setItem(storageKey, isLight ? "light" : "dark")
    } catch (error) {
        console.warn("Theme storage unavailable", error)
    }
}

const getStoredTheme = () => {
    try {
        return localStorage.getItem(storageKey)
    } catch (error) {
        return null
    }
}

const storedTheme = getStoredTheme()
if (storedTheme) {
    setTheme(storedTheme === "light")
}

function togglMode() {
    const isLight = !html.classList.contains("light")
    setTheme(isLight)
}

const filterButtons = document.querySelectorAll(".filter-btn")
const projectCards = document.querySelectorAll(".project-card")
const emptyState = document.querySelector(".empty-state")

const applyFilter = (filter) => {
    let visibleCount = 0
    projectCards.forEach((card) => {
        const tags = (card.dataset.tags || "").split(" ")
        const matches = filter === "all" || tags.includes(filter)
        card.classList.toggle("is-hidden", !matches)
        if (matches) {
            visibleCount += 1
        }
    })

    if (emptyState) {
        emptyState.hidden = visibleCount > 0
    }
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        filterButtons.forEach((item) => {
            const isActive = item === button
            item.classList.toggle("is-active", isActive)
            item.setAttribute("aria-pressed", String(isActive))
        })
        applyFilter(button.dataset.filter)
    })
})

applyFilter("all")

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
const revealTargets = document.querySelectorAll("[data-animate]")

if (prefersReducedMotion) {
    revealTargets.forEach((target) => target.classList.add("is-visible"))
} else if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible")
                    observer.unobserve(entry.target)
                }
            })
        },
        { threshold: 0.18 }
    )

    revealTargets.forEach((target) => revealObserver.observe(target))
}

const statValues = document.querySelectorAll(".stat-value")
const statsSection = document.querySelector(".stats")

const animateCounters = () => {
    statValues.forEach((value) => {
        const target = Number.parseInt(value.dataset.count, 10) || 0
        const duration = 900
        const start = performance.now()

        const tick = (now) => {
            const elapsed = Math.min((now - start) / duration, 1)
            value.textContent = Math.floor(elapsed * target)
            if (elapsed < 1) {
                requestAnimationFrame(tick)
            }
        }

        requestAnimationFrame(tick)
    })
}

if (statValues.length) {
    if (prefersReducedMotion) {
        statValues.forEach((value) => {
            value.textContent = value.dataset.count || "0"
        })
    } else if (statsSection && "IntersectionObserver" in window) {
        const statsObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateCounters()
                        observer.disconnect()
                    }
                })
            },
            { threshold: 0.3 }
        )
        statsObserver.observe(statsSection)
    } else {
        animateCounters()
    }
}

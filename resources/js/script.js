"use strict";
import { accounts } from "./accounts.js";

//////////////////////////////////////////////////////////////////////////////

const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const header = document.querySelector(".header");
const nav = document.querySelector("nav");
const mobileNav = document.querySelector(".mobile__nav__btn");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const allSections = document.querySelectorAll(".section");
const lazyLoadImgs = document.querySelectorAll("img[data-src]");

// /////////////////////////////////////////////////////////
mobileNav.addEventListener("click", function (e) {
	e.preventDefault();
	nav.classList.toggle("mobile__nav");
});

//////////////////////////////////////////////////////////////////////////////

/* =====INSERT HERE MODAL WINDOW CODE===== */
// ///////////////////MODAL OPEN////////////////////////
const openModal = function (e) {
	e.preventDefault();
	if (confirm("This window will open in new tab!"))
		window.open("resources/bankUI/index.html", "_blank");
};
btnsOpenModal.forEach((el) => el.addEventListener("click", openModal));

//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
// learn more button scrolling
btnScrollTo.addEventListener("click", function (e) {
	// const secHeight = section1.getBoundingClientRect();
	// window.scrollTo({
	//   left: secHeight.left + window.pageXOffset,
	//   top: secHeight.top + window.pageYOffset - 2,
	//   behavior: "smooth",
	// });

	section1.scrollIntoView({ behavior: "smooth" }); // its work only SupModern browser
});

//////////////////////////////////////////////////////////////////////////////
/**
 // navigation scrolling & event delegation
 * 
 * document.querySelectorAll(".nav__link").forEach((el) => {
    el.addEventListener("click", function (e) {
    e.preventDefault();
    const id = this.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
    console.log("link");
    });
   });
   *
 * ===event delegation : Use parrent el for eventListener and use checking stratagy
 */
function navigationScroll(e) {
	document.querySelector(".nav__links").addEventListener("click", function (e) {
		e.preventDefault();
		const id = e.target.getAttribute("href");
		if (e.target.classList.contains("nav__link") && id !== "") {
			document.querySelector(id).scrollIntoView({ behavior: "smooth" });

			if (nav.classList.contains("mobile__nav"))
				nav.classList.remove("mobile__nav");
		}
	});
}
navigationScroll();

//////////////////////////////////////////////////////////////////////////////
/**
 * select upword element form DOM using closest()
 *
 * Operations with tabs & their content box simply adding and removing classes
 */
const tabbedComponent = function () {
	const tabsContainer = document.querySelector(".operations__tab-container");
	const tabs = document.querySelectorAll(".operations__tab");
	const tabContents = document.querySelectorAll(".operations__content");

	tabsContainer.addEventListener("click", function (e) {
		const clicked = e.target.closest(".operations__tab");
		if (!clicked) return; // guard for errors

		// deActivating others tabs or contents box
		tabs.forEach((tab) => tab.classList.remove("operations__tab--active"));
		tabContents.forEach((cont) =>
			cont.classList.remove("operations__content--active")
		);

		// Activate current tab & content box
		clicked.classList.add("operations__tab--active");
		document
			.querySelector(
				`.operations__content--${clicked.getAttribute("data-tab")}`
			)
			.classList.add("operations__content--active");
	});
};
tabbedComponent();

//////////////////////////////////////////////////////////////////////////////
/**
 * links fading animation
 */
const fadingAnimation = function () {
	const handleHover = function (e) {
		if (e.target.classList.contains("nav__link")) {
			const link = e.target.closest(".nav");
			const siblings = link.querySelectorAll(".nav__link");
			const logoImg = link.querySelector(".nav__logo");

			siblings.forEach((el) => {
				if (el !== e.target) el.style.opacity = this;
			});
			logoImg.style.opacity = this;
		}
	};

	nav.addEventListener("mouseover", handleHover.bind(0.5));
	nav.addEventListener("mouseout", handleHover.bind(1));
};
fadingAnimation();

//////////////////////////////////////////////////////////////////////////////
/**
 * sticky navigation bar using getBoundingClientRect()
 */
/*
const stickyCords = section1.getBoundingClientRect();

window.addEventListener("scroll", function () {
	if (window.scrollY > stickyCords.top) nav.classList.add("sticky");
	else nav.classList.remove("sticky");
});
*/

/**
 * sticky navigation bar using INTERSECTION OBSERVER API
 */

function stickyNav(entries) {
	const [entry] = entries;
	if (entry.isIntersecting) {
		nav.classList.remove("sticky");
	} else {
		nav.classList.add("sticky");
	}
}

const headerObservation = new IntersectionObserver(stickyNav, {
	root: null,
	threshold: [0, 0.1],
	rootMargin: `-${nav.getBoundingClientRect().height}px`,
});
headerObservation.observe(header);

//////////////////////////////////////////////////////////////////////////////
/**
 * sections moving from down (Revealing)
 */
const sectionShow = function (entries, observer) {
	const [entry] = entries;
	if (entry.isIntersecting) {
		entry.target.classList.remove("section--hidden");
		observer.unobserve(entry.target);
	}
};

const sectionObservation = new IntersectionObserver(sectionShow, {
	roll: null,
	threshold: 0.15,
});

allSections.forEach((section) => {
	sectionObservation.observe(section);
	// section.classList.add("section--hidden");
});

//////////////////////////////////////////////////////////////////////////////
/**
 * lazy loading images effect
 */
const imgLoad = function (entries, observer) {
	const [entry] = entries;
	if (!entry.isIntersecting) return; // guard

	// replace img src with data src
	entry.target.src = entry.target.dataset.src;

	entry.target.addEventListener("load", function (e) {
		entry.target.classList.remove("lazy-img");
		observer.unobserve(entry.target);
	});
};

const imgObservation = new IntersectionObserver(imgLoad, {
	root: null,
	threshold: [0],
	rootMargin: "200px 0px 0px 0px",
});

lazyLoadImgs.forEach((img) => {
	imgObservation.observe(img);
	img.classList.add("lazy-img");
});

//////////////////////////////////////////////////////////////////////////////
/**
 *sliding functionality
 */
const sliderSlideShow = function () {
	const slideSection = document.querySelector("#section--3");
	const slides = document.querySelectorAll(".slide");
	const btnPrev = document.querySelector(".slider__btn--left");
	const btnNext = document.querySelector(".slider__btn--right");
	const slideLength = slides.length;
	const dotsBox = document.querySelector(".dots");
	let curIndex = 0;

	const createDots = function () {
		for (let i = 0; i < slideLength; i++) {
			const span = `<button class="dots__dot" data-slide="${i}"></button>`;
			dotsBox.insertAdjacentHTML("beforeend", span);
		}
	};

	// execution slide show
	const goToSlide = function (slideIndex = 0) {
		if (slideIndex >= slideLength) {
			slideIndex = 0;
			curIndex = slideIndex;
		} else if (slideIndex < 0) {
			slideIndex = slideLength - 1;
			curIndex = slideIndex;
		}

		slides.forEach((slide, i) => {
			slide.style.transform = `translateX(${100 * (i - slideIndex)}%)`;
		});

		const dots = document.querySelectorAll(".dots__dot");
		dots.forEach((dot) => {
			dot.classList.remove("dots__dot--active");
		});

		dots[slideIndex]?.classList.add("dots__dot--active");
	};

	// directions of slide
	const prevSlide = function () {
		curIndex--;
		goToSlide(curIndex);
	};

	const nextSlide = function () {
		curIndex++;
		goToSlide(curIndex);
	};

	// slider event listener
	btnPrev.addEventListener("click", prevSlide);

	btnNext.addEventListener("click", nextSlide);

	dotsBox.addEventListener("click", function (e) {
		const { slide: activeDot } = e.target.dataset; // Destructure data
		if (e.target.classList.contains("dots__dot") && activeDot)
			goToSlide(activeDot);
	});

	// document.addEventListener("keydown", function (e) {
	//   e.key === "ArrowLeft" && prevSlide();
	//   e.key === "ArrowRight" && nextSlide();
	// });

	document.addEventListener("keydown", function (e) {
		const keySlide = function (entries) {
			const [entry] = entries;

			if (entry.isIntersecting) {
				e.key === "ArrowLeft" && prevSlide();
				e.key === "ArrowRight" && nextSlide();
			}
		};

		const slideObserver = new IntersectionObserver(keySlide, {
			root: null,
			threshold: [0],
		});

		slideObserver.observe(slideSection);
	});

	// init call
	createDots();
	goToSlide();
};
sliderSlideShow();

// document.addEventListener("DOMContentLoaded", function (e) {
// 	console.log("dom content load", e);
// });

// window.addEventListener("load", function (e) {
// 	console.log("dom content load window event", e);
// });

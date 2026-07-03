/* -------------------------------------------------------------
   SDC CLICKS - INTERACTION LOGIC (VANILLA JS)
------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. HEADER & NAVIGATION SCROLL EFFECT
    // ==========================================
    const header = document.getElementById('site-header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    // ==========================================
    // 2. MOBILE MENU NAVIGATION
    // ==========================================
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const body = document.body;
    
    const toggleMenu = () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Lock body scrolling when menu is active
        if (!isExpanded) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    };
    
    navToggle.addEventListener('click', toggleMenu);
    
    // Close menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    // ==========================================
    // 3. SCROLL SPY - ACTIVE NAVIGATION LINK
    // ==========================================
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Target middle of screen
        threshold: 0
    };
    
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));
    
    // ==========================================
    // 4. PORTFOLIO LIGHTBOX VIEWER
    // ==========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    let currentIndex = 0;
    const galleryImagesData = [];
    
    // Collect all image data from the HTML grid structure
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('.gallery-img');
        const title = item.querySelector('.gallery-item-title').textContent;
        const category = item.querySelector('.gallery-cat').textContent;
        
        galleryImagesData.push({
            src: img.src,
            alt: img.alt,
            title: title,
            category: category
        });
        
        // Add click listener to open lightbox
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });
    
    const openLightbox = (index) => {
        currentIndex = index;
        updateLightboxContent();
        lightbox.setAttribute('aria-hidden', 'false');
        body.style.overflow = 'hidden'; // Disable scroll
    };
    
    const closeLightbox = () => {
        lightbox.setAttribute('aria-hidden', 'true');
        body.style.overflow = ''; // Re-enable scroll
    };
    
    const showNextImage = () => {
        currentIndex = (currentIndex + 1) % galleryImagesData.length;
        updateLightboxContent();
    };
    
    const showPrevImage = () => {
        currentIndex = (currentIndex - 1 + galleryImagesData.length) % galleryImagesData.length;
        updateLightboxContent();
    };
    
    const updateLightboxContent = () => {
        const data = galleryImagesData[currentIndex];
        
        // Fade transition logic
        lightboxImg.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.97)';
        
        setTimeout(() => {
            lightboxImg.src = data.src;
            lightboxImg.alt = data.alt;
            lightboxCaption.innerHTML = `<span style="font-size: 0.8rem; text-transform: uppercase; color: var(--color-primary); letter-spacing: 0.15em; font-family: var(--font-body); font-weight: 700; display: block; margin-bottom: 6px;">${data.category}</span>${data.title}`;
            lightboxImg.style.opacity = '1';
            lightboxImg.style.transform = 'scale(1)';
        }, 150);
    };
    
    // Lightbox Control Listeners
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', showNextImage);
    lightboxPrev.addEventListener('click', showPrevImage);
    
    // Close lightbox on clicking background overlay
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard Controls
    document.addEventListener('keydown', (e) => {
        if (lightbox.getAttribute('aria-hidden') === 'false') {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            }
        }
    });
});

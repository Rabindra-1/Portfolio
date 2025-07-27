// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Device detection
const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Card effects (desktop only for performance)
if (!isMobile && !isTouchDevice) {
    document.querySelectorAll('.card').forEach(card => {
        // Desktop hover effects only
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--y', `${e.clientY - rect.top}px`);
        });
    });
}

// GSAP Animations

// 1. Initial page load animations
gsap.timeline()
  .from("header", {
    y: -100,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  })
  .from("main h1", {
    scale: 0.5,
    opacity: 0,
    duration: 1.2,
    ease: "back.out(1.7)"
  }, "-=0.5")
  .from(".location p", {
    x: -100,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out"
  }, "-=0.3")
  .from(".bio", {
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out"
  }, "-=0.2");

// 2. 3D Model animations
const model3d = document.querySelector('.model3d');

// Initial 3D model animation
gsap.fromTo(model3d, 
  {
    scale: 0.3,
    opacity: 0,
    rotation: -15,
    x: 100
  },
  {
    scale: 1,
    opacity: 1,
    rotation: 0,
    x: 0,
    duration: 2,
    ease: "power3.out",
    delay: 0.5
  }
);

// Continuous floating animation for 3D model
gsap.to(model3d, {
  y: "-=20",
  duration: 3,
  yoyo: true,
  repeat: -1,
  ease: "power1.inOut"
});

// 3D Model interaction (simplified for mobile performance)
let targetX = 0, targetY = 0;

if (!isMobile) {
  // Desktop mouse interaction only
  document.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    const mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    
    targetX = mouseX * 10;
    targetY = mouseY * 10;
  });
} else {
  // Minimal mobile interaction - only device orientation if available
  if (window.DeviceOrientationEvent) {
    // Throttle orientation events for better performance
    let orientationThrottle = false;
    window.addEventListener('deviceorientation', (e) => {
      if (!orientationThrottle) {
        orientationThrottle = true;
        setTimeout(() => {
          // Very subtle device orientation movement
          targetX = (e.gamma || 0) * 0.1;
          targetY = (e.beta || 0) * 0.05;
          orientationThrottle = false;
        }, 100); // Throttle to 10fps for better performance
      }
    });
  }
}

// Smooth follow animation for 3D model (heavily optimized for mobile)
if (!isMobile) {
  // Full interaction for desktop
  gsap.ticker.add(() => {
    if (model3d) {
      gsap.to(model3d, {
        rotationY: targetX,
        rotationX: -targetY,
        duration: 0.8,
        ease: "power2.out"
      });
    }
  });
} else {
  // Minimal interaction for mobile - only update every 200ms
  let mobileUpdateInterval;
  const updateMobile3D = () => {
    if (model3d && (Math.abs(targetX) > 0.1 || Math.abs(targetY) > 0.1)) {
      gsap.to(model3d, {
        rotationY: targetX,
        rotationX: -targetY,
        duration: 2,
        ease: "power2.out"
      });
    }
    mobileUpdateInterval = setTimeout(updateMobile3D, 200);
  };
  updateMobile3D();
}

// 3. Scroll-triggered animations

// About section animation
gsap.fromTo(".about-title", 
  { y: 100, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 1,
    scrollTrigger: {
      trigger: ".about-section",
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse"
    }
  }
);

// Cards stagger animation
gsap.fromTo(".card", 
  { 
    y: 100, 
    opacity: 0,
    scale: 0.8
  },
  {
    y: 0,
    opacity: 1,
    scale: 1,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".grid",
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse"
    }
  }
);

// Self-image animation
gsap.fromTo(".self-image", 
  {
    scale: 0.5,
    opacity: 0,
    rotation: -10
  },
  {
    scale: 1,
    opacity: 1,
    rotation: 0,
    duration: 1,
    ease: "back.out(1.7)",
    scrollTrigger: {
      trigger: ".intro",
      start: "top 70%",
      toggleActions: "play none none reverse"
    }
  }
);

// Self-image hover effect (desktop only)
if (!isMobile) {
  const selfImage = document.querySelector('.self-image');
  if (selfImage) {
    selfImage.addEventListener('mouseenter', () => {
      gsap.to(selfImage, {
        scale: 1.05,
        rotation: 2,
        duration: 0.3,
        ease: "power2.out"
      });
    });
    
    selfImage.addEventListener('mouseleave', () => {
      gsap.to(selfImage, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    });
  }
}

// Project section animation
gsap.fromTo(".project-section h3", 
  { y: 100, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 1,
    scrollTrigger: {
      trigger: ".project-section",
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  }
);

// Video hover interactions (desktop only)
if (!isMobile) {
  document.querySelectorAll('.slider .item video').forEach(video => {
    video.addEventListener('mouseenter', () => {
      gsap.to(video, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      });
    });
    
    video.addEventListener('mouseleave', () => {
      gsap.to(video, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    });
  });
}

// Contact section animation
gsap.fromTo(".contact-section h3", 
  { y: 100, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 1,
    scrollTrigger: {
      trigger: ".contact-section",
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  }
);

gsap.fromTo(".contact-container", 
  { y: 50, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 0.8,
    delay: 0.2,
    scrollTrigger: {
      trigger: ".contact-section",
      start: "top 70%",
      toggleActions: "play none none reverse"
    }
  }
);

// 4. Interactive button animations
const contactBtn = document.querySelector('.contact-btn');
const submitBtn = document.querySelector('.submit-btn');
const cardBtns = document.querySelectorAll('.btn');

// Contact button in header
if (contactBtn) {
  contactBtn.addEventListener('click', () => {
    gsap.to(window, {
      duration: 1.5,
      scrollTo: "#contact",
      ease: "power2.inOut"
    });
  });
  
  contactBtn.addEventListener('mouseenter', () => {
    gsap.to(contactBtn, {
      scale: 1.05,
      duration: 0.2,
      ease: "power2.out"
    });
  });
  
  contactBtn.addEventListener('mouseleave', () => {
    gsap.to(contactBtn, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out"
    });
  });
}

// Card buttons
cardBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    gsap.to(window, {
      duration: 1.5,
      scrollTo: "#contact",
      ease: "power2.inOut"
    });
  });
});

// Scroll down indicator
const scrollDown = document.querySelector('.scroll-down');
if (scrollDown) {
  scrollDown.addEventListener('click', () => {
    gsap.to(window, {
      duration: 1.5,
      scrollTo: ".about-section",
      ease: "power2.inOut"
    });
  });
}

// 5. Form submission animation
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Animate submit button
    gsap.to(submitBtn, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
      onComplete: () => {
        // Show success message (you can customize this)
        gsap.to(submitBtn, {
          backgroundColor: "#4CAF50",
          duration: 0.3,
          onComplete: () => {
            submitBtn.innerHTML = '<i class="bx bx-check"></i> Message Sent!';
            setTimeout(() => {
              gsap.to(submitBtn, {
                backgroundColor: "",
                duration: 0.3
              });
              submitBtn.innerHTML = '<i class="bx bx-send"></i> Send Message';
              contactForm.reset();
            }, 2000);
          }
        });
      }
    });
  });
}

// 6. Parallax effect for 3D model during scroll
gsap.to(model3d, {
  y: "-20%",
  ease: "none",
  scrollTrigger: {
    trigger: "main",
    start: "top top",
    end: "bottom top",
    scrub: 1
  }
});

// 7. Performance optimization: Refresh ScrollTrigger on window resize
window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});

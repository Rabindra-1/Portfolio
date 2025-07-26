// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Device detection
const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;

// Card hover effects (desktop) and touch effects (mobile)
document.querySelectorAll('.card').forEach(card => {
    if (!isMobile) {
        // Desktop hover effects
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--y', `${e.clientY - rect.top}px`);
        });
    } else {
        // Mobile touch effects
        card.addEventListener('touchstart', e => {
            const rect = card.getBoundingClientRect();
            const touch = e.touches[0];
            card.style.setProperty('--x', `${touch.clientX - rect.left}px`);
            card.style.setProperty('--y', `${touch.clientY - rect.top}px`);
        });
        
        card.addEventListener('touchmove', e => {
            const rect = card.getBoundingClientRect();
            const touch = e.touches[0];
            card.style.setProperty('--x', `${touch.clientX - rect.left}px`);
            card.style.setProperty('--y', `${touch.clientY - rect.top}px`);
        });
    }
});

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

// Mouse/Touch interaction with 3D model
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
let isInteracting = false;

if (!isMobile) {
  // Desktop mouse interaction
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    
    targetX = mouseX * 10;
    targetY = mouseY * 10;
  });
} else {
  // Mobile touch interaction
  let touchStartX = 0, touchStartY = 0;
  
  document.addEventListener('touchstart', (e) => {
    isInteracting = true;
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  });
  
  document.addEventListener('touchmove', (e) => {
    if (!isInteracting) return;
    e.preventDefault(); // Prevent scrolling during interaction
    
    const touch = e.touches[0];
    const deltaX = (touch.clientX - touchStartX) / window.innerWidth;
    const deltaY = (touch.clientY - touchStartY) / window.innerHeight;
    
    targetX = deltaX * 20; // Amplify for mobile
    targetY = -deltaY * 20;
  }, { passive: false });
  
  document.addEventListener('touchend', () => {
    isInteracting = false;
    // Gradually return to center
    gsap.to({ x: targetX, y: targetY }, {
      x: 0,
      y: 0,
      duration: 2,
      ease: "power2.out",
      onUpdate: function() {
        targetX = this.targets()[0].x;
        targetY = this.targets()[0].y;
      }
    });
  });
  
  // Device orientation for mobile (if supported)
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
      if (!isInteracting) {
        // Use device orientation for subtle movement
        targetX = (e.gamma || 0) * 0.3; // Left-right tilt
        targetY = (e.beta || 0) * 0.2;  // Front-back tilt
      }
    });
  }
}

// Smooth follow animation for 3D model (optimized for mobile)
let lastUpdate = 0;
const updateInterval = isMobile ? 1000/30 : 1000/60; // 30fps on mobile, 60fps on desktop

gsap.ticker.add((time) => {
  if (time - lastUpdate < updateInterval) return;
  lastUpdate = time;
  
  if (model3d) {
    gsap.to(model3d, {
      rotationY: targetX,
      rotationX: -targetY,
      duration: isMobile ? 1.2 : 0.8, // Slower on mobile for better performance
      ease: "power2.out"
    });
  }
});

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

// Video hover interactions
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

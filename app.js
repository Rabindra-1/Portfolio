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

// 2. 3D Model animations with frame rate control
const model3d = document.querySelector('.model3d');
let splineApp = null;
let isModelLoaded = false;

// Frame rate control variables
let targetFPS = isMobile ? 15 : 30; // Lower FPS on mobile
let lastFrameTime = 0;
const frameInterval = 1000 / targetFPS;

// Initial 3D model animation (delayed for better loading)
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
    delay: 1.5 // Increased delay to let model load first
  }
);

// Reduced floating animation for better performance
if (!isMobile) {
  gsap.to(model3d, {
    y: "-=15",
    duration: 4,
    yoyo: true,
    repeat: -1,
    ease: "power1.inOut"
  });
}

// Spline model frame rate control
function controlSplineFrameRate() {
  if (model3d && splineApp) {
    const now = performance.now();
    if (now - lastFrameTime >= frameInterval) {
      // Allow Spline to render
      if (splineApp.setTargetFrameRate) {
        splineApp.setTargetFrameRate(targetFPS);
      }
      lastFrameTime = now;
    }
  }
  requestAnimationFrame(controlSplineFrameRate);
}

// Get loading indicator
const modelLoader = document.getElementById('model3dLoader');
const splineModel = document.getElementById('splineModel');

// Initialize Spline with performance settings
if (model3d) {
  // Show loading indicator initially
  if (modelLoader) {
    modelLoader.style.display = 'flex';
  }
  if (splineModel) {
    splineModel.style.opacity = '0';
  }
  
  model3d.addEventListener('load', () => {
    isModelLoaded = true;
    splineApp = model3d.splineApp;
    
    // Hide loading indicator and show model
    if (modelLoader) {
      gsap.to(modelLoader, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          modelLoader.style.display = 'none';
        }
      });
    }
    
    if (splineModel) {
      gsap.to(splineModel, {
        opacity: 1,
        duration: 0.5,
        delay: 0.2
      });
    }
    
    if (splineApp) {
      // Apply performance optimizations
      try {
        // Set quality based on device
        const quality = isMobile ? 'low' : 'medium';
        if (splineApp.setQuality) {
          splineApp.setQuality(quality);
        }
        
        // Set target frame rate
        if (splineApp.setTargetFrameRate) {
          splineApp.setTargetFrameRate(targetFPS);
        }
        
        // Disable shadows on mobile for better performance
        if (isMobile && splineApp.setShadows) {
          splineApp.setShadows(false);
        }
        
        // Reduce anti-aliasing on mobile
        if (isMobile && splineApp.setAntiAliasing) {
          splineApp.setAntiAliasing(false);
        }
        
        // Set pixel ratio for better performance
        if (splineApp.setPixelRatio) {
          const pixelRatio = isMobile ? Math.min(window.devicePixelRatio, 1.5) : window.devicePixelRatio;
          splineApp.setPixelRatio(pixelRatio);
        }
        
      } catch (error) {
        console.log('Some Spline optimization features not available:', error);
      }
    }
    
    // Start frame rate control
    controlSplineFrameRate();
  });
  
  // Handle loading errors
  model3d.addEventListener('error', () => {
    console.log('3D model failed to load');
    
    // Hide loading indicator
    if (modelLoader) {
      modelLoader.innerHTML = '<p style="color: #ff6b6b;">Failed to load 3D model</p>';
      setTimeout(() => {
        gsap.to(modelLoader, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            modelLoader.style.display = 'none';
          }
        });
      }, 2000);
    }
    
    // Hide model on mobile if it fails to load
    if (isMobile) {
      model3d.style.display = 'none';
    }
  });
  
  // Timeout fallback - hide loader after 10 seconds if model hasn't loaded
  setTimeout(() => {
    if (!isModelLoaded && modelLoader) {
      modelLoader.innerHTML = '<p style="color: #ff9f43;">Model taking too long to load...</p>';
      setTimeout(() => {
        gsap.to(modelLoader, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            modelLoader.style.display = 'none';
          }
        });
      }, 2000);
    }
  }, 10000);
}

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

// Experience section animations
gsap.fromTo(".experience-title", 
  { y: 100, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 1,
    scrollTrigger: {
      trigger: ".experience-section",
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  }
);

// 404 Meme animation
gsap.fromTo(".experience-meme", 
  { 
    x: -100, 
    opacity: 0,
    rotationY: -15
  },
  {
    x: 0,
    opacity: 1,
    rotationY: 0,
    duration: 1.2,
    ease: "back.out(1.7)",
    scrollTrigger: {
      trigger: ".experience-container",
      start: "top 70%",
      toggleActions: "play none none reverse"
    }
  }
);

// Experience cards stagger animation
gsap.fromTo(".experience-card", 
  { 
    x: 100, 
    opacity: 0,
    scale: 0.9
  },
  {
    x: 0,
    opacity: 1,
    scale: 1,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".experience-content",
      start: "top 70%",
      toggleActions: "play none none reverse"
    }
  }
);

// Animate loading bar continuously
gsap.to(".loading-progress", {
  scaleX: 1.5,
  duration: 2,
  yoyo: true,
  repeat: -1,
  ease: "power2.inOut",
  transformOrigin: "left center"
});

// Update loading text periodically
if (document.querySelector('.loading-text')) {
  const loadingTexts = [
    "Loading real-world experience... 0%",
    "Compiling knowledge... 25%",
    "Processing skills... 50%",
    "Optimizing potential... 75%",
    "Almost ready... 99%",
    "Still loading... 0%"
  ];
  
  let textIndex = 0;
  const loadingTextElement = document.querySelector('.loading-text');
  
  setInterval(() => {
    gsap.to(loadingTextElement, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        loadingTextElement.textContent = loadingTexts[textIndex];
        textIndex = (textIndex + 1) % loadingTexts.length;
        gsap.to(loadingTextElement, {
          opacity: 1,
          duration: 0.3
        });
      }
    });
  }, 3000);
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

// 6. Parallax effect for 3D model during scroll (reduced on mobile)
if (!isMobile) {
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
} else {
  // Minimal parallax on mobile
  gsap.to(model3d, {
    y: "-10%",
    ease: "none",
    scrollTrigger: {
      trigger: "main",
      start: "top top",
      end: "bottom top",
      scrub: 2 // Slower scrub for better performance
    }
  });
}

// Performance monitoring and adaptive frame rate
let performanceMonitor = {
  frameCount: 0,
  lastCheck: performance.now(),
  
  update() {
    this.frameCount++;
    const now = performance.now();
    
    // Check performance every 2 seconds
    if (now - this.lastCheck > 2000) {
      const fps = (this.frameCount * 1000) / (now - this.lastCheck);
      
      // Adaptive frame rate based on performance
      if (fps < 20 && targetFPS > 10) {
        targetFPS = Math.max(10, targetFPS - 2);
        console.log(`Reducing target FPS to ${targetFPS} due to low performance`);
      } else if (fps > 45 && targetFPS < (isMobile ? 20 : 30)) {
        targetFPS = Math.min(isMobile ? 20 : 30, targetFPS + 2);
      }
      
      this.frameCount = 0;
      this.lastCheck = now;
    }
    
    requestAnimationFrame(() => this.update());
  }
};

// Start performance monitoring
if (model3d) {
  performanceMonitor.update();
}

// Pause/resume 3D model based on visibility
let intersectionObserver;
if ('IntersectionObserver' in window && model3d) {
  intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (splineApp) {
        if (entry.isIntersecting) {
          // Resume 3D model when visible
          if (splineApp.play) splineApp.play();
          targetFPS = isMobile ? 15 : 30;
        } else {
          // Pause 3D model when not visible
          if (splineApp.pause) splineApp.pause();
          targetFPS = 5; // Very low FPS when not visible
        }
      }
    });
  }, {
    threshold: 0.1 // Trigger when 10% visible
  });
  
  intersectionObserver.observe(model3d);
}

// 7. Performance optimization: Refresh ScrollTrigger on window resize
window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});

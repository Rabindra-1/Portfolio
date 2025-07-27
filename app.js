// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Device detection
const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Console welcome message
console.log('%c🚀 Portfolio Loaded Successfully!', 'color: #00ff88; font-size: 16px; font-weight: bold;');
console.log('%c✨ Animated Code Terminal Active', 'color: #64ffda; font-size: 12px;');

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

// 2. Code Terminal animations
const codeTerminal = document.querySelector('.code-terminal');

// Initial terminal animation
if (codeTerminal) {
  gsap.fromTo(codeTerminal, 
    {
      scale: 0.8,
      opacity: 0,
      y: 50
    },
    {
      scale: 1,
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "power3.out",
      delay: 1
    }
  );
  
  // Subtle floating animation for terminal (desktop only)
  if (!isMobile) {
    gsap.to(codeTerminal, {
      y: "+=5",
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut"
    });
  }
}

// Auto-typing animation for code lines
const codeLines = document.querySelectorAll('.code-line');
if (codeLines.length > 0) {
  // Store original text content and clear it
  const originalTexts = Array.from(codeLines).map(line => {
    const text = line.innerHTML;
    line.innerHTML = '';
    line.style.opacity = '1'; // Make lines visible immediately
    return text;
  });
  
  // Create cursor element
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  cursor.innerHTML = '|';
  cursor.style.cssText = `
    color: #00ff88;
    animation: blink 1s infinite;
    font-weight: normal;
  `;
  
  // Add cursor blinking animation to head if not exists
  if (!document.querySelector('#cursor-blink-style')) {
    const style = document.createElement('style');
    style.id = 'cursor-blink-style';
    style.textContent = `
      @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Auto-typing function
  function typeCodeLines() {
    let currentLineIndex = 0;
    
    function typeNextLine() {
      if (currentLineIndex >= codeLines.length) {
        // Remove cursor when all lines are typed
        if (cursor.parentNode) {
          cursor.parentNode.removeChild(cursor);
        }
        return;
      }
      
      const currentLine = codeLines[currentLineIndex];
      const targetText = originalTexts[currentLineIndex];
      let currentText = '';
      let charIndex = 0;
      
      // Add cursor to current line
      currentLine.appendChild(cursor);
      
      function typeNextChar() {
        if (charIndex < targetText.length) {
          currentText += targetText[charIndex];
          currentLine.innerHTML = currentText;
          currentLine.appendChild(cursor); // Re-add cursor after text
          charIndex++;
          
          // Variable typing speed for more natural feel
          const delay = Math.random() * 15 + 10; // 10-25ms delay
          setTimeout(typeNextChar, delay);
        } else {
          // Line complete, pause before next line
          setTimeout(() => {
            currentLineIndex++;
            typeNextLine();
          }, 200);
        }
      }
      
      typeNextChar();
    }
    
    typeNextLine();
  }
  
  // Start typing animation after terminal appears
  setTimeout(typeCodeLines, 2500);
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

// 6. Code terminal scroll effects
if (codeTerminal) {
  gsap.to(codeTerminal, {
    y: "-5%",
    ease: "none",
    scrollTrigger: {
      trigger: "main",
      start: "top top",
      end: "bottom top",
      scrub: 1
    }
  });
}

// 7. Performance optimization: Refresh ScrollTrigger on window resize
window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});

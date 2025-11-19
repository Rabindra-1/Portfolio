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


// Safe GSAP intro animation
const terminal = document.querySelector("#codeTerminal");

if (terminal) {
  gsap.fromTo(
    terminal,
    { scale: 0.8, opacity: 0, y: 50 },
    {
      scale: 1,
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "power3.out",
      delay: 1
    }
  );
}


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
    duration: 0.8
  });

// Educational Achievement Tree Interactivity
const treeNodes = document.querySelectorAll('.tree-node');
treeNodes.forEach(node => {
  node.addEventListener('click', () => {
    const treeLevel = node.nextElementSibling;
    if (treeLevel && treeLevel.classList.contains('tree-level')) {
      treeLevel.classList.toggle('expanded');
      treeLevel.classList.toggle('collapsed');
    }
    gsap.to(node, {
      duration: 0.5,
      rotation: treeLevel.classList.contains('expanded') ? 0 : 180,
      ease: "power1.inOut"
    });
  });
});

// Trigger animation on load for expanded nodes
treeNodes.forEach(node => {
  const treeLevel = node.nextElementSibling;
  if (treeLevel && treeLevel.classList.contains('expanded')) {
    gsap.from(treeLevel, {
      duration: 1,
      height: 0,
      opacity: 0,
      ease: "power1.inOut"
    });
  }
}
    stagger: 0.2,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".grid",
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse"
    }
  },
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

// Education timeline animations
gsap.fromTo(".education-title", 
  { y: 100, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".education-section",
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  }
);

// Animate timeline line and branches
const timelineLines = document.querySelectorAll('.timeline-line, .timeline-branch');
gsap.set(timelineLines, { scaleY: 0 });
gsap.fromTo(timelineLines, { scaleY: 0 }, {
  scaleY: 1,
  duration: 1,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".timeline-container",
    start: "top 80%",
    toggleActions: "play none none reverse"
  }
});

// Animate timeline items
const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach((item, index) => {
  gsap.fromTo(item, 
    { 
      opacity: 0,
      y: 50
    },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    }
  );

  // Animate icons
  const icon = item.querySelector('.timeline-icon');
  gsap.fromTo(icon, { scale: 0 }, {
    scale: 1,
    duration: 0.8,
    ease: "back.out(1.7)",
    scrollTrigger: {
      trigger: item,
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });

  // Animate badges
  const badges = item.querySelectorAll('.timeline-badge');
  gsap.fromTo(badges, { y: -10, opacity: 0 }, {
    y: 0,
    opacity: 1,
    duration: 0.6,
    stagger: 0.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: item,
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });
});

// Add pulsing effect on nodes
gsap.to(".timeline-node", {
  scale: 1.1,
  duration: 1.5,
  yoyo: true,
  repeat: -1,
  ease: "power1.inOut"
});

// Add floating animation to current education box
gsap.to(".current-box", {
  y: "+=5",
  duration: 3,
  yoyo: true,
  repeat: -1,
  ease: "power1.inOut"
});

// Add pulsing animation to current icon
gsap.to(".current-icon", {
  scale: 1.1,
  duration: 2,
  yoyo: true,
  repeat: -1,
  ease: "power2.inOut"
});

// Add glowing animation to connection line dots
gsap.to(".connection-line::before", {
  boxShadow: "0 0 20px rgba(255, 255, 255, 1)",
  duration: 2,
  yoyo: true,
  repeat: -1,
  ease: "power2.inOut"
});

// Add subtle pulsing to current education node
const currentNode = document.querySelector('.leaf-node.current .leaf-circle');
if (currentNode) {
  gsap.to(currentNode, {
    scale: 1.1,
    duration: 1.5,
    yoyo: true,
    repeat: -1,
    ease: "power1.inOut"
  });
}

// 7. Performance optimization: Refresh ScrollTrigger on window resize
window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});




// AI Generated items To be Deleted if not worked

document.addEventListener('DOMContentLoaded', function() {
            const nodes = document.querySelectorAll('.node.interactive');
            
            // Add click functionality to nodes
            nodes.forEach(node => {
                node.addEventListener('click', function() {
                    const level = this.getAttribute('data-level');
                    console.log(`Clicked on ${level} node`);
                    
                    // Add a temporary highlight effect
                    this.style.transform = 'translateY(-10px) scale(1.05)';
                    this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
                    
                    setTimeout(() => {
                        this.style.transform = '';
                        this.style.boxShadow = '';
                    }, 300);
                    
                    // You can add more functionality here
                    showNodeDetails(level);
                });
                
                // Add keyboard accessibility
                node.setAttribute('tabindex', '0');
                node.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        this.click();
                    }
                });
            });
            
            // Entrance animation
            setTimeout(() => {
                animateTreeEntry();
            }, 500);
        });
        
        function showNodeDetails(level) {
            const details = {
                'root': 'Educational foundation and learning journey overview',
                'secondary': 'School Leaving Certificate (SEE) completed in 2075 with GPA 3.54',
                'higher-secondary': 'Higher Secondary Education (+2) completed in 2078 with GPA 3.04', 
                'bachelor': 'Currently pursuing BSc.CSIT - Bachelor in Computer Science and Information Technology',
                'skills': 'Core programming languages: Python, Java, JavaScript',
                'frameworks': 'Web development frameworks: Django, React, learning MERN stack',
                'systems': 'Linux system administration with Arch Linux and Hyprland',
                'future': 'Planning to learn AI/ML, Cloud technologies, and advanced DevOps practices'
            };
            
            // Create a simple alert for demo purposes
            // In a real application, you might show a modal or update a details panel
            alert(`${level.toUpperCase()}: ${details[level]}`);
        }
        
        function animateTreeEntry() {
            const nodes = document.querySelectorAll('.node');
            const connectors = document.querySelectorAll('.connector');
            
            // Initially hide all elements
            [...nodes, ...connectors].forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s ease';
            });
            
            // Animate elements in sequence
            let delay = 0;
            
            // Animate root first
            setTimeout(() => {
                nodes[0].style.opacity = '1';
                nodes[0].style.transform = 'translateY(0)';
            }, delay);
            delay += 300;
            
            // Then connectors and subsequent levels
            [...connectors, ...Array.from(nodes).slice(1)].forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, delay + (index * 100));
            });
        }

// Enhanced Educational Tree Functionality
const treeContainer = document.getElementById('educationTree');
if (treeContainer) {
    // Initialize tree state
    let isExpanded = true;
    let isAnimating = false;
    
    // Get all tree levels and nodes
    const treeLevels = treeContainer.querySelectorAll('.tree-level');
    const treeNodes = treeContainer.querySelectorAll('.tree-node');
    const controlButtons = {
        expandAll: document.getElementById('expandAll'),
        collapseAll: document.getElementById('collapseAll'),
        animateTree: document.getElementById('animateTree')
    };
    
    // Node click interactions
    treeNodes.forEach((node, index) => {
        node.addEventListener('click', function() {
            if (isAnimating) return;
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Show node details
            const nodeData = this.dataset.node;
            const nodeLabel = this.querySelector('.node-label')?.textContent || 'Node';
            const nodeDescription = this.querySelector('.node-description')?.textContent || 'Description';
            
            console.log(`Clicked on: ${nodeLabel} - ${nodeDescription}`);
            
            // Show tooltip with more details
            showNodeTooltip(this, {
                label: nodeLabel,
                description: nodeDescription,
                data: nodeData
            });
        });
        
        // Hover effects
        node.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        node.addEventListener('mouseleave', function() {
            this.style.zIndex = '';
        });
    });
    
    // Control button functionality
    if (controlButtons.expandAll) {
        controlButtons.expandAll.addEventListener('click', function() {
            expandAllLevels();
        });
    }
    
    if (controlButtons.collapseAll) {
        controlButtons.collapseAll.addEventListener('click', function() {
            collapseAllLevels();
        });
    }
    
    if (controlButtons.animateTree) {
        controlButtons.animateTree.addEventListener('click', function() {
            animateTreeSequence();
        });
    }
    
    // Function to expand all levels
    function expandAllLevels() {
        if (isAnimating) return;
        isAnimating = true;
        
        treeLevels.forEach((level, index) => {
            level.classList.remove('collapsed');
            level.classList.add('expanded');
            
            // Animate nodes in this level
            const levelNodes = level.querySelectorAll('.tree-node');
            levelNodes.forEach((node, nodeIndex) => {
                setTimeout(() => {
                    node.classList.add('animate-in');
                }, index * 200 + nodeIndex * 100);
            });
        });
        
        isExpanded = true;
        setTimeout(() => {
            isAnimating = false;
            // Clean up animation classes
            treeNodes.forEach(node => {
                node.classList.remove('animate-in');
            });
        }, treeLevels.length * 300);
    }
    
    // Function to collapse levels (except root)
    function collapseAllLevels() {
        if (isAnimating) return;
        isAnimating = true;
        
        // Keep level 0 (root) visible, collapse others
        treeLevels.forEach((level, index) => {
            if (index > 0) { // Skip root level
                const levelNodes = level.querySelectorAll('.tree-node');
                levelNodes.forEach((node, nodeIndex) => {
                    setTimeout(() => {
                        node.classList.add('animate-out');
                    }, nodeIndex * 50);
                });
                
                setTimeout(() => {
                    level.classList.add('collapsed');
                    level.classList.remove('expanded');
                }, levelNodes.length * 100);
            }
        });
        
        isExpanded = false;
        setTimeout(() => {
            isAnimating = false;
            // Clean up animation classes
            treeNodes.forEach(node => {
                node.classList.remove('animate-out');
            });
        }, 1000);
    }
    
    // Function to animate tree sequence
    function animateTreeSequence() {
        if (isAnimating) return;
        isAnimating = true;
        
        // Reset all nodes
        treeNodes.forEach(node => {
            node.style.transform = 'translateY(-20px) scale(0.8)';
            node.style.opacity = '0';
        });
        
        // Animate each level sequentially
        treeLevels.forEach((level, levelIndex) => {
            level.classList.remove('collapsed');
            level.classList.add('expanded');
            
            const levelNodes = level.querySelectorAll('.tree-node');
            levelNodes.forEach((node, nodeIndex) => {
                setTimeout(() => {
                    node.style.transition = 'all 0.6s ease-out';
                    node.style.transform = 'translateY(0) scale(1)';
                    node.style.opacity = '1';
                }, levelIndex * 800 + nodeIndex * 150);
            });
        });
        
        setTimeout(() => {
            isAnimating = false;
            // Reset inline styles
            treeNodes.forEach(node => {
                node.style.transform = '';
                node.style.opacity = '';
                node.style.transition = '';
            });
        }, treeLevels.length * 1000 + 2000);
    }
    
    // Function to show node tooltip
    function showNodeTooltip(node, data) {
        // Remove existing tooltips
        document.querySelectorAll('.custom-tooltip').forEach(tooltip => {
            tooltip.remove();
        });
        
        // Create new tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-header">
                <strong>${data.label}</strong>
            </div>
            <div class="tooltip-body">
                <p>${data.description}</p>
                <small>Interactive Tree Node</small>
            </div>
        `;
        
        // Style tooltip
        tooltip.style.cssText = `
            position: fixed;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            max-width: 300px;
            z-index: 1000;
            font-size: 0.9rem;
            line-height: 1.4;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(tooltip);
        
        // Position tooltip
        const rect = node.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 10;
        
        // Adjust if tooltip goes off screen
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) {
            top = rect.bottom + 10;
        }
        
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
        
        // Show tooltip
        setTimeout(() => {
            tooltip.style.opacity = '1';
        }, 10);
        
        // Remove tooltip after delay
        setTimeout(() => {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                tooltip.remove();
            }, 300);
        }, 3000);
    }
    
    console.log('🌳 Educational Tree initialized with interactive features!');
}
        
        // Responsive behavior
        window.addEventListener('resize', function() {
            // Adjust layout if needed for different screen sizes
            const container = document.querySelector('.tree-container');
            if (window.innerWidth < 768) {
                container.style.padding = '2rem 1rem';
            } else {
                container.style.padding = '3rem';
            }
        });
